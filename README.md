# Phathu OS

The CV portfolio of Phathu Sigama, presented as two retro interfaces on one site:

- **Phathu OS 9** (768px and wider) — a late-1990s desktop with draggable windows, a menu bar and a control strip.
- **Phathu Mobile** (below 768px) — an early-smartphone home screen where every CV section is a full-screen app.

The switch is done with CSS media queries only; no device detection.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:3000. Other scripts: `npm run lint`, `npm run typecheck`, `npm run build`, `npm start`.

## Editing the content

All CV content lives in one typed file, [`data/cv.ts`](data/cv.ts). Both interfaces read from it, so a change there shows up everywhere.

- **GitHub link** — `contact.github` holds the profile URL used by the mobile dock button and the Contact section.
- **Certifications** — the list is empty, which shows the "No certifications added yet" state. Add entries to `certifications` when you have them.
- **Media Player video** — change the YouTube video id, title and credit in [`data/media.ts`](data/media.ts).
  The video is embedded from YouTube, not hosted here.
- **CV download** — replace `public/Phathu_Sigama_CV_2026.pdf` (and `contact.cvFile` if the file name changes).
- **Social previews** — preview images point at `https://phathu-sigama.me`. Set `NEXT_PUBLIC_SITE_URL` if the
  address changes.

## Structure

```text
app/                  layout, page, global styles, fonts, favicon and social-preview image
data/cv.ts            the single source of CV content
components/shared/    CV section content, contact form, icons, logo, start-up screen
components/desktop/   Phathu OS 9: window manager, menu bar, Finder-style window, control strip
components/mobile/    Phathu Mobile: status bar, home screen, apps, dock
public/               PS logo, 3D logo model (logo.glb), wallpaper tiles, CV PDF
scripts/              generate-logo-assets.py — rebuilds the logo, favicon and wallpaper from its pixel grid
```

## Notes

- The start-up screen spins the 3D PS logo (`public/logo.glb`, drawn live with three.js; the flat logo is the fallback),
  is timed purely in CSS
  (about 5.6s), plays once per browser session, honours
  `prefers-reduced-motion`, and can be clicked to skip. It dismisses itself even if JavaScript fails.
- Without JavaScript the whole CV is shown as a plain document.
- The contact form has no backend: it opens a pre-filled draft in the visitor's own email app.
- Keyboard: Tab between icons, menus and windows; Enter/Space opens; Escape closes the focused window or menu;
  Alt + arrow keys move the focused window.
- All icons, the PS logo artwork and the wallpaper are original pixel art. Fonts are DotGothic16 and
  Pixelify Sans (both SIL Open Font License), self-hosted in `app/fonts`.
