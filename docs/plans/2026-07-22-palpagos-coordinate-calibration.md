# Palpagos Coordinate Calibration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Reconcile PalDB X/Y location data with the current 8192×8192 Palpagos tile canvas through one verified coordinate transform.

**Architecture:** Keep the existing data JSON unchanged. Define the PalDB map-frame scale, origin, and vertical inversion in `map-calibration.ts`; convert locations into the shared 8192×8192 image rectangle used by the marker canvas and hit testing. Validate the transform with fixed control points spanning the map before delivery.

**Tech Stack:** Next.js App Router, TypeScript, Canvas 2D, local Palpagos z4 tiles, PalDB coordinate export.

---

### Task 1: Audit the existing coordinate chain

**Files:**
- Inspect: `app/map/map-client.tsx`
- Inspect: `app/map/map-calibration.ts`
- Inspect: `data/map.ts`
- Inspect: `public/data/map-locations.json`

**Step 1:** Record the source tile size, canvas size, image rectangle calculation, and current data ranges.

**Step 2:** Select control points from Towers, Fast Travel, Dungeons, Settlements, and Oil Rig categories across the map.

**Step 3:** Compare the current full-edge-bounds formula with the PalDB map-frame formula and record the resulting pixel deltas.

### Task 2: Restore the PalDB map-frame transform

**Files:**
- Modify: `app/map/map-calibration.ts`
- Modify: `data/map.ts` only to keep the coordinate note accurate

**Step 1:** Define the PalDB scale and horizontal/vertical origin constants.

**Step 2:** Map `x` to the horizontal axis, map `y` to the vertically inverted axis, and normalize against the actual 8192×8192 Palpagos tile canvas.

**Step 3:** Keep `getContainedImageRect()` unchanged so image, marker canvas, zoom, drag, and hit testing remain in one display frame.

**Step 4:** Do not edit the location JSON or any non-Palpagos map behavior.

### Task 3: Verify the calibrated points

**Files:**
- Inspect: `app/map/map-client.tsx`
- Inspect: `app/map/map-calibration.ts`

**Step 1:** Verify at least ten control points across upper, lower, left, right, and center regions.

**Step 2:** Run TypeScript, ESLint, production build, and local `/map` checks.

**Step 3:** Confirm no World Tree, Quick Filters, SEO, layout, or loading code changed.

