"""Unit tests exercising publication and disclosure gates without external services."""
import copy
import importlib.util
import json
import tempfile
import unittest
from pathlib import Path
from html.parser import HTMLParser

ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('reputation_pipeline', ROOT/'scripts/reputation_pipeline.py')
mod=importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

class PipelineTests(unittest.TestCase):
    def setUp(self):
        self.registry=json.loads((ROOT/'editorial/publications.json').read_text())
        self.policy=json.loads((ROOT/'editorial/channel_policy.json').read_text())

    def test_safety_and_site_idempotent(self):
        records=mod.validate_manifest(self.registry,self.policy)
        outputs,public=mod.make_site(records)
        self.assertEqual(len(public),3)
        for path,content in outputs.items():
            self.assertEqual(content,(ROOT/path).read_text(),path)

    def test_website_not_approved_never_leaks(self):
        registry=copy.deepcopy(self.registry)
        candidate=copy.deepcopy(registry['articles'][0])
        candidate.update(slug='embargoed-fictional-research',title='Embargoed fictional research not for publication',website_approved=False,social_approved=False,disclosure_status='pending',origin='markdown')
        registry['articles'].append(candidate)
        publications=mod.validate_manifest(registry,self.policy)
        generated,public=mod.make_site(publications)
        self.assertNotIn('embargoed-fictional-research',generated['publication/index.html'])
        self.assertNotIn('embargoed-fictional-research',generated['publication/feed.xml'])
        self.assertNotIn('embargoed-fictional-research',generated['publication/sitemap.xml'])
        self.assertNotIn('embargoed-fictional-research',generated['publication/article-index.json'])
        self.assertNotIn('embargoed-fictional-research',json.dumps(mod.make_metricool_drafts(publications,self.policy)))

    def test_approval_does_not_bypass_disclosure(self):
        r=copy.deepcopy(self.registry)
        r['articles'][0]['disclosure_status']='pending'
        with self.assertRaises(mod.EditorialError):mod.validate_manifest(r,self.policy)
        r=copy.deepcopy(self.registry)
        r['articles'][0]['evidence_state']='verified'
        with self.assertRaises(mod.EditorialError):mod.validate_manifest(r,self.policy)

    def test_facebook_and_external_writes_blocked(self):
        p=copy.deepcopy(self.policy)
        p['external_publishing_enabled']=True
        with self.assertRaises(mod.EditorialError):mod.validate_manifest(self.registry,p)
        p=copy.deepcopy(self.policy)
        p['networks']['facebook']['verified_personal']=True
        with self.assertRaises(mod.EditorialError):mod.validate_manifest(self.registry,p)

    def test_invalid_slug_rejected(self):
        r=copy.deepcopy(self.registry)
        r['articles'][0]['slug']='../secrets'
        with self.assertRaises(mod.EditorialError):mod.validate_manifest(r,self.policy)

    def test_unsafe_html_is_escaped(self):
        sample='<script>alert(1)</script> [research](javascript:alert(1))'
        html=mod.render_markdown_safe('## Heading\n\n'+sample)
        self.assertNotIn('<script>',html)
        self.assertNotIn('href="javascript:',html)
        self.assertIn('&lt;script&gt;',html)

    def test_no_implicit_scheduling(self):
        posts=mod.make_metricool_drafts(self.registry['articles'],self.policy)
        self.assertEqual(len(posts),3)
        for p in posts:
            self.assertEqual(p['status'],'DRAFT_REVIEW')
            self.assertFalse(p['external_publish_allowed'])
            self.assertFalse(p['remote_metricool_draft_created'])
            self.assertFalse(p['destination_verified'])
            self.assertEqual(p['destination'],'unselected')

    def test_feed_and_sitemap_valid(self):
        import xml.etree.ElementTree as ET
        for p in ('feed.xml','sitemap.xml'):
            ET.parse(ROOT/'publication'/p)
        public=json.loads((ROOT/'publication/article-index.json').read_text())
        self.assertEqual(len(public),3)
        self.assertTrue(all(p['url'].startswith('https://ahmadib.onrender.com/articles/') for p in public))

if __name__=='__main__':unittest.main()
