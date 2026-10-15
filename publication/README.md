# Ahmad-IB Security Research Journal

A publication website for Ahmad Ibrahim, deployed from the `publication-render` branch of `ahmadib-portfolio` to a dedicated Render static site.

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

Open `http://localhost:8000/publication/`. Render publishes the `publication/` folder as the website root.

## Publication controls

- Content is educational and does not assert unconfirmed vulnerabilities.
- No analytics, forms, cookies or credential collection. No third-party JavaScript.
- Static HTML/CSS/JS with no runtime secrets, tracking scripts, external font loaders, or paid packages.
- Review all external links, author details, claims and copyright before merging.
- Update the dedicated branch after review; verify the live Render URL after each deployment.
- Update `feed.xml`, `sitemap.xml` and the homepage cards whenever publishing a new article.
- Maintain responsible disclosure and embargo requirements before publishing research.
