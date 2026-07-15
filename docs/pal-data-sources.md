# Pal data provenance and update record

## Snapshot

- Game target: Palworld 1.0
- Dataset schema: 2
- Imported: 2026-07-15
- Scope: 300 entries (289 Pals and 11 crossover creatures)
- Identity continuity: existing `id`, `number`, `slug`, local image name, work suitability, and breeding power are preserved.

## Source and licensing status

The inherited identity, work-suitability, and breeding-power snapshot is recorded as a community game-data extraction. Its previous public attribution named a third-party guide, which is not used in product UI and is not treated as a license for additional fields.

The current factual snapshot is the user-supplied workbook `palworld_pals_database.xlsx`, captured 2026-07-15 from version `1.0.0` PalDB entries and normalized into `data/sources/paldb-1.0-20260715.json`. Its original workbook SHA-256 is `146283296c1be4f3ff9373184112f256b6d0c325c4a1d35689ddb60a97e12757`. No source is displayed in product UI. After matching names and asserting unchanged work suitability and breeding power, it imports element, HP, Defense, Rarity, Price, Stamina, Run Speed, Riding Speed, and Partner Skill name for 299 records. The one unmatched existing record, `Gumoss (Special)`, is retained unchanged. The source's redistribution license is not asserted; it is recorded internally as user-supplied factual reference data only. Do not distribute PAK files, extracted game assets, third-party prose, or third-party images.

No unverified field is guessed. `null` means not yet verified; an empty array means verified as empty only when a future source establishes that fact.

## Evidence classes

| Class | Permitted use | Required record |
| --- | --- | --- |
| Official local extraction | Canonical structured import | Purchased/authorised installation, build ID, table path, extractor revision, file hash, date |
| Independent in-game observation | A narrow, manually observed value only | Observer, clean save/mod state, build ID, screenshot or recording, date, repeat observation |
| User-supplied, field-level source workbook | Factual import after identity, work, and breeding-power assertions | File hash, game version, capture date, field mapping, conflicts |
| Competitor or social-media report | Discovery and discrepancy check only | URL, date, field, comparison outcome; never copied as canonical data |

Do not label a competitor, wiki, social post, or unperformed observation as an independent play observation. Manual observation is unsuitable for hidden values such as breeding power and should not replace an extractable source for whole-dataset fields.

## Repeatable update procedure

1. Add a version-pinned, internally documented source snapshot to `data/sources/` while retaining identity fields.
2. Run `npm run data:import` to normalize the schema without changing existing IDs, slugs, numbers, images, work, or breeding power.
3. Run `npm run data:validate` to check record counts, unique IDs/slugs/numbers, field ranges, work levels, and local images.
4. Update this file and `public/data/data-version.json` with source, license, date, version, and any reconciled conflicts.
