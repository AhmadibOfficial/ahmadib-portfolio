# Ahmad Ibrahim — Portfolio V3

A responsive static portfolio for Ahmad Ibrahim, built with HTML, CSS and vanilla JavaScript for GitHub Pages.

## Purpose

Showcase application security, software engineering, selected products, research tools and verified public downloads.

## Rebuild policy

- No Vercel/Netlify, paid libraries, frameworks or required build pipeline.
- Works offline after checkout (external project/download links require internet).
- Existing GitHub Pages production on main is not changed until this feature branch is reviewed and merged.
- No fabricated certifications, CV download, verified vulnerability claims or published MVPs.
- Private repository materials are never linked as downloadable source files.

## Project status / download evidence (checked 2026-10-23)

| Project | Visibility / release | Public downloads |
| --- | --- | --- |
| OneCall | Public repository, pre-release USB phone pilot tag phone-pilot-10-1 | Android test APK with local backend / USB reverse dependency. Read full release notes and verify SHA256. Not a production standalone app. |
| Android Security Toolkit | Public Python source (Apache-2.0), no verified binary release | Source ZIP of main. Install using README, Python 3.11+. |
| MetaAutomate | Private repository | No downloadable package. Public business website only. |
| Security Research OS | Private repository | No downloadable package. |
| Safwa Quran | Private repository, public release blocked pending content and device reviews | No downloadable package. |
| IMarket | Concept / early engineering | No verified public release. |
| Nayvelo Mobile | Telecom concept / simulated design | No verified public release. |

The OneCall repository has a proprietary license; linking its intentionally published test APK does not grant broad redistribution or re-licensing rights. The portfolio does not mirror that binary.

## Test

From the repository root:

```bash
python3 -m http.server 8000
# Open http://localhost:8000
node --check js/script.js
node scripts/verify-site.mjs
git diff --check
```

Confirm keyboard navigation, mobile menu, project filters, source/download links, responsive layout and readable content with JavaScript disabled.

## Deploy

GitHub Pages remains configured from main / (root). After review and successful testing, merge the PR into main. The deployment will use the current root index.html.

## Add new MVP download

Only add a download button after verifying (1) public distribution rights, (2) the exact artifact, (3) supported platform and prerequisites, (4) checksum/signature where applicable, (5) release status, and (6) install instructions.

## Contact

GitHub: https://github.com/AhmadibOfficial

## VAILABLE project and research objective

VAILABLE is a private, early-stage document productivity project with a product blueprint and safeguarded development automation foundation; the public website describes its intended functionality, not a released service. The Hall of Fame research objective is aspirational: recognition depends on validated findings, responsible disclosure and genuine remediation contributions.
