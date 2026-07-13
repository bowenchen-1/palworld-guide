# Palworld Guide Portal Expansion

## Goal

Turn the six-card homepage into a useful guide portal with a larger article library, obvious category navigation, and planning tools that work directly on the page.

## Chosen structure

The homepage uses three levels of discovery. “Popular Guides” keeps the six highest-value beginner and progression articles close to the top. “Interactive Tools” provides lightweight calculators for resource runs, breeding batches, and base worker slots. “Browse by Category” then exposes the complete library through six category shortcuts and six four-article shelves.

The categories are Getting Started, Pals & Breeding, Base Building, Resources & Crafting, Exploration, and Combat. Every library item links to a statically generated English article. The existing six long guides remain intact, while eighteen focused articles extend their video research into narrower questions that players can scan quickly.

## Tool behavior

The tools deliberately accept values from the player's own world. This avoids presenting patch-sensitive timers, yields, or server limits as universal facts. Each result updates immediately in the browser and includes a short qualifier describing the estimate.

## Responsive behavior and verification

Desktop layouts use three-column popular and tool grids, two-column category article lists, and compact category jump cards. Tablet and mobile widths collapse the tools, shelves, and guide rows without hiding any content. Verification covers all 24 generated guide routes, the six category groups, calculator output changes, production build, lint, content tests, and visual inspection at desktop and mobile widths.
