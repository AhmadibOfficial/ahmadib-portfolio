# Ahmad-IB — Google Search visibility & research credibility scorecard

**Scope:** Public website https://ahmadib.onrender.com/ and the related GitHub Pages professional portfolio. This document is a private-to-repository tracking aid, **not** a claim of Google ranking, security awards, press coverage, or independent recognition.

## Verified baseline — 25 October 2026

| Check | Supported result | Source |
| --- | --- | --- |
| Search Console URL-prefix ownership | Verified | Site owner confirmed in Search Console |
| Sitemap submission | **Success**; submitted and last read 25 Oct 2026 | Site owner supplied Search Console status |
| Website sitemap endpoints | Seven listed pages: homepage, profile, online resume, four articles | Public sitemap and static source verification |
| Google live URL inspection | Fetch successful, crawl/indexing permitted | Site owner supplied live inspection |
| Indexed URL count | **Not yet confirmed** | Await Page indexing report |
| Search impressions, clicks, CTR, position | **Not yet confirmed** | Await Performance → Search results |
| Google Knowledge Panel | **Not confirmed** | No claim or prerequisite |
| Wikipedia notability | **Not assessed/established** | Requires substantive independent, reliable coverage |
| Bug bounty Hall of Fame entries | **No recognition claimed** | Only publish if an official program verifies it |

**Do not enter zero for unreported metrics.** “Unknown” means data is unavailable, not that Google recorded zero visits or impressions.

## Weekly observation workflow

Record the report's actual data period and collection date; Search Console data can lag. Use a consistent date range across comparisons.

1. In **Search Console → Indexing → Pages**, check indexed and non-indexed canonical URLs. Inspect the homepage, /profile.html, and each of the four research pages only when useful. Record Google-selected canonical if displayed.
2. Under **Sitemaps**, record the sitemap status, last read date, and discovered URL count if Search Console reports it. Keep the original Google HTML verification file deployed.
3. Under **Performance → Search results**, record total impressions, clicks, average CTR, and average position for the same reporting period. Filter queries for “Ahmad Ibrahim”, “Ahmad-IB”, and “AhmadibOfficial”. Search Console anonymizes some queries; these filters won't capture every relevant impression.
4. Check **Pages** within Performance to measure how the biography and research articles are discovered individually.
5. Track genuine research outcomes separately. Cite actual open-source PR merges, published reproducible research, authorized remediation acknowledgments and official Hall of Fame links where available. Do not treat self-authored bios or directory entries as independent press coverage.

## Scorecard template

| Reporting period | Sitemap status | Indexed canonical pages | Brand-query impressions | Brand-query clicks | Total search impressions | Independent verified mentions | Notes/evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 25 Oct 2026 baseline | Success | Unknown | Unknown | Unknown | Unknown | Unknown | Initial user-confirmed Search Console data |
| Next weekly review | _From GSC_ | _From GSC_ | _From GSC_ | _From GSC_ | _From GSC_ | _Source URLs_ | _Review date and evidence_ |

## Content quality acceptance

Before publishing any research article or product story:
- Offer meaningful original analysis or a reproducible technical example, not an unsupported promise.
- Give the reader an accountable author, methodology, context, limitations and source links.
- Separate **observation**, **hypothesis**, **confirmed finding**, **fixed issue**, and **official recognition**.
- Follow authorization boundaries, responsible disclosure, and privacy-safe proof handling.
- Link to existing related work naturally. No mass-produced pages or artificial backlinks.

## Technical checks

Run source-only checks independently from Google's indexing:

```bash
node scripts/verify-site.mjs
node publication/scripts/verify-site.mjs
```

The publication gate validates all seven sitemap URLs, exact canonical links, article-to-author relationships, robots.txt and the Google verification file. The GitHub Pages gate checks its own canonical/sitemap and the cross-link to the official biography.

**Key boundary:** These tests prove that the checked-in source is prepared for discovery. Only Google Search Console can report which pages Google actually indexed or served in search results.
