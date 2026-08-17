TERASILICON IQ — CAPABILITIES REDIRECT FIX

This package restores the capability-row navigation that was missing from the latest homepage patch.

Clickable capability rows:
- Formal Verification -> formal-verification.html
- STA & Timing Closure -> sta-timing-closure.html
- EMIR & Power Integrity -> emir-power-integrity.html
- Physical Design & Signoff -> physical-design-signoff.html
- RTL, Design Verification & DFT -> rtl-dv-dft.html
- Physical Verification -> physical-verification.html

The rows include hover/focus treatment and an arrow.
The existing flow animation brand-color fixes are preserved.

Replace/merge these files into your current website folder. The capability subpages use the same shared site CSS files already present in your project.
