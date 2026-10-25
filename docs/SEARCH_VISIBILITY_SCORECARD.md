# Ahmad-IB — Google Search visibility & research credibility scorecard

**Scope:** Public website https://ahmadib.onrender.com/ and the related GitHub Pages professional portfolio. This document is a private-to-repository tracking aid, **not** a claim of Google ranking, security awards, press coverage, or independent recognition.

## Verified baseline — 25 October 2026

| Check | Supported result | Source |
| --- | --- | --- |
| Search Console URL-prefix ownership | Verified | Site owner confirmed in Search Console |
| Sitemap submission | **Success**; submitted and last read 25 Oct 2026 | Site owner supplied Search Console status |
| Website sitemap endpoints | Seven listed pages: homepage, profile, online resume, four articles | Public sitemap and static source verification |
| Google live URL inspection | Fetch successful, crawl/indexing permitted | Site owner supplied live inspection |
| Homepage indexed | **Confirmed** by owner on 25 Oct 2026 | Google Search Console URL Inspection |
| Total indexed URL count | **Not yet confirmed** | Await Page indexing report |
| Search impressions, clicks, CTR, position | **Not yet confirmed** | Await Performance → Search results |
| Google Knowledge Panel | **Not confirmed** | No claim or prerequisite |
| Wikipedia notability | **Not assessed/established** | Requires substantive independent, reliable coverage |
| Bug bounty Hall of Fame entries | **No recognition claimed** | Only publish if an official program verifies it |

**Do not enter zero for unreported metrics.** “Unknown” means data is unavailable, not that Google recorded zero visits or impressions.

## Weekly observation workflow

Record the report's actual data period and collection date; Search Console data can lag. Use a consistent date range across comparisons.

1. In **Search Console → Indexing → Pages**, check indexed and non-indexed canonical URLs. Inspect the homepage, /profile.html, and each of the four research pages only when useful. Record Google-selected canonical if displayed.
2. Under **Sitemaps**, record the sitemap status, last read date, and discovered URL count if Search Console reports it. Keep the original Google HTML verification file deployed.
3. Under **Performance → Search results**, record total impressions, clicks, average CTR, and average position for the same reporting period. Use the five **exact priority phrases** below as a tracking cohort; filter or review each query separately (and compare with broader contains-matches only when explicitly labelled as such). Search Console anonymizes some queries; these filters won't capture every relevant impression.
4. Check **Pages** within Performance to measure how the biography and research articles are discovered individually.
5. Track genuine research outcomes separately. Cite actual open-source PR merges, published reproducible research, authorized remediation acknowledgments and official Hall of Fame links where available. Do not treat self-authored bios or directory entries as independent press coverage.

## Five priority search queries — owner-selected, 25 October 2026

These phrases are the **monitoring targets**, not verified Google search queries, rankings or traffic. Search Console will only report measurable queries where sufficient data is available.

| Priority | Target query | Intent | Impressions | Clicks | CTR | Average position | First reported |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Ahmad Ibrahim | Name discovery; may include unrelated namesakes | Unknown | Unknown | Unknown | Unknown | Not yet reported |
| 2 | Ahmad-IB | Distinct professional name | Unknown | Unknown | Unknown | Unknown | Not yet reported |
| 3 | AhmadibOfficial | Consistent online account identifier | Unknown | Unknown | Unknown | Unknown | Not yet reported |
| 4 | Ahmad Ibrahim cybersecurity | Topic-specific professional discovery | Unknown | Unknown | Unknown | Unknown | Not yet reported |
| 5 | Ahmad Ibrahim software engineer | Role-specific professional discovery | Unknown | Unknown | Unknown | Unknown | Not yet reported |

**Collection method:** Search Console → Performance → Search results → Queries. Choose the same date range for all five. For each phrase, apply **Query → Exact query** if available, record the four numerical measures from the filtered view, and clear the filter before the next phrase. If the interface/export shows no row, use **Not reported** rather than inferring there were no searches. A broad Query contains filter can combine longer variants but must not be labelled as an exact-query metric. Do not claim any ranking without data.

**Interpretation:** “Ahmad Ibrahim” is not a unique identifier and may refer to other people. “Ahmad-IB” and “AhmadibOfficial” are more specific branded queries. The two role-qualified phrases can indicate whether Google connects the portfolio to the intended professional topics. Track the profile page, resume and technical articles in **Pages** separately from query metrics.

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
