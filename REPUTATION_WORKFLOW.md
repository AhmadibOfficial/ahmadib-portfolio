# Ahmad-IB: Research → Journal → Metricool

This is a **review-first** workflow; it does not provide autonomous external publishing. Everything runs on Python 3.11+ using the standard library. Nothing requires a database, new hosting, or additional paid subscription.

## Current verified systems

| System | Connection | Safeguard |
|---|---|---|
| GitHub | `AhmadibOfficial/ahmadib-portfolio`, `publication-render` | Source of truth for public journal |
| Render | `ahmadib.onrender.com` | `autoDeploy=no`, separate manual deployment |
| Metricool | Workspace `ahmadibofficial`, brand `7445168` | Draft review only; no network/API publishing logic in repo |
| LinkedIn | Not connected to Metricool | Never select without reconnection & verification |
| Facebook | Shared ID with MetaAutomate workspace | Explicitly blocked |
| Instagram | `@ahmadib_official` connected | Original media + manual approval needed |
| TikTok / YouTube | Connected | Original approved video + manual approval needed |

## Editorial state machine

`IDEA → PRIVATE RESEARCH → FACT CHECK → DISCLOSURE REVIEW → WEBSITE APPROVED → GITHUB REVIEW → RENDER DEPLOY → SOCIAL DRAFT → CHANNEL/MEDIA APPROVAL → METRICOOL REVIEW → PUBLISHED → MEASURED`

### First: protect source research

Create embargoed or customer-specific research only in an approved private workspace. **Do not commit drafts, unreleased findings, secrets, third-party APKs, personal data, or private exploits to this public repository or to a public feature branch.** `editorial/sample-proposal.json` is fictional and safe to commit; it is not processed.

### Website publication

1. Confirm written testing authorization and scope for any real vulnerability claim.
2. Verify sources and redact private material. For real findings, obtain coordinated disclosure clearance and confirm the embargo has ended.
3. Create a public-ready, sanitized article at `editorial/approved/<slug>.md`. Enter its metadata in `editorial/publications.json` with `origin: "markdown"`, reliable HTTPS sources, `website_approved: true`, and either `evidence_state: "educational"` and `disclosure_status: "not_applicable"` or `evidence_state: "verified"` and `disclosure_status: "cleared"`.
4. Run `python scripts/reputation_pipeline.py build` from the repository root. The builder creates the static HTML page, refreshes the research cards, RSS, sitemap, and public article index; it also writes an **offline-only** social review queue under ignored `outbox/`.
5. Run `python scripts/reputation_pipeline.py check` and `python -m unittest discover -s tests -v`.
6. Open a pull request against `publication-render`, inspect rendered content + source links, and obtain human editorial approval before merging. CI only *checks*; it does not certify authorization or disclosure.
7. After an explicit publication decision, trigger the **Ahmadib** Render deployment manually. Render's auto-deploy setting is off. Verify HTTP, article canonical URLs, sitemap, RSS and mobile interactions after deployment.

### Social publishing

1. Read `outbox/metricool_review_queue.json` and the existing twelve approved-calendar *draft* ideas in the separate reputation pack.
2. Choose one personal channel, verify its handle/account and media requirements, review the final caption and schedule.
3. Only when the user explicitly approves a particular caption, media, date, account, and channel, use the connected Metricool integration to create a review-stage draft/post.
4. Metricool's review feature may require a team-management plan; if unavailable, retain draft-only status and use a manual approval step. This repo contains **no Metricool credentials** and makes no Metricool API calls.
5. Never auto-post to Facebook while its ID overlaps the company workspace. LinkedIn requires connection to the personal profile before enabling.
6. Track the published post URL, article canonical URL, reach, clicks and qualified inbound opportunities using verified Metricool analytics.

## Quick commands

```bash
python scripts/reputation_pipeline.py validate
python scripts/reputation_pipeline.py build
python scripts/reputation_pipeline.py check
python scripts/reputation_pipeline.py preview-social
python -m unittest discover -s tests -v
```

The site assets live under `publication/`; the generator is **idempotent**. The public website does not expose `editorial/`, `outbox/`, or any credential store because Render's `publishPath` is set to `publication`.

## Current baseline

- Three already-published educational articles are listed in the registry with website approval reflecting their *existing public state*, not a new authorization of future findings.
- None of these articles has a social publication approval. The generated queue is marked `DRAFT_REVIEW` with publishing disabled.
- `.github/workflows/editorial-checks.yml` runs on PRs to `publication-render`; it has only read permissions and no deployment or social write steps.
- CI is advisory until repository branch protection is independently configured by the owner.

## Accountability

- A build success does not equal permission to disclose.
- A published static page does not prove a vulnerability finding.
- Research and marketing must both accurately distinguish a tutorial, an observation, a candidate risk and a confirmed result.
- Never claim social posts are scheduled without a returned Metricool post record.

## Approved-auto distribution (October 15, 2026)

Selected policy: **explicit per-post approval → automatic publication at the confirmed scheduled time**. Facebook remains blocked; LinkedIn remains unconnected. Review the four pending posts at `editorial/metricool_first_batch.json` and the gate in `scripts/metricool_approved_auto.py`. No repo source performs Metricool publishing, and PR #2 is not a release approval.
