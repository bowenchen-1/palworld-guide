# Palworld Team Builder V1 Design

## Goal

Add a focused five-slot team planning tool at `/team-builder`. The first version helps players assemble a party, inspect objective coverage from the current dataset, save it locally, and share it by URL. It does not claim to rank or automatically optimize teams.

## Scope

- Five ordered Pal slots with duplicate-species warnings rather than hard blocking.
- One shared searchable Pal selector with element filters and progressive loading.
- Live summaries for element coverage, strongest work suitability, partner skills, and available average stats.
- Local browser persistence with defensive parsing.
- URL state in a `team` query parameter and a copyable share link.
- Links from every selected Pal to its profile and to the homepage target-breeding result.
- Discovery from the tools hub and inclusion in the XML sitemap.

## Data flow

The client begins with five empty slots so server and client hydration match. After mount, it restores a valid URL team first and falls back to local storage. Later slot changes update local storage and the current URL. Unknown or malformed IDs are discarded safely.

All summaries are derived from the existing `PalData` records. Work suitability reports the maximum level in the team and how many members cover that job. Partner skills are displayed as names and icons only because descriptions and structured effects are not complete enough for synergy claims.

## Accessibility and responsive behavior

Each slot is a labelled button, status messages use live regions, and the selector is a labelled modal dialog with Escape and close controls. Desktop uses a five-column expedition strip; smaller screens collapse to two columns and then one column without horizontal page scrolling.

## Verification

- Unit tests for URL parsing, invalid storage input, duplicate detection, and summaries.
- Existing build, lint, data validation, and site-content tests.
- Browser checks for selecting, removing, saving, clearing, sharing, URL restoration, mobile layout, and keyboard-visible controls.
