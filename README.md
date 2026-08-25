# TSIQ Deep Tech Lab

Static website for TSIQ Deep Tech Lab, an engineering capability initiative by Terasilicon IQ Private Limited.

## Project Structure

```text
/
├── index.html                 # Home page
├── contact.html               # Engineering application / contact page
├── thank-you.html             # Form submission confirmation
├── assets/
│   ├── images/                # Logos and image assets
│   └── icons/                 # SVG capability icons
├── css/
│   └── style.css              # Global site styles and responsive layout
├── js/
│   └── script.js              # Navigation and page interactions
└── README.md
```

## Notes

- HTML pages remain at the site root for simple static hosting and clean URLs.
- CSS, JavaScript, icons, and images are separated into dedicated asset folders.
- External Terasilicon IQ engineering links are kept as absolute URLs.
- The site is designed for desktop and mobile layouts.


## V10.51
- Removed the duplicate Our Engineering Services column from the Contact block.
- Contact Us navigation now targets the on-page Contact block.
- Contact Us is highlighted while the Contact block is visible on desktop and mobile.


V11.10: Added a subtle hover/focus effect to the five Project requirement → engineering capability rows: light blue highlight, blue accent border, slight lift, and soft shadow. Reduced-motion support included.


V11.11: Mobile long-term vision flow now uses proper light-blue bordered cards with rounded corners, consistent spacing, and centered orange downward arrows instead of borderless rows.


V11.13: Mobile 'This is the difference' heading is highlighted as a compact light-blue title block, and all three difference cards use one consistent light-blue background/border treatment on mobile.


V11.14: Fixed mobile Project requirement → engineering capability stepper alignment so the vertical line no longer overlaps the text; all step text is positioned cleanly to the right of the line.


V11.15: Removed the conflicting legacy mobile stepper override and replaced it with one high-specificity rule. The guide line is now owned by the stepper container and cannot overlap step text. Mobile difference cards also use one consistent light-blue treatment.

V11.16: Fixed mobile project-capability guide line overlap. The guide line now sits at the stepper edge and each row has explicit left padding so question text never overlaps the line. Legacy negative row margin is reset on mobile.
