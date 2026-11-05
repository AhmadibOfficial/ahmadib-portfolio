# Ahmad Ibrahim — Portfolio V3

A responsive static portfolio for Ahmad Ibrahim, built with HTML, CSS and vanilla JavaScript for GitHub Pages.

## Purpose

Showcase application security, software engineering, selected products, source-backed research and publicly accessible engineering resources.

## Rebuild policy

- No Vercel/Netlify, paid libraries, frameworks or required build pipeline.
- Works offline after checkout (external project/download links require internet).
- Existing GitHub Pages production on main is not changed until this feature branch is reviewed and merged.
- No fabricated certifications, CV download, verified vulnerability claims or published MVPs.
- Private repository materials are never linked as downloadable source files.

## Project visibility and public resources

| Project | Visibility / release | Public downloads |
| --- | --- | --- |
| OneCall | Public repository; mobile and backend engineering in progress | Repository link for project and engineering information; no installer promoted on the portfolio. |
| Android Security Toolkit | Public Python source (Apache-2.0), no verified binary release | Source ZIP of main. Install using README, Python 3.11+. |
| MetaAutomate | Private repository | No downloadable package. Public business website only. |
| Security Research OS | Private repository | No downloadable package. |
| Safwa Quran | Private repository, public release blocked pending content and device reviews | No downloadable package. |
| IMarket | Concept / early engineering | No verified public release. |
| Nayvelo Mobile | Telecom concept / simulated design | No verified public release. |

The OneCall project remains in the portfolio, but its previous development-pilot APK is no longer advertised or linked. The GitHub repository and existing release history are left unchanged.

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

## Publishing additional public resources

Publish a binary download only when its supported setup and distribution status are suitable for public users. In-progress projects can be presented through a repository, technical documentation or source-backed case study instead of an installer.

## Contact

GitHub: https://github.com/AhmadibOfficial

## VAILABLE project and research objective

VAILABLE is a private, early-stage document productivity project with a product blueprint and safeguarded development automation foundation; the public website describes its intended functionality, not a released service. The Hall of Fame research objective is aspirational: recognition depends on validated findings, responsible disclosure and genuine remediation contributions.


## Published research and visual standards (November 2026)

- Link the GitHub Pages portfolio to the established Ahmad-IB Security Research Journal and four archived articles.
- Highlight the public, source-backed APK evidence-reporting case study without claiming unauthorized findings or Hall of Fame recognition.
- Use explicit text links without decorative arrows. Keep canonical journal article URLs on the separate Render deployment.
- Maintain all eight existing project entries and their factual release boundaries.
