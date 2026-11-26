# Qissaah Interior

Editorial luxury interior architecture and bespoke furniture showcase for **Qissaah Interior**.

## Running Locally

```bash
node serve.js
```

Open `http://localhost:3100` in your browser (or serve statically via `python -m http.server 8000`).

## Structure

- `index.html`: Main landing experience featuring the 3-scene hero lookbook, editorial overview collage, studio benchmarks, space explorer grid, interactive brand story chapters, scroll-lit tagline reveal, curated product catalog with filters, and consultation/inquiry modals
- `404.html`: Branded fallback page
- `styles/tokens.css`: OKLCH warm limestone, honed stone, and espresso ink tokens, Tailwind-aligned type and spacing scales, and motion curves
- `styles/base.css`: Reset, typography classes, accessible focus defaults, and reduced-motion safeguards
- `styles/style.css`: Layout grid, responsive breakpoints, card geometry, interactive drawers, and Hallmark compliance annotations
- `scripts/main.js`: Hero slider, story chapter switcher, collection category filter, quick-view product modal, saved inquiry bag, studio search, and client-side form validation
- `assets/`: Brand SVG favicon and locally hosted high-resolution interior imagery (`assets/images/`)
- `serve.js`: Zero-dependency Node local static HTTP server

## Image Credits

Room photography combines custom-generated architectural renders with CC BY-SA 4.0 architectural plates from Wikimedia Commons (credited in the page footer):

- Clairecato321 (Wikimedia Commons)
- Velvet (Wikimedia Commons)
- Basile Morin (Wikimedia Commons)
- LoMit (Wikimedia Commons)
