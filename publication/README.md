# Ahmad-IB Security Research Journal

A publication website for Ahmad Ibrahim, built to live inside the existing `ahmadib-portfolio` GitHub Pages repository at `/publication/`.

## Contents
- `index.html`: editorial homepage with client-side category and text filtering
- `articles/`: three educational field notes (not third-party vulnerability disclosures)
- `assets/style.css`: responsive, accessible visual system
- `assets/app.js`: progressive search/filter enhancement, no external requests
- `feed.xml`: RSS 2.0
- `sitemap.xml`: publication sitemap

## Run locally

From the parent directory that contains `publication/`:

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000/publication/`. On GitHub Pages the base path is `/ahmadib-portfolio/publication/`.

## Publication controls

- Content is educational and does not assert unconfirmed vulnerabilities.
- No analytics, forms, cookies or credential collection. No third-party JavaScript.
- No paid subscriptions required. Fonts use Google Fonts with system font fallbacks; remove the CSS import for fully offline display.
- Review all external links, author details, claims and copyright before merging.
- Merge to the published branch only after approval.
- Update `feed.xml`, `sitemap.xml` and the homepage cards whenever publishing a new article.
- Maintain responsible disclosure and embargo requirements before publishing research.
