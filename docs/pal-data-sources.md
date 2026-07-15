# Pal data provenance and update record

## Snapshot

- Game target: Palworld 1.0
- Dataset schema: 2
- Imported: 2026-07-15
- Scope: 300 entries (289 Pals and 11 crossover creatures)
- Identity continuity: existing `id`, `number`, `slug`, local image name, work suitability, and breeding power are preserved.

## Source and licensing status

The inherited identity, work-suitability, and breeding-power snapshot is recorded as a community game-data extraction. Its previous public attribution named a third-party guide, which is not used in product UI and is not treated as a license for additional fields.

The imported factual snapshot is `Awy64/palworld-atlas-data`, commit `0385b3fd8bd757240d4a2c79615145122669abd5`, build `24181105`, retrieved 2026-07-15. Its repository license is MIT; this status is recorded internally and no source is displayed in the product UI. Fields imported after matching the existing Pal identity and asserting equal work suitability and breeding power: element, HP, Shot Attack (shown as Ranged Attack), Defense, Rarity, Food Amount, Run Speed, and Nocturnal. Do not distribute PAK files, extracted game assets, third-party prose, or third-party images.

No unverified field is guessed. `null` means not yet verified; an empty array means verified as empty only when a future source establishes that fact.

## Evidence classes

| Class | Permitted use | Required record |
| --- | --- | --- |
| Official local extraction | Canonical structured import | Purchased/authorised installation, build ID, table path, extractor revision, file hash, date |
| Independent in-game observation | A narrow, manually observed value only | Observer, clean save/mod state, build ID, screenshot or recording, date, repeat observation |
| Competitor or social-media report | Discovery and discrepancy check only | URL, date, field, comparison outcome; never copied as canonical data |

Do not label a competitor, wiki, social post, or unperformed observation as an independent play observation. Manual observation is unsuitable for hidden values such as breeding power and should not replace an extractable source for whole-dataset fields.

## Repeatable update procedure

1. Add only independently licensed, version-pinned source values to `public/data/pals.json` while retaining identity fields.
2. Run `npm run data:import` to normalize the schema without changing existing IDs, slugs, numbers, images, work, or breeding power.
3. Run `npm run data:validate` to check record counts, unique IDs/slugs/numbers, field ranges, work levels, and local images.
4. Update this file and `public/data/data-version.json` with source, license, date, version, and any reconciled conflicts.
