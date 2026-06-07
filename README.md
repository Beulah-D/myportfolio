# Beulah Divya Kannan — Portfolio

A distinctive, fully responsive personal portfolio for a **Strategy & Operations Analyst**.
Theme: **"Ops Console"** — a dark, data-driven aesthetic that reads like a live operations
dashboard (animated metric counters, terminal panels, magnetic buttons, scroll reveals).

Built with **HTML + Tailwind CSS + vanilla JavaScript**. No build step, no dependencies to install —
it runs as static files and deploys straight to GitHub Pages.

---

## ✦ Sections
- **Hero** — headline, animated KPI counters, live "status" terminal
- **Selected Work** — filterable, interactive case-study gallery with click-to-open detail modals
- **About** — narrative + a `profile.config` system readout
- **Toolkit (Skills)** — categorized skills + an infinite marquee ticker
- **In Their Words** — three recommendation "bubbles" (Dr. Natalie Ring, Hemanth Sammatur, Selina DerSarkissian)
- **Contact** — split panel with direct links + a working **mailto** form

---

## ✦ File structure
```
.
├── index.html        # markup, Tailwind config, case-study data
├── css/styles.css    # theme variables, animations, components
├── js/main.js        # counters, reveals, gallery filter, modal, magnetic buttons, form
├── assets/
│   ├── Beulah_Kannan_Resume.pdf
│   └── nature/                 # "Off the Clock" gallery photos (web-optimized, ~1600px)
└── README.md
```

---

## ✦ Run locally
Any static server works. For example:
```bash
python3 -m http.server 4321
# then open http://localhost:4321
```

---

## ✦ Deploy to GitHub Pages
1. Create a repo (e.g. `portfolio`) and push these files to the `main` branch.
2. Repo → **Settings → Pages** → Source: **Deploy from a branch** → Branch: `main` / `root`.
3. Your site goes live at `https://<your-username>.github.io/portfolio/`.

> Because everything is relative-pathed, it also works from a project subfolder or a
> user/organization page (`<username>.github.io`) with no changes.

---

## ✦ Customize

**Colors** — edit the CSS variables at the top of `css/styles.css`:
```css
:root {
  --bg: #0B0E11;     /* page background  */
  --lime: #C6F24E;   /* primary accent   */
  --cyan: #5EEAD4;   /* secondary accent */
}
```
(The same palette is mirrored in the Tailwind config inside `index.html`.)

**Résumé** — replace `assets/Beulah_Kannan_Resume.pdf` (keep the filename, or update the two
links in `index.html`).

**Case studies** — all project content lives in one place: the `window.__CASES__` object near
the bottom of `index.html`. Edit metrics, bullet points, tech tags, and optional repo `link`s there.

**Add a photo (optional)** — the hero is currently type-only. To add a portrait, drop an image
in `assets/` and place an `<img>` in the hero's right column (where the status terminal is).

**"Off the Clock" photos** — the gallery pulls from `assets/nature/` (web-optimized JPEGs).
To swap a photo, replace the matching file (e.g. `IMG_1083.jpg`) or edit the `<figure>` list in the
`#outside` section of `index.html`. To remove the gallery entirely, delete that `<section id="outside">`
block and the `outside` nav links. Keep new photos web-sized (~1600px, &lt;700KB) so the page stays fast.

**Social links** — currently set to:
- LinkedIn: `https://www.linkedin.com/in/beulah-kannan/`
- GitHub: `https://github.com/Beulah-D`
- Tableau: `https://public.tableau.com/app/profile/beulah.kannan/vizzes`
- Email: `beulahdivya11@gmail.com` · Phone: `+1 (213) 756-7160`

---

## ✦ Note on Tailwind
This uses the **Tailwind Play CDN** for zero-config simplicity — perfect for a portfolio.
The browser console shows a harmless "should not be used in production" notice. If you ever want
to remove it, you can swap to a compiled Tailwind build (Tailwind CLI) without changing any markup.

---

## ✦ Accessibility & performance
- Semantic landmarks, skip-to-content link, keyboard-operable cards & modal (Enter/Space/Esc)
- `aria-*` labels, focus-visible outlines, `role="status"` live region on the form
- Respects `prefers-reduced-motion` (animations disabled, content shown immediately)
- Single rAF-throttled scroll listener; animations are GPU-friendly transforms
