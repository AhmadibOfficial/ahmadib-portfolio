# Ahmad-IB: Research → Journal → Metricool

This is an evidence- and rights-gated workflow. As of October 17, 2026 the owner has authorized automatic Metricool scheduling of routine public educational content without individual review prompts. The repository's static build and offline scripts themselves do not perform social network writes. Everything runs on Python 3.11+ using the standard library. Nothing requires a database, new hosting, or additional paid subscription.

## Current verified systems

| System | Connection | Safeguard |
|---|---|---|
| GitHub | `AhmadibOfficial/ahmadib-portfolio`, `publication-render` | Source of truth for public journal |
| Render | `ahmadib.onrender.com` | `autoDeploy=no`, separate manual deployment |
| Metricool | Workspace `ahmadibofficial`, brand `7445168` | Four posts confirmed scheduled in Metricool; no network/API publishing logic in repo |
| LinkedIn | Not connected to Metricool | Never select without reconnection & verification |
| Facebook | Shared ID with MetaAutomate workspace | Explicitly blocked |
| Instagram | `@ahmadib_official` connected | Original media + quality checks |
| TikTok / YouTube | Connected | 30–120 second narrated/soundtracked video + subtitles + written post |

## Editorial state machine

`IDEA → PRIVATE RESEARCH → FACT CHECK → DISCLOSURE CHECK → PUBLIC JOURNAL ARTICLE → VERIFIED SOCIAL ASSETS → AUTOMATIC QUALITY CHECK → METRICOOL SCHEDULE → PUBLISHED → MEASURED`

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
3. Routine educational posts may be scheduled automatically under the owner's standing October 17 authorization after source, safety, original media, caption, destination, duplicate and platform checks. A sensitive real-world finding still requires its independent disclosure authorization and clearance.
4. Use Metricool with autoPublish=true and verify the resulting post UUID and planner URL. Do not invoke paid team-management review for routine posts. If the authenticated integration or necessary media is unavailable, skip publishing and report the blocker. This repo contains **no Metricool credentials** and makes no Metricool API calls.
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
- The historical offline review queue is not the current social calendar. Four real posts were scheduled and verified in Metricool; see `editorial/metricool_scheduled_receipt.json`.
- `.github/workflows/editorial-checks.yml` runs on PRs to `publication-render`; it has only read permissions and no deployment or social write steps.
- CI is advisory until repository branch protection is independently configured by the owner.

## Accountability

- A build success does not equal permission to disclose.
- A published static page does not prove a vulnerability finding.
- Research and marketing must both accurately distinguish a tutorial, an observation, a candidate risk and a confirmed result.
- Never claim social posts are scheduled without a returned Metricool post record.

## Automatic quality-gated distribution (October 17, 2026)

The owner has granted standing permission for routine, sourced educational posts to be published automatically after quality and rights checks. Do not ask for per-post approval. Keep Facebook and LinkedIn blocked, and never disclose private or embargoed findings. The four V3 posts already have attached media and autoPublish=true in Metricool; exact dates and UUIDs are in `editorial/metricool_scheduled_receipt.json`. The Monday publishing automation may generate and schedule future posts when its connected tools and finalized licensed media are available, but must never invent a success. PR #2 is still a draft and does not authorize Render deployment.
