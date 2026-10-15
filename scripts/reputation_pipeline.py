#!/usr/bin/env python3
"""Offline, fail-closed editorial builder. No network, tokens or social write operations."""
from __future__ import annotations
import argparse
from datetime import date, datetime, time, timezone
from email.utils import format_datetime
from html import escape
from pathlib import Path
from urllib.parse import urlparse
import json
import re
import sys
import textwrap
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent
SITE = ROOT / 'publication'
REGISTRY = ROOT / 'editorial' / 'publications.json'
POLICY = ROOT / 'editorial' / 'channel_policy.json'
CARD_START = '<!-- JOURNAL_CARDS_START -->'
CARD_END = '<!-- JOURNAL_CARDS_END -->'
CARD_RE = re.compile(re.escape(CARD_START) + r'.*?' + re.escape(CARD_END), re.S)
ARTICLE_SLUG = re.compile(r'^[a-z0-9]+(?:-[a-z0-9]+)*$')
ALLOWED_CATEGORIES = {'android', 'api', 'tooling'}

class EditorialError(ValueError):
    pass

def read_json(path: Path):
    return json.loads(path.read_text(encoding='utf-8'))

def require(cond, message):
    if not cond:
        raise EditorialError(message)

def safe_web_url(url):
    u = urlparse(url)
    return u.scheme == 'https' and bool(u.netloc) and not u.username and not u.password

def validate_manifest(registry=None, policy=None, root=ROOT):
    registry = registry if registry is not None else read_json(root / 'editorial/publications.json')
    policy = policy if policy is not None else read_json(root / 'editorial/channel_policy.json')
    require(registry.get('schema') == 1, 'Unsupported registry schema')
    require(registry.get('site_url') == 'https://ahmadib.onrender.com', 'Unexpected publication destination')
    require(policy.get('schema') == 1, 'Unsupported channel-policy schema')
    require(policy.get('external_publishing_enabled') is False, 'External publishing must remain disabled in repository')
    require(policy.get('metricool_brand_id') == '7445168', 'Unverified Metricool brand')
    require(policy.get('timezone') == 'Africa/Lagos', 'Unexpected timezone')
    require(policy['networks']['facebook']['verified_personal'] is False, 'Shared Facebook destination must remain blocked until verified')
    require(policy['networks']['linkedin']['connected'] is False, 'LinkedIn not verified in this version')
    articles = registry.get('articles')
    require(isinstance(articles, list) and len(articles) > 0, 'Expected article metadata')
    seen = set()
    for a in articles:
        s = a.get('slug')
        require(isinstance(s, str) and bool(ARTICLE_SLUG.fullmatch(s)), f'Unsafe slug: {s}')
        require(s not in seen, f'Duplicate slug: {s}')
        seen.add(s)
        for key in ('title','summary','category_label'):
            require(isinstance(a.get(key), str) and 3 <= len(a[key]) <= 260, f'{s}: invalid {key}')
        require(a.get('category') in ALLOWED_CATEGORIES, f'{s}: unknown category')
        require(a.get('origin') in ('existing', 'markdown'), f'{s}: invalid origin')
        try: date.fromisoformat(a['date'])
        except (ValueError, KeyError, TypeError): raise EditorialError(f'{s}: invalid publication date')
        require(isinstance(a.get('read_minutes'), int) and 1 <= a['read_minutes'] <= 60, f'{s}: invalid reading time')
        require(isinstance(a.get('website_approved'), bool) and isinstance(a.get('social_approved'), bool), f'{s}: approvals must be boolean')
        require(a.get('evidence_state') in ('educational', 'verified'), f'{s}: unknown evidence state')
        require(a.get('disclosure_status') in ('not_applicable', 'pending', 'cleared'), f'{s}: invalid disclosure status')
        sources = a.get('source_urls')
        require(isinstance(sources, list) and len(sources) >= 1 and all(isinstance(x,str) and safe_web_url(x) for x in sources), f'{s}: at least one safe HTTPS source required')
        # Fail closed: no social approval without website approval and disclosure clearance.
        if a['social_approved']:
            require(a['website_approved'], f'{s}: social approved before web')
            require(a['disclosure_status'] in ('not_applicable', 'cleared'), f'{s}: social embargoed')
        if a['website_approved']:
            require(a['disclosure_status'] in ('not_applicable', 'cleared'), f'{s}: unapproved disclosure')
            if a['evidence_state'] == 'verified':
                require(a['disclosure_status'] == 'cleared', f'{s}: finding lacks disclosure clearance')
            p = root / 'publication/articles' / f'{s}.html'
            if a['origin'] == 'existing':
                require(p.is_file(), f'{s}: missing existing article')
            else:
                approved_content = root / 'editorial/approved' / f'{s}.md'
                require(approved_content.is_file(), f'{s}: approved Markdown source missing')
                require('<!--' not in approved_content.read_text(encoding='utf-8'), f'{s}: HTML comments not permitted')
    return articles

def format_inline(text):
    # Escape every character first, then permit only ordinary HTTPS Markdown links.
    fragments = []
    regex = re.compile(r'\[([^\]]{1,90})\]\((https://[^\s)]+)\)')
    pos = 0
    for m in regex.finditer(text):
        fragments.append(escape(text[pos:m.start()]))
        if safe_web_url(m.group(2)):
            fragments.append(f'<a href="{escape(m.group(2), quote=True)}" target="_blank" rel="noopener noreferrer">{escape(m.group(1))}</a>')
        else:
            fragments.append(escape(m.group(0)))
        pos=m.end()
    fragments.append(escape(text[pos:]))
    return ''.join(fragments)

def render_markdown_safe(md):
    output = []
    in_code=False
    in_list=False
    paragraph=[]
    def flush_para():
        if paragraph:
            output.append('<p>'+format_inline(' '.join(paragraph))+'</p>')
            paragraph.clear()
    def flush_list():
        nonlocal in_list
        if in_list:
            output.append('</ul>')
            in_list=False
    for ln in md.splitlines():
        line=ln.rstrip()
        if line.startswith('```'):
            flush_para(); flush_list()
            output.append('</code></pre>' if in_code else '<pre><code>')
            in_code=not in_code
        elif in_code:
            output.append(escape(line)+'\n')
        elif not line.strip():
            flush_para(); flush_list()
        elif line.startswith('#') and re.match(r'^#{1,3}\s',line):
            flush_para();flush_list();level=len(line)-len(line.lstrip('#'))
            output.append(f'<h{level+1}>{format_inline(line[level:].strip())}</h{level+1}>')
        elif line.startswith('- '):
            flush_para()
            if not in_list:output.append('<ul>');in_list=True
            output.append('<li>'+format_inline(line[2:])+'</li>')
        else:
            flush_list();paragraph.append(line.strip())
    flush_para();flush_list()
    if in_code:output.append('</code></pre>')
    return '\n'.join(output)

def render_new_article(a, template):
    slug=a['slug']
    md=(ROOT/'editorial/approved'/f'{slug}.md').read_text(encoding='utf-8')
    require(len(md.strip()) >= 200, f'{slug}: article body too short')
    # Extract existing, styled header/footer; content is fully escaped before insertion.
    head_start=template[:template.index('</head>')]
    head_start=re.sub(r'<title>.*?</title>', f'<title>{escape(a["title"])} | Ahmad-IB Research Journal</title>',head_start, count=1, flags=re.S)
    head_start=re.sub(r'<meta name="description" content="[^"]*">',f'<meta name="description" content="{escape(a["summary"], quote=True)}">',head_start,count=1)
    head_start=re.sub(r'<link rel="canonical" href="[^"]+">',f'<link rel="canonical" href="https://ahmadib.onrender.com/articles/{slug}.html">',head_start,count=1)
    head_start=head_start.replace('href="../assets/style.css"','href="../assets/style.css"')
    # Re-use only the site's fixed chrome; no insertion of untrusted HTML from any external source.
    header=re.search(r'<header class="site-header">.*?</header>',template,flags=re.S).group(0)
    footer=re.search(r'<footer class="site-footer">.*?</footer>',template,flags=re.S).group(0)
    main=f'<main id="main"><section class="section"><div class="container" style="max-width:850px"><p class="breadcrumb"><a href="../index.html">← Back to journal</a> / {escape(a["category_label"])}</p><div class="eyebrow">Ahmad-IB Research Journal · {escape(a["date"])}</div><h1>{escape(a["title"])}</h1><p class="lead">{escape(a["summary"])}</p><article class="article-content">{render_markdown_safe(md)}</article><p><a href="../index.html#articles">← All research articles</a></p></div></section></main>'
    return head_start+'</head><body><a class="skip-link" href="#main">Skip to content</a>'+header+main+footer+'</body></html>\n'

def card(a, i):
    e=lambda v: escape(str(v),quote=True)
    colors={'android':'teal','api':'cream','tooling':''}
    color=colors[a['category']]
    stamp=date.fromisoformat(a['date']).strftime('%d %b %Y').lstrip('0')
    search=' '.join([a['title'],a['summary'],a['category_label']]).lower()
    return (f'<article class="card" data-article-card data-category="{e(a["category"])}" data-search="{e(search)}">'
        f'<a href="articles/{e(a["slug"])}.html" aria-label="Read: {e(a["title"])}" style="display:block;text-decoration:none">'
        f'<div class="card-art {color}"><span class="art-number" aria-hidden="true">{i:02d}</span><span class="art-tag">FIELD NOTE / {i:02d}</span></div>'
        f'<div class="card-copy"><span class="pill">{e(a["category_label"])}</span><h3>{e(a["title"])}</h3>'
        f'<p>{e(a["summary"])}</p><div class="card-meta"><span>{a["read_minutes"]} min read · {e(stamp)}</span><strong>Read article ↗</strong></div></div></a></article>')

def make_site(articles, root=ROOT):
    public=sorted([a for a in articles if a['website_approved']],key=lambda a:(a['date'],a['slug']),reverse=True)
    index=(root/'publication/index.html').read_text(encoding='utf-8')
    cards=''.join(card(a,i) for i,a in enumerate(public,1))
    if CARD_START not in index:
        old=re.search(r'(<p id="article-count".*?</p><div class="grid-3">)(.*?)(</div><div id="empty-state")', index, flags=re.S)
        require(old is not None, 'Home page article grid was not found')
        index=index[:old.start(2)]+CARD_START+old.group(2)+CARD_END+index[old.end(2):]
    require(CARD_RE.search(index) is not None,'Broken card boundaries')
    index=CARD_RE.sub(lambda m:CARD_START+cards+CARD_END,index,count=1)
    index=re.sub(r'(<p id="article-count"[^>]*>).*?(</p>)',lambda m:m.group(1)+f'{len(public)} articles available'+m.group(2),index,count=1,flags=re.S)
    if 'editorial-policy.html' not in index:
        index=index.replace('<a href="feed.xml">RSS feed</a>','<a href="feed.xml">RSS feed</a><a href="editorial-policy.html">Editorial standards</a>')
    results={'publication/index.html':index}
    if public:
        tmpl=(root/'publication/articles/android-security-toolkit.html').read_text(encoding='utf-8')
        for a in public:
            if a['origin']=='markdown':results[f'publication/articles/{a["slug"]}.html']=render_new_article(a,tmpl)
    rss=['<?xml version="1.0" encoding="UTF-8"?>','<rss version="2.0"><channel>','<title>Ahmad-IB Security Research Journal</title>','<link>https://ahmadib.onrender.com/</link>','<description>Evidence-led research on Android, API and application security by Ahmad Ibrahim.</description>','<language>en</language>']
    for a in public:
        url=f'https://ahmadib.onrender.com/articles/{a["slug"]}.html'
        pub=format_datetime(datetime.combine(date.fromisoformat(a['date']),time(12,0),tzinfo=timezone.utc))
        rss.append(f'<item><title>{escape(a["title"])}</title><link>{url}</link><guid isPermaLink="true">{url}</guid><description>{escape(a["summary"])}</description><pubDate>{pub}</pubDate></item>')
    rss.append('</channel></rss>')
    results['publication/feed.xml']='\n'.join(rss)+'\n'
    allurls=[('https://ahmadib.onrender.com/','2026-10-15'),('https://ahmadib.onrender.com/editorial-policy.html','2026-10-15')]+[(f'https://ahmadib.onrender.com/articles/{a["slug"]}.html',a['date']) for a in public]
    xml=['<?xml version="1.0" encoding="UTF-8"?>','<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for url,lastmod in allurls:xml.append(f'<url><loc>{url}</loc><lastmod>{lastmod}</lastmod></url>')
    xml.append('</urlset>')
    results['publication/sitemap.xml']='\n'.join(xml)+'\n'
    results['publication/article-index.json']=json.dumps([{'title':a['title'],'summary':a['summary'],'category':a['category'],'date':a['date'],'url':f'https://ahmadib.onrender.com/articles/{a["slug"]}.html'} for a in public],ensure_ascii=False,indent=2)+'\n'
    return results, public

def make_metricool_drafts(articles, policy):
    queue=[]
    for a in articles:
        if not a['website_approved']:continue
        link=f'https://ahmadib.onrender.com/articles/{a["slug"]}.html'
        caption=f'{a["title"]}\n\n{a["summary"]}\n\nRead the full field note: {link}\n\n#AppSec #SecurityResearch'
        queue.append({'article_slug':a['slug'],'title':a['title'],'canonical_url':link,'draft_caption':caption,'approved_for_social':a['social_approved'],'publication_site':'ahmadib.onrender.com','metricool_brand_id':policy['metricool_brand_id'],'timezone':policy['timezone'],'destination':'unselected','destination_verified':False,'media_assets':[], 'remote_metricool_draft_created':False,'external_publish_allowed':False,'status':'DRAFT_REVIEW','instruction':'Human must confirm caption, destination, media and time before any connector write.'})
    return queue

def main(argv=None):
    p=argparse.ArgumentParser(description='Safe publication/reputation build; no external writes')
    p.add_argument('command',choices=['build','check','validate','preview-social'])
    args=p.parse_args(argv)
    articles=validate_manifest()
    policy=read_json(POLICY)
    contents, published=make_site(articles)
    for f in ('publication/feed.xml','publication/sitemap.xml'):
        ET.fromstring(contents[f])
    if args.command=='validate':
        print(f'Validated {len(articles)} articles; {len(published)} already approved for web. External publishing disabled.')
        return 0
    if args.command=='preview-social':
        print(json.dumps(make_metricool_drafts(articles,policy),ensure_ascii=False,indent=2))
        return 0
    if args.command=='check':
        dirty=[path for path,content in contents.items() if not (ROOT/path).exists() or (ROOT/path).read_text(encoding='utf-8')!=content]
        if dirty:
            print('Generated files not in sync:',', '.join(dirty),file=sys.stderr)
            return 1
        print('Generated site matches approved registry; no unapproved articles included.')
        return 0
    for path,content in contents.items():
        dest=ROOT/path
        dest.parent.mkdir(parents=True,exist_ok=True)
        dest.write_text(content,encoding='utf-8')
    target=ROOT/'outbox'
    target.mkdir(exist_ok=True)
    (target/'metricool_review_queue.json').write_text(json.dumps(make_metricool_drafts(articles,policy),ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(f'Built {len(published)} approved articles; offline Metricool review queue created locally. Nothing was posted.')
    return 0

if __name__=='__main__':
    try:raise SystemExit(main())
    except EditorialError as exc:
        print(f'Editorial safety gate: {exc}',file=sys.stderr)
        raise SystemExit(2)
