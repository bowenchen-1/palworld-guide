# Pal data field coverage

Generated from the 300-record raw Palworld 1.0 snapshot on 2026-07-15. The user-visible catalog is 299 records after excluding `Gumoss (Special)` (`12.1`). Run `npm run data:audit` to refresh the raw-field audit.

| Field group | Field | Records | Coverage |
| --- | --- | ---: | ---: |
| Identity | image, ID, number, name, breeding power | 300 / 300 | 100.0% |
| Identity | elements | 300 / 300 | 100.0% |
| Base | work suitability | 300 / 300 | 100.0% |
| Combat | HP, defense, stamina | 300 / 300 | 100.0% |
| Economy | rarity | 300 / 300 | 100.0% |
| Economy | price | 299 / 300 | 99.7% |
| Movement | run speed | 299 / 300 | 99.7% |
| Movement | riding speed | 298 / 300 | 99.3% |
| Base | partner skill name | 299 / 300 | 99.7% |
| Not yet verified | melee, support, craft speed, slow walk, walk, ranged attack for crossover creatures, food consumption and nocturnal for crossover creatures, partner skill descriptions, active skills, drops, ranch products | — | — |

The Paldex only renders and sorts data-backed columns. `Gumoss (Special)` remains the one retained legacy record without a Price or Partner Skill name; Astralym remains without a source Movement value.
