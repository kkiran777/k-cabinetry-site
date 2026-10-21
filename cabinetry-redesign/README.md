# K Cabinetry — Redesigned Website

A standalone, responsive K Cabinetry website inspired by the presentation quality and information architecture of [Cosmo Cabinets](https://www.cosmocabinets.com/), with its own original layout, typography, copy and K Cabinetry branding.

## What is included

- **Home:** full-screen image hero, service features, product collections, editorial inspiration and call to action.
- **Products:** editable product categories, images, copy and feature bullets.
- **Inspiration:** image gallery with category filters. Initial photographs are illustrative stock/inspiration, **not documented K Cabinetry installations**.
- **About:** story and editable process steps.
- **Contact:** business details and project inquiry form.
- **Content Studio:** browser-based editorial dashboard at `admin/index.html` for editing everything above and uploading images to GitHub.

All current files in the repository root are intentionally left unchanged. This website lives entirely within `cabinetry-redesign/`.

## Run locally

This is a **static website** and does not require Node, databases or a runtime server:

```bash
cd cabinetry-redesign
python3 -m http.server 8080
```

Then open `http://localhost:8080/`.

> Don't open the HTML with a `file://` URL: the content loader uses `fetch()` to load `content/site.json` and browsers generally block local-file fetches.

## How to edit the site from the admin area

1. Visit `/admin/` on the deployed redesign, or `http://localhost:8080/admin/` during local development.
2. Sign in **using a fine-grained GitHub personal access token** with repository access to `kkiran777/k-cabinetry-site`, with permission **Contents: Read and write**.
3. Select **Brand**, **Homepage hero**, **Homepage sections**, **Service highlights**, **Product collections**, **Inspiration gallery**, **About page**, **Our process**, or **Contact page**.
4. Change fields, upload photos, add/remove/reorder list items, and click **Publish changes**.
5. The editor creates a normal commit updating `content/site.json` on the `main` branch. Uploaded photos are committed to `media/`.
6. Reload the public site once your static hosting updates. Normal hosting/CDN caches may take a few minutes.

**Authentication:** there is intentionally **no shared default admin password** or secret inside the repository. Content Studio uses a GitHub token supplied by you, with authorization enforced by GitHub. It stays in the browser tab's JavaScript memory; it is not embedded in the public files, saved to local storage, or sent to this website's server. Close/refresh the tab to sign out. Use a narrowly scoped fine-grained token, never share it, and revoke it when no longer needed.

## Hosting / deployment

The files have been deployed **into this GitHub repository folder**. **That does not by itself create a live website.** Connect your chosen static host:

- **Netlify:** connect `kkiran777/k-cabinetry-site`, branch `main`. Set **Base directory** to `cabinetry-redesign`, leave build command empty, and set **Publish directory** to `.` relative to base (or use repository root as base and publish `cabinetry-redesign`).
- **Cloudflare Pages:** connect repository, branch `main`, framework preset None, build command empty, **Build output directory** `cabinetry-redesign`.
- **GitHub Pages:** if you already publish from the repository root, this folder can be accessible under `/cabinetry-redesign/`. If you publish from a different location, configure a Pages source/workflow that publishes this folder—**don't replace your existing Pages source without confirming what it currently serves**.
- **Vercel:** configure project **Root Directory** `cabinetry-redesign` and set it up as a static project.

Changes to `content/site.json` are picked up when your hosting deployment rebuilds or publishes updated files.

## Contact form

The contact page works without an external service: it prepares an email to the address in the **Brand** section; **the visitor must send that email using their email app**. To accept direct submissions, configure a third-party HTTPS form handler (e.g. a hosted form provider) and paste its JSON-compatible POST URL in **Contact page → HTTPS form submission endpoint**. The endpoint must allow cross-origin requests. No email sending backend or inbox is configured by default.

## Content and design notes

- Edit all website copy and image URLs in `content/site.json` or through Content Studio.
- The supplied gold K Cabinetry emblem is initially loaded from the exact logo URL used by the existing public website. For an independent copy, open **Brand → Brand logo → Upload photo** in Content Studio, then publish.
- Initial photos are third-party Unsplash design inspiration; replace with assets you own or have licensed before final production launch.
- The new site is a custom static website; the admin only manages the JSON-powered content sections and images, not arbitrary HTML/CSS/layout.
- The old repository's `app/admin` implementation is unrelated to this separate website. Its embedded example credentials must **not** be used as real authentication; the new Content Studio avoids that design.

## Folder map

```text
cabinetry-redesign/
├── index.html
├── about.html
├── products.html
├── projects.html
├── contact.html
├── admin/
│   └── index.html
├── assets/
│   ├── site.css
│   ├── site.js
│   ├── admin.css
│   └── admin.js
├── content/
│   └── site.json
├── media/              # image uploads appear here automatically
└── README.md
```
