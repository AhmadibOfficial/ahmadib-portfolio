# Ahmad Ibrahim — personal portfolio & Security Research Journal

This site is served at **https://ahmadib.onrender.com/** from the **publication-render** branch of AhmadibOfficial/ahmadib-portfolio with Render publish path **publication/**.

## Purpose

A professional personal website with software engineering, application security, AI/automation, product design, verified project links, entrepreneurship and research writing. The site is an original HTML/CSS/JavaScript portfolio, without a framework or backend dependency.

## Features

- Home, About, Expertise, Projects, MVP Downloads, Research Journal, Ventures, Process and Contact
- Responsive design with mobile navigation and accessible skip link
- Project cards and filter buttons
- Public artifacts only: OneCall USB Android phone pilot APK and Android Security Toolkit Python source
- Four preserved security-research articles, RSS feed and existing canonical article URLs
- Sitemap, favicon and social metadata
- No tracking scripts, passwords, external JS dependencies or private repo contents

## Important distribution limitations

- **OneCall** phone pilot is a **debug-signed prerelease** requiring a local backend and USB ADB reverse forwarding, not a standalone mobile service. Read official release notes and verify the checksum before installing.
- **Android Security Toolkit** is an open-source CLI source download (Python 3.11+), **not an APK**. Scan only authorized apps.
- **MetaAutomate** has its company website at https://metaautomate.onrender.com/; the private platform has no downloadable MVP published here.
- **Safwa Quran**, Security Research OS and the IMarket/Nayvelo concepts have no verified public installable release advertised here.
- An unverified CV or unreviewed penetration-testing report is not published.

## Local test

From the repo root:

    node --check publication/assets/app.js
    node publication/scripts/verify-site.mjs
    cd publication && python3 -m http.server 8000

Open http://localhost:8000/ and test navigation, project filters, journal filters/search, responsive design and public download descriptions. The content stays visible when JavaScript is disabled.

## Deployment

Render configuration: service **ahmadib**, repo AhmadibOfficial/ahmadib-portfolio, branch publication-render, publish path publication, automatic deployments **disabled**.

Feature branch changes must pass CI and review. Merge into publication-render and explicitly trigger a Render deployment; merging without deploying does not change the live site. The GitHub Pages portfolio at https://ahmadibofficial.github.io/ahmadib-portfolio/ is a separate deployment from main and is not affected by this process.

## Research publishing safety

Preserve /articles/, /feed.xml, /sitemap.xml and existing links. New research is verified and distinguished from unvalidated hypotheses; protect private targets, embargoed findings and PII. Updates to articles should go through the journal's own content/disclosure validation process.
