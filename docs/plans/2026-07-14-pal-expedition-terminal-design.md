# Pal Expedition Terminal Design

## Product direction

PalworldGuide.net uses a distinct **Pal Expedition Terminal** visual language: an approachable field-research database inspired by creature collecting, wilderness exploration, base management, and light science-fiction equipment. It does not reproduce the game menu, official icons, fonts, screenshots, proportions, or navigation.

The balance is 40% adventure-tech atmosphere, 40% modern tool usability, and 20% original field-guide identity. The homepage remains a working product surface: the breeding calculator appears in the first viewport rather than being pushed below a decorative hero.

## Signature language

- Deep blue-green canvas with restrained topographic and scan-line texture.
- Mint cyan is the brand and selected-state color; sky blue is secondary.
- Warm yellow is reserved for important results, recommendations, and data status.
- Panels use a friendly 12–16px radius with one clipped upper-right corner.
- Pal images carry most of the saturation and sit over a subtle scanning ring.
- Terminal eyebrows such as `FIELD RESEARCH // BREEDING LAB` identify page context.
- Glow is limited to focus, selection, and hover states. Long-form text never sits on noisy transparency.

## Homepage hierarchy

The first viewport contains the navigation, one H1, a short SEO description, compact data-status labels, and the functional two-parent breeding calculator. The previous independent white introduction card is removed. `300 records` becomes a small status chip, and reverse search remains a calculator action instead of a competing hero callout.

Decorative outer frames are removed. Only controls that need interaction affordance keep visible borders: Pal selection slots, search fields, tabs, filters, and buttons.

## Global rules

Existing public routes, canonical URLs, metadata, schema, copy, and data remain unchanged. The visual system is applied incrementally through semantic Tailwind tokens and a shared terminal component layer. Desktop and mobile use the same canvas and information hierarchy; small screens reduce decorative texture and avoid clipped control labels.

