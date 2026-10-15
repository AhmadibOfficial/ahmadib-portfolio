#!/usr/bin/env python3
"""Validate offline Metricool approved-auto drafts. No network or publishing calls."""
import argparse
import json
from pathlib import Path
from datetime import datetime

ROOT = Path(__file__).resolve().parents[1]
class GateError(ValueError):
    pass

def require(ok, message):
    if not ok:
        raise GateError(message)

def load():
    return tuple(json.loads((ROOT / p).read_text()) for p in [
        'editorial/channel_policy.json',
        'editorial/metricool_first_batch.json',
        'editorial/publications.json'])

def validate(policy, batch, registry):
    require(policy.get('publishing_mode') == 'approved-auto', 'Mode mismatch')
    require(policy.get('metricool_brand_id') == '7445168', 'Wrong Metricool brand')
    require(policy.get('timezone') == 'Africa/Lagos', 'Timezone mismatch')
    require(policy.get('external_publishing_enabled') is False, 'External publication enabled in source')
    require(policy.get('remote_connector_write_enabled_in_repo') is False, 'Remote write enabled in source')
    require(policy.get('unattended_approval_enabled') is False, 'Unattended approval enabled')
    require(policy.get('eligible_personal_networks') == ['instagram','tiktok','youtube'], 'Allowlist drift')
    require(policy['networks']['facebook']['verified_personal'] is False, 'Facebook must remain excluded')
    require(policy['networks']['linkedin']['connected'] is False, 'LinkedIn must remain excluded')
    require(batch.get('brand_id') == '7445168' and batch.get('timezone') == 'Africa/Lagos', 'Wrong batch target')
    require(batch.get('policy') == 'approved-auto' and batch.get('status') == 'PENDING_OWNER_APPROVAL', 'Premature batch activation')
    articles = {a['slug']:a for a in registry['articles']}
    items = batch.get('items')
    require(isinstance(items,list) and len(items)==4, 'First batch must have four items')
    seen = set()
    for item in items:
        name = item.get('id')
        require(isinstance(name,str) and name.startswith('AB-') and name not in seen, 'Duplicate/invalid post ID')
        seen.add(name)
        networks = item.get('networks')
        require(isinstance(networks,list) and len(networks)==1 and networks[0] in policy['eligible_personal_networks'],f'{name}: disallowed network')
        network = networks[0]
        require(policy['networks'][network]['connected'] and policy['networks'][network]['verified_personal'],f'{name}: unverified channel')
        require(item.get('brand_id')=='7445168' and item.get('timezone')=='Africa/Lagos',f'{name}: wrong destination')
        a = articles.get(item.get('article_slug'))
        require(a and a.get('website_approved') is True and a.get('social_approved') is False and a.get('disclosure_status') in ('cleared','not_applicable'), f'{name}: editorial approval missing')
        link = 'https://ahmadib.onrender.com/articles/' + item['article_slug'] + '.html'
        require(item.get('target_url')==link and link in item.get('caption',''),f'{name}: invalid article link')
        require(isinstance(item.get('caption'),str) and 50<=len(item['caption'])<=2400,f'{name}: missing caption')
        at = datetime.fromisoformat(item.get('publication_time',''))
        require(at.tzinfo is None and at.year>=2026,f'{name}: invalid local time')
        require(all(item.get(k)=='PENDING' for k in ('content_review','asset_review','channel_review','schedule_review')),f'{name}: claimed approval')
        require(item.get('owner_approved') is False and item.get('approved_at') is None,f'{name}: user has not approved')
        require(item.get('publication_approved') is False and item.get('auto_publish_currently_allowed') is False,f'{name}: publishing prematurely allowed')
        require(item.get('media_uploaded') is False and item.get('remote_post_id') is None and item.get('metricool_status')=='OFFLINE_DRAFT',f'{name}: remote record claimed')
        require(item.get('auto_publish_after_approval') is True,f'{name}: selected policy mismatch')
        media = item.get('media_files')
        require(isinstance(media,list) and len(media)>=1,f'{name}: media list missing')
        require(item.get('media_type') == ('image' if network=='instagram' else 'video'),f'{name}: invalid media type')
        require(item.get('content_type') == ('CAROUSEL' if network=='instagram' else 'SHORT'),f'{name}: invalid format')
    return items

def safe_preview(item):
    network=item['networks'][0]
    return {'draft':True,'autoPublish':False,'providers':[{'network':network}],
            'publicationDate':{'dateTime':item['publication_time'],'timezone':'Africa/Lagos'},
            'text':item['caption'],'media':[],'requiresHumanApproval':True,
            'NOT_READY_FOR_METRICOOL':True,'internalId':item['id']}

def main():
    p=argparse.ArgumentParser();p.add_argument('action',choices=('validate','report','preview'));args=p.parse_args()
    items=validate(*load())
    if args.action=='validate':
        print('Approved-auto valid:',len(items),'pending offline drafts; no network writes')
    elif args.action=='report':
        for x in items:
            print(x['id'],x['publication_time'],x['networks'][0],'PENDING',x['title'])
    else:
        print(json.dumps([safe_preview(x) for x in items],ensure_ascii=False,indent=2))

if __name__=='__main__':
    try:
        main()
    except (GateError,ValueError,KeyError) as e:
        raise SystemExit('BLOCKED: ' + str(e))
