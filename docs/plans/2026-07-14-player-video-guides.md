# Player-Video Guides Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the six guide articles’ official/wiki research with current non-official YouTube creator research while preserving URLs and the all-English site.

**Architecture:** Store structured creator-video metadata beside each guide in `guide-data.ts`, render that metadata as editorial source cards in the shared guide page, and enforce the source policy with content tests. Existing Next.js routes and homepage card links remain unchanged.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS, Node test runner.

---

### Task 1: Lock the source policy with tests

**Files:**
- Modify: `tests/site-content.test.mjs`

**Steps:**
1. Add assertions that reject `steamcommunity.com`, `palworld.wiki.gg`, and the old official-source label.
2. Require six structured `videoResearch` arrays and at least one direct YouTube video per guide.
3. Require the shared article page to render “Video research” and “Watch on YouTube”.
4. Run `npm test` and verify the new assertions fail before implementation.

### Task 2: Rewrite guide data from creator videos

**Files:**
- Modify: `app/guides/guide-data.ts`

**Steps:**
1. Replace the `sources` type with `VideoResearch` metadata.
2. Rewrite all six summaries, checklists, sections, and field notes around the verified video research map.
3. Use July 14, 2026 as the editorial review date.
4. Remove every official and wiki URL.
5. Run `npm test` and verify the data-policy assertions pass.

### Task 3: Render editorial video cards

**Files:**
- Modify: `app/guides/[slug]/page.tsx`
- Modify: `app/globals.css`

**Steps:**
1. Replace the generic further-reading box with an editorial-method note.
2. Render one card per video with creator, date, research focus, and direct YouTube link.
3. Add responsive styles that match the existing field-guide visual system.
4. Run `npm test` and `npm run lint`.

### Task 4: Align homepage messaging and verify production

**Files:**
- Modify: `app/page.tsx`

**Steps:**
1. Update the FAQ and supporting copy to explain the creator-video research method.
2. Run `npm test`.
3. Run `npm run lint`.
4. Run `npm run build` and expect a successful static generation of all six guide routes.
5. Inspect the local homepage and one guide page at desktop and mobile widths.
