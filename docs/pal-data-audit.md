# Pal data field coverage

Generated from the 300-record Palworld 1.0 snapshot on 2026-07-15. Run `npm run data:audit` to refresh the live audit.

| Field group | Field | Records | Coverage |
| --- | --- | ---: | ---: |
| Identity | image, ID, number, name, breeding power | 300 / 300 | 100.0% |
| Identity | elements | 289 / 300 | 96.3% |
| Base | work suitability | 300 / 300 | 100.0% |
| Combat | HP, ranged attack, defense, stamina | 289 / 300 | 96.3% |
| Economy | rarity, food consumption, nocturnal | 289 / 300 | 96.3% |
| Movement | run speed | 288 / 300 | 96.0% |
| Not yet verified | melee, support, craft speed, slow walk, walk, ride sprint, partner skill, active skills, drops, ranch products | 0 / 300 | 0.0% |

The Paldex only renders and sorts data-backed columns. The 11 crossover creatures remain intentionally null for fields not supplied by the current Pal-only source snapshot.
