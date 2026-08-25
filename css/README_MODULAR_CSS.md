# TSIQ Deep Tech Lab — Modular CSS

The former monolithic `style.css` has been split into ordered, purpose-focused CSS modules.

The `<head>` of each HTML page should load these files in numeric order so the original cascade is preserved.

- `00-mobile-difference.css` — mobile difference callout override
- `01-foundation.css` — global tokens, reset, typography, shared buttons/container
- `02-hero.css` — hero/capability hero styles and animations
- `03-journey-content.css` — training journey and core content blocks
- `04-content-refinements.css` — content/card refinement layer
- `05-capability-visuals.css` — capability visual system
- `06-capability-loop.css` — circular capability loop
- `07-capability-pulse.css` — connected capability pulse
- `08-capability-segments.css` — segmented capability flow
- `09-main-hero.css` — main hero capability layout
- `10-connectors-labels.css` — hero connectors and labels
- `11-responsive-composition.css` — mobile/desktop responsive composition
- `12-domain-refinement.css` — domain-specific development refinements
- `13-page-refinements.css` — page-level spacing, CTA/path cards and final refinements

All files retain their original source order to avoid visual or interaction regressions.
