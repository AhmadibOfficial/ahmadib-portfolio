"""Fail-closed checks for approved-auto publishing."""
import copy
import importlib.util
from pathlib import Path
import unittest

ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('approved_auto', ROOT/'scripts/metricool_approved_auto.py')
mod=importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

class MetricoolSafetyTests(unittest.TestCase):
    def setUp(self):
        self.p,self.b,self.r=mod.load()
    def test_valid_baseline(self):
        x=mod.validate(self.p,self.b,self.r)
        self.assertEqual(len(x),4)
        self.assertEqual([i['networks'][0] for i in x],['instagram','instagram','tiktok','youtube'])
        for i in x:
            draft=mod.safe_preview(i)
            self.assertTrue(draft['draft'])
            self.assertFalse(draft['autoPublish'])
            self.assertFalse(draft['media'])
    def test_account_switch_rejected(self):
        p=copy.deepcopy(self.p);p['metricool_brand_id']='7392897'
        with self.assertRaises(mod.GateError):mod.validate(p,self.b,self.r)
    def test_blocked_networks(self):
        for n in ('facebook','linkedin'):
            b=copy.deepcopy(self.b);b['items'][0]['networks']=[n]
            with self.assertRaises(mod.GateError):mod.validate(self.p,b,self.r)
    def test_approval_cannot_be_claimed_without_review(self):
        for k,v in [('owner_approved',True),('auto_publish_currently_allowed',True),('publication_approved',True),('media_uploaded',True)]:
            b=copy.deepcopy(self.b);b['items'][0][k]=v
            with self.assertRaises(mod.GateError):mod.validate(self.p,b,self.r)
    def test_no_unattended_publishing(self):
        for k in ('external_publishing_enabled','unattended_approval_enabled','remote_connector_write_enabled_in_repo'):
            p=copy.deepcopy(self.p);p[k]=True
            with self.assertRaises(mod.GateError):mod.validate(p,self.b,self.r)
    def test_no_unapproved_findings(self):
        r=copy.deepcopy(self.r);r['articles'][0]['disclosure_status']='pending'
        with self.assertRaises(mod.GateError):mod.validate(self.p,self.b,r)
    def test_media_type_enforced(self):
        b=copy.deepcopy(self.b);b['items'][2]['media_type']='image'
        with self.assertRaises(mod.GateError):mod.validate(self.p,b,self.r)

if __name__=='__main__':unittest.main()
