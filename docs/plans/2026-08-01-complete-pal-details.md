# Complete Pal Details Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add the missing structured Pal detail fields for all 299 catalog Pals and expose them on the English and Chinese detail pages.

**Architecture:** Fetch the referenced database pages once with a reproducible importer, normalize the factual fields into a checked-in `pal-details.json` snapshot, and render the snapshot through a shared component. Existing `pals.json`, breeding data, drops/locations data, active skills, URLs, and SEO metadata remain unchanged.

**Tech Stack:** Next.js App Router, TypeScript, React, Node.js, Python standard-library HTML parsing, JSON snapshot data.

---

### Task 1: Define the supplemental detail snapshot

**Files:**
- Create: `public/data/pal-details.json`
- Modify: `app/lib/game-data.ts`

Add optional records keyed by Pal slug for size, capture rate, gender ratio, egg, internal code, extended movement, level-80 ranges, ranch output, passive skills, spawner entries, and tribe/variant data. Missing source fields must remain `null` or an empty list rather than being guessed.

### Task 2: Add the reproducible importer and validator

**Files:**
- Create: `scripts/import-paldb-details.py`
- Create: `scripts/validate-pal-details.mjs`
- Modify: `package.json`

Use the referenced English detail pages as the source snapshot. Parse only factual tables and links, normalize entities and ranges, map records back to the existing 299 slugs, retry requests, and fail on missing or duplicate Pals. Add `data:details:import` and `data:details:validate` scripts.

### Task 3: Render the supplemental data

**Files:**
- Create: `app/components/pal-details-sections.tsx`
- Modify: `app/pals/[slug]/page.tsx`
- Modify: `app/zh/pals/[slug]/page.tsx`

Render compact sections for expanded stats, movement, level-80 ranges, ranch output, passive skills, spawner/location details, and variants. Use English labels on `/pals/[slug]` and Chinese labels on `/zh/pals/[slug]`. Keep existing overview, breeding, drops, active skills, and work sections intact.

### Task 4: Style the new sections

**Files:**
- Modify: `app/terminal-theme.css`

Add responsive grids and readable tables/cards that match the current terminal theme. Avoid large repeated blocks and preserve mobile layout.

### Task 5: Verify completeness and build output

**Files:**
- Modify: `tests/data-validation.test.mjs` if an existing test boundary needs extension

Run:

```bash
npm run data:details:validate
npm run lint
npm run build
npm test
```

Check Lamball, a Pal with many spawner entries, a Pal with variants, and a Pal with no optional records. Confirm all 299 records are present and no URL, SEO, breeding, map, or Pal identity data changed.
