# Terasilicon IQ Website

This package contains the complete Terasilicon IQ website.

## Project structure

```text
terasilicon-iq/
├── index.html
├── formal-verification.html
├── sta-timing-closure.html
├── emir-power-integrity.html
├── physical-design-signoff.html
├── rtl-dv-dft.html
├── physical-verification.html
│
├── css/
│   ├── 01-core.css
│   ├── 02-layout.css
│   ├── 03-contact.css
│   ├── 04-header.css
│   ├── 05-footer.css
│   ├── 06-capabilities.css
│   ├── 07-navigation.css
│   ├── 08-flow.css
│   ├── 09-utilities.css
│   ├── 10-formal-verification.css
│   ├── 11-logo-loader.css
│   ├── 12-subpage-consistency.css
│   ├── 13-main-page-fixes.css
│   └── 14-quality-polish.css
│
├── script/
│   ├── script.js
│   └── logo-loader.js
│
└── assets/
    ├── capabilities/
    └── icons/
```

## How to run

1. Extract the ZIP.
2. Open `index.html` in a browser.
3. All local CSS, JavaScript, image, and SVG paths are relative to the project root.

A local web server is recommended for development, but the pages are structured so that the relative paths remain valid when the project is extracted.

## CSS organization

CSS files are intentionally kept separate by responsibility. Do **not** merge them into one file.

- `01-core.css` — global variables, typography, base styles
- `02-layout.css` — shared layout
- `03-contact.css` — contact section
- `04-header.css` — header and brand
- `05-footer.css` — shared footer
- `06-capabilities.css` — homepage capabilities
- `07-navigation.css` — navigation and active states
- `08-flow.css` — workflow/flow visuals
- `09-utilities.css` — utility classes
- `10-formal-verification.css` — Formal Verification-specific styles
- `11-logo-loader.css` — logo loading animation
- `12-subpage-consistency.css` — capability subpage consistency
- `13-main-page-fixes.css` — homepage-only fixes
- `14-quality-polish.css` — final visual refinements

## JavaScript organization

- `script.js` — navigation, mobile menu, active section/page behavior
- `logo-loader.js` — loading-screen animation and fade-out

## QA checks performed

- All HTML files have a `<title>` and meta description.
- All local `href`, `src`, and stylesheet/script references resolve to files in this package.
- No duplicate HTML `id` values were found.
- All images have an `alt` attribute.
- JavaScript syntax check passes.
- CSS brace balance check passes for every stylesheet.
- Capability subpages retain the shared header/footer and navigation system.
- Local SVG assets are packaged inside `assets/`; no external icon library is required.
- Google Maps uses the supplied Terasilicon IQ Maps link.
- Contact CTAs use `hr@terasiliconiq.com`.
- `prefers-reduced-motion` support is retained where implemented.

## Brand

Primary site colours:

- Navy: `#101638`
- Purple: `#653593`
- Orange: `#ef7700`

The existing logo and supplied local assets are used throughout the website.
