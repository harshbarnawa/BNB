# BNB brand assets (2026-11-18)

The BNB logo uses the user-approved light-background "bnb" mark with green eye dots and a smile. The file `frontend/public/brand/bnb-logo.svg` is a lightweight traced SVG with no embedded background; it works directly on the site's pale/light backgrounds.

## Uses

- `/brand/bnb-logo.svg` — primary transparent site wordmark, used in desktop and mobile headers and footers, including the admin page.
- `/brand/favicon.svg` — simplified lowercase "b" from the same artwork with a green eye dot, optimised for tiny browser tabs.
- `/apple-touch-icon.png` — 180 px app/home-screen icon derived from the favicon.
- `/og-bnb.png` — 1200×630 mint-background social link preview based on the secondary logo colorway.
- `/site.webmanifest` — app identity, icon and theme-color settings.

The site uses **mint #16B98A**, black and soft white. The secondary social artwork uses mint/teal with lime detailing, as in the reference variant.

Edit the primary SVG only when the brand artwork changes. Assets are first-party and are served as static files; no external font, image CDN or runtime JavaScript is required for logo rendering.

The HTML head includes favicon, touch icon, manifest, Open Graph and Twitter card metadata. Some social platforms cache previews, and individual platforms may require a fresh scrape before displaying the new image.

