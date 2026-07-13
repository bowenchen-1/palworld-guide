export type GuideSection = {
  id: string;
  title: string;
  intro?: string;
  steps?: { title: string; body: string }[];
  bullets?: string[];
  tip?: string;
};

export type Guide = {
  slug: string;
  number: string;
  category: string;
  title: string;
  description: string;
  readTime: string;
  updated: string;
  difficulty: string;
  takeaway: string;
  checklist: string[];
  sections: GuideSection[];
  sources: { label: string; href: string }[];
};

export const guides: Guide[] = [
  {
    slug: "first-7-days",
    number: "01",
    category: "Getting Started",
    title: "Your First 7 Days in Palworld",
    description: "A low-stress route from the opening beach to a safe, productive base and your first tower challenge.",
    readTime: "12 min read",
    updated: "July 13, 2026",
    difficulty: "Beginner",
    takeaway: "Follow the opening missions, activate every travel point you pass, catch broadly, and let a simple base automate wood, stone, food, and ingots before you chase bigger objectives.",
    checklist: ["Activate the first Great Eagle Statue", "Craft basic tools, a weapon, and Pal Spheres", "Place a Palbox on flat, resource-rich ground", "Build beds, a feed box, berry production, and a hot spring", "Catch workers for planting, watering, gathering, mining, and handiwork", "Prepare a Ground-type Pal and ranged weapon for the first tower"],
    sections: [
      { id: "day-one", title: "Day 1 — Learn the survival loop", intro: "The opening missions are now a connected route, so use them as your spine instead of wandering without a goal.", steps: [
        { title: "Touch the statue", body: "Activate the nearby Great Eagle Statue immediately. Fast travel is the safest way to unload resources and recover from a bad expedition." },
        { title: "Gather in short bursts", body: "Pick up branches and loose stone, then craft a Primitive Workbench, axe, pickaxe, club or bow, and several Pal Spheres. Do not spend the whole day hand-mining large stockpiles." },
        { title: "Catch before you fight", body: "Lower a Pal's health, apply a status effect when possible, then throw a Sphere. Early captures give experience and workers; random combat alone is a slower route to a functioning base." },
      ], tip: "Carry a small stack of food and eat before your hunger meter becomes a distraction. Cooked berries are an easy early staple." },
      { id: "base", title: "Days 2–3 — Build the smallest useful base", intro: "Choose a broad, mostly flat area with wood and stone nearby. A neat workflow matters more than a scenic cliff edge.", bullets: [
        "Place the Palbox where its circular boundary leaves room on every side. Avoid steep slopes and chokepoints that confuse worker pathing.",
        "Put storage beside production stations. Pals spend less time transporting when the route from resource to chest is short.",
        "Build one bed per active worker, keep the feed box stocked, and add a hot spring as soon as it becomes available.",
        "Use a balanced starter crew: planting + gathering, watering, kindling, lumbering, mining, handiwork, and transport.",
        "Upgrade the Palbox through its listed objectives. These objectives naturally introduce the facilities you need next.",
      ] },
      { id: "team", title: "Days 3–4 — Create a practical travel team", intro: "Your party should solve travel and capture problems, not simply contain your five highest-level Pals.", bullets: [
        "Bring one reliable combat Pal, one mount when unlocked, one Pal that covers an elemental weakness, and one utility partner.",
        "Keep at least one empty mental slot for new discoveries: rotate Pals frequently while filling the Paldeck.",
        "Catch duplicates when convenient. Capture bonuses are a major source of early experience, but do not grind one species until exploration stops being fun.",
        "Unlock and craft Partner Skill gear only for Pals you actually use. Technology points are generous, but early materials are not.",
      ], tip: "Cattiva's carrying utility, Foxparks' kindling, Pengullet's watering, and a simple ground mount can all stay useful beyond the opening hours." },
      { id: "expand", title: "Days 5–6 — Expand your map and production", bullets: [
        "Activate Watchtowers and Great Eagle Statues whenever you see them. In 1.0, Watchtowers reveal nearby map areas and also serve as fast-travel points.",
        "Mark ore clusters, dungeon entrances, merchants, Skill Fruit trees, and Alpha Pals on the map.",
        "Build a furnace and assign a Kindling Pal. Ingots unlock the first meaningful jump in tools, equipment, and base facilities.",
        "Carry repair materials, spare Spheres, food, and enough protection for the biome you plan to enter.",
      ] },
      { id: "tower", title: "Day 7 — Test the first tower", intro: "The Rayne Syndicate tower is the first major readiness check. Treat the first attempt as reconnaissance if necessary.", steps: [
        { title: "Upgrade before entering", body: "Equip the best armor, shield, and ranged weapon currently available through your mission and Technology progress. Repair everything first." },
        { title: "Use the matchup", body: "Zoe's Grizzbolt is Electric, so a capable Ground-type Pal gives you a useful elemental advantage. Bring food and keep your own character moving." },
        { title: "Fight at range", body: "Use pillars and distance, recall your Pal before large telegraphed attacks, and redeploy it to reposition. Your survival matters more than constant damage." },
      ], tip: "If the timer or incoming damage feels harsh, leave, capture more Pals, improve gear, and return. The tower is a milestone, not a deadline." },
    ],
    sources: [
      { label: "Official Palworld 1.0 changelog", href: "https://steamcommunity.com/app/1623730/allnews/" },
      { label: "Palworld Wiki — How to Play", href: "https://palworld.wiki.gg/wiki/How_to_Play%3A_Guide_for_Palworld" },
    ],
  },
  {
    slug: "best-early-game-pals",
    number: "02",
    category: "Pals & Teams",
    title: "Best Early-Game Pals",
    description: "A role-based starter roster for gathering, travel, base work, and the first serious fights.",
    readTime: "10 min read",
    updated: "July 13, 2026",
    difficulty: "Beginner",
    takeaway: "There is no single best starter. Catch a compact roster that covers Kindling, Watering, Planting, Gathering, Mining, Handiwork, Transporting, and one dependable mount or fighter.",
    checklist: ["Cattiva or Lamball for early handiwork and transport", "Chikipi for easy food production", "Foxparks for kindling and early combat", "Pengullet for watering and cooling utility", "Tanzee or Lifmunk for planting and gathering", "Rushoar, Direhowl, or another accessible mount", "A Ground-type option before the Rayne Syndicate tower"],
    sections: [
      { id: "workers", title: "The starter workers worth catching", steps: [
        { title: "Cattiva — the flexible helper", body: "Easy to find and useful for Handiwork, Gathering, Mining, and Transporting. Its partner utility can also help with carrying capacity while it is in your party." },
        { title: "Lamball — simple and dependable", body: "A common Handiwork and Transporting worker that can also produce Wool at a Ranch. It is an easy way to keep cloth production moving." },
        { title: "Chikipi — renewable food", body: "Assign it to a Ranch for eggs. It is not a combat star, but renewable ingredients make base life smoother." },
        { title: "Tanzee or Lifmunk — green-work specialists", body: "Both cover useful early Planting and Gathering roles. They help berry production become a background process instead of a daily chore." },
      ] },
      { id: "elements", title: "Early elemental utility", bullets: [
        "Foxparks brings Kindling to the base and Fire damage to the field. Its Partner Skill becomes a close-range flamethrower after you craft the required Pal Gear.",
        "Pengullet provides Watering and Cooling, making it a compact answer for the Crusher, Mill, and early food storage.",
        "A Ground Pal is valuable before the Electric first tower boss. Rushoar is also a practical early mount once its saddle is available.",
        "Do not fill the base with only multi-role Pals. A worker that constantly changes tasks may travel more than it produces; use manual assignment when one station is important.",
      ] },
      { id: "travel", title: "Your first travel upgrades", steps: [
        { title: "Ground mount", body: "A ground mount makes statue-to-statue exploration faster and safer. Direhowl is a popular speed-focused option; Rushoar adds Ground utility and can help with mining." },
        { title: "Flying access", body: "Even a modest early flying mount changes exploration by crossing water, cliffs, and broken terrain. Prioritize access and stamina over perfect combat traits." },
        { title: "Utility slot", body: "Keep one party slot for a Pal whose Partner Skill solves a current problem: weight, gliding, temperature, healing, or resource gathering." },
      ] },
      { id: "traits", title: "How to judge two copies of the same Pal", bullets: [
        "For base workers, prioritize work-speed and movement-oriented passives, then traits that reduce hunger or SAN pressure.",
        "For mounts, movement speed and stamina feel better than a small damage improvement during everyday exploration.",
        "For combat, match the Pal's active skills and element to the encounter. A level advantage cannot always rescue a poor matchup.",
        "Favorites prevent accidental sorting mistakes. Mark the one you are investing in before condensing, selling, or reorganizing the Palbox.",
      ], tip: "Build around roles first and rarity second. A common Pal doing the exact job you need is more valuable than a rare Pal standing idle." },
    ],
    sources: [{ label: "Official Palworld 1.0 changelog", href: "https://steamcommunity.com/app/1623730/allnews/" }, { label: "Palworld Wiki", href: "https://palworld.wiki.gg/" }],
  },
  {
    slug: "explorers-map",
    number: "03",
    category: "Exploration",
    title: "The Explorer's Map",
    description: "A repeatable exploration method for finding travel points, bosses, dungeons, resources, and safe routes.",
    readTime: "11 min read",
    updated: "July 13, 2026",
    difficulty: "All players",
    takeaway: "Explore in loops from a fast-travel point, climb for visibility, mark anything that changes a future route, and return home before weight, hunger, equipment durability, or temperature turns progress into a rescue mission.",
    checklist: ["Food and backup Spheres", "Weather-appropriate armor", "A mount plus a combat Pal", "Repair-ready equipment", "Free carrying capacity", "Custom map markers for resources and bosses"],
    sections: [
      { id: "route", title: "Use the loop method", steps: [
        { title: "Start from a known point", body: "Fast travel to a Great Eagle Statue or Watchtower, then choose one unexplored edge of the map rather than zigzagging across familiar ground." },
        { title: "Make a wide arc", body: "Move outward until your supplies or carrying capacity reach roughly half, then curve back toward another travel point or the original statue." },
        { title: "Bank the route", body: "Unload rare materials, repair, restock, and repeat from the newest point. Short successful loops reveal more than one overloaded expedition that ends in defeat." },
      ] },
      { id: "markers", title: "What deserves a map marker", bullets: [
        "Large ore, coal, sulfur, or quartz clusters — especially those near flat base-ready land.",
        "Dungeon entrances. Their availability can rotate, so a marker is valuable even when an entrance is inactive.",
        "Alpha Pals, tower entrances, raid locations, merchants, settlements, and Skill Fruit trees.",
        "A safe route into extreme-temperature biomes, including a nearby travel point where you can recover.",
        "Any resource or encounter you cannot use yet. Marking it turns today's discovery into tomorrow's shortcut.",
      ] },
      { id: "one-zero", title: "Use the 1.0 map tools", intro: "Version 1.0 makes deliberate exploration more rewarding.", bullets: [
        "Watchtowers reveal surrounding map areas and become fast-travel points once accessed.",
        "Ancient Ruins offer exploration activities and can reward valuable schematics.",
        "Seven additional small islands add volcano, desert, and ruin biomes, each with a reason to revisit.",
        "Sunreach is a late-game sky region with specialized mining, new Pals, and tower challenges. Treat it as a prepared expedition, not an early detour.",
      ] },
      { id: "survival", title: "Avoid the four expedition killers", steps: [
        { title: "Weight", body: "Leave with empty capacity, use a carrying Partner Skill if available, and return before being unable to dodge or mount." },
        { title: "Temperature", body: "Swap armor for the biome and remember that day/night changes can alter exposure. Carry the correct protection before crossing a boundary." },
        { title: "Durability", body: "A broken shield or weapon can turn an easy return trip into a loss. Repair before every long route." },
        { title: "No exit plan", body: "Activate travel points as you go. If you enter a dungeon or boss arena, know whether you can leave and what defeat settings apply in your world." },
      ], tip: "Exploration is a logistics problem disguised as sightseeing. The best route is the one that returns with useful information as well as loot." },
    ],
    sources: [{ label: "Official Palworld 1.0 changelog", href: "https://steamcommunity.com/app/1623730/allnews/" }, { label: "Palworld Wiki — Ores", href: "https://palworld.wiki.gg/wiki/Ores" }],
  },
  {
    slug: "build-a-better-base",
    number: "04",
    category: "Base Building",
    title: "Build a Better Base",
    description: "A clean base layout that reduces walking, prevents bottlenecks, and keeps workers healthy.",
    readTime: "12 min read",
    updated: "July 13, 2026",
    difficulty: "Beginner–Intermediate",
    takeaway: "Design the base as a short production loop: resources enter, processing happens nearby, and finished items land in accessible storage. Wide paths and worker care beat decorative density.",
    checklist: ["Flat central Palbox area", "Clear paths at least two foundations wide", "Storage beside resource and production stations", "One bed per active worker", "Reliable food plus hot springs", "Separate farming, heavy production, and breeding zones"],
    sections: [
      { id: "site", title: "Choose a site workers can navigate", bullets: [
        "Favor flat terrain over dramatic cliffs. Large Pals need more clearance than the player, especially around doors, stairs, and station entrances.",
        "Place the Palbox with clear space around its terminal. You will use it constantly for team changes, travel, and base management.",
        "Keep essential facilities inside the circular boundary. Structures outside a base may be subject to decay depending on world settings.",
        "Natural resource nodes are helpful early, but later Ore, Coal, Sulfur, and Pure Quartz facilities give you more freedom to choose a base for layout rather than deposits.",
      ] },
      { id: "zones", title: "Use four simple zones", steps: [
        { title: "Arrival and storage", body: "Put general storage close to the Palbox so an overloaded return trip ends quickly. Keep separate labeled containers only when they reduce confusion." },
        { title: "Heavy production", body: "Group furnaces, crushers, assembly lines, and material storage. Leave open working sides so assigned Pals can reach interaction points." },
        { title: "Food and farming", body: "Keep plantations, Mill, Cooking Pot, feed storage, and cold storage close together. Farming uses several Work Suitabilities, so long paths multiply delays." },
        { title: "Rest and recovery", body: "Beds, hot springs, and medical facilities need easy access. Do not hide them on cramped upper floors unless you have tested pathing with your largest workers." },
      ] },
      { id: "workers", title: "Build a balanced workforce", bullets: [
        "Use specialists on critical facilities and multi-role Pals for general maintenance.",
        "Assign a Transporting Pal whenever mines, Ranches, or plantations produce loose items faster than you collect them.",
        "Check the base status panel for hunger, injury, low SAN, and workers stuck in repeated task switching.",
        "The Clinic and improved Monitoring Stand variants introduced in 1.0 can help reduce SAN loss and illness, but layout, food, and reasonable work settings still matter.",
        "Use the Palbox Favorite and Retrieve All controls to protect important workers and recover from pathing problems quickly.",
      ] },
      { id: "mistakes", title: "Common layout mistakes", bullets: [
        "Building walls before testing whether large Pals can use the route.",
        "Placing storage across the base from the facility that creates the item.",
        "Stacking production floors with low ceilings or narrow stairs.",
        "Using every available worker slot without enough beds, food, recovery, or actual tasks.",
        "Decorating the Palbox terminal so heavily that interaction and respawn space becomes awkward.",
      ], tip: "Run the base for one full in-game day before expanding it. Watch where workers pause, turn around, or drop items; those are your real design problems." },
    ],
    sources: [{ label: "Palworld Wiki — Base", href: "https://palworld.wiki.gg/wiki/Base" }, { label: "Official Palworld 1.0 changelog", href: "https://steamcommunity.com/app/1623730/allnews/" }],
  },
  {
    slug: "ore-coal-sulfur-routes",
    number: "05",
    category: "Resources",
    title: "Ore, Coal & Sulfur Routes",
    description: "A progression-first material plan that tells you what to mine, what to automate, and what to mark for later.",
    readTime: "10 min read",
    updated: "July 13, 2026",
    difficulty: "Intermediate",
    takeaway: "Mine only enough by hand to unlock the next production tier. Mark dense clusters, use the correct Mining suitability, and replace repeated trips with base facilities as they become available.",
    checklist: ["Best available pickaxe or mining Pal", "A nearby fast-travel point", "High free carry weight", "Heat or cold protection", "Mining workers plus Transporting workers", "Storage beside every base mining facility"],
    sections: [
      { id: "priority", title: "Know what each material unlocks", steps: [
        { title: "Ore", body: "The backbone of metal progression. It refines into Ingots and contributes to later metal types, weapons, armor, Spheres, and production facilities." },
        { title: "Coal", body: "A mid-game material used with Ore for Refined Ingots. It appears in dark clusters and needs stronger Mining suitability than basic stone." },
        { title: "Sulfur", body: "The yellow volcanic resource used with Charcoal to make Gunpowder. Demand rises sharply once firearms become a regular part of combat." },
        { title: "Pure Quartz", body: "A cold-region resource used for advanced electronics such as Circuit Boards. Treat it as a planned expedition because weight and temperature stack together." },
      ] },
      { id: "levels", title: "Match the worker to the node", bullets: [
        "Mining level 1 handles Stone and Paldium Fragment work.",
        "Mining level 2 can handle Ore and Sulfur.",
        "Mining level 3 or higher is needed for Coal and Pure Quartz.",
        "A Pal that can damage a node is not automatically an efficient base miner. Work Suitability, task assignment, Work Speed, and Transporting support all affect output.",
      ] },
      { id: "field", title: "Make field trips efficient", steps: [
        { title: "Travel light", body: "Empty your inventory, bring only tools, food, protection, and combat essentials. Ore is heavy enough to end a route early." },
        { title: "Mine clusters, not singles", body: "Dense locations reduce travel time. Mark them permanently and note the closest statue, Watchtower, or safe base location." },
        { title: "Return before overloaded", body: "Do not sacrifice all mobility for one more node. A mount, carrying Partner Skill, or temporary chest can help, but a short repeatable route is safer." },
      ] },
      { id: "automate", title: "Replace routes with automation", bullets: [
        "The Ore Mining Site unlocks a renewable base source of Ore. Place storage close enough that Transporting workers clear its output quickly.",
        "Coal Mine and Sulfur Mine are later Ancient Technology facilities that reduce dependence on natural deposits.",
        "Pure Quartz also has a dedicated late-game facility. Until then, mark cold-region clusters and gather in prepared bursts.",
        "Higher Mining suitability completes station work faster. Pair strong miners with enough transport and food so the station does not become a pile of uncollected items.",
      ], tip: "The goal of a resource route is to make itself obsolete. Every manual trip should move you closer to stable base production." },
    ],
    sources: [{ label: "Palworld Wiki — Mining", href: "https://palworld.wiki.gg/wiki/Mining" }, { label: "Palworld Wiki — Ore Mining Site", href: "https://palworld.wiki.gg/wiki/Ore_Mining_Site" }, { label: "Palworld Wiki — Coal Mine", href: "https://palworld.wiki.gg/wiki/Coal_Mine" }, { label: "Palworld Wiki — Sulfur Mine", href: "https://palworld.wiki.gg/wiki/Sulfur_Mine" }],
  },
  {
    slug: "first-tower-boss",
    number: "06",
    category: "Combat",
    title: "Prepare for Your First Tower Boss",
    description: "A safe preparation and combat plan for Zoe and Grizzbolt at the Rayne Syndicate tower.",
    readTime: "9 min read",
    updated: "July 13, 2026",
    difficulty: "Beginner",
    takeaway: "Bring repaired ranged gear, a trained Ground-type Pal, healing food, and a clear understanding of the timer. Keep moving, use cover, and recall your Pal before it absorbs a large telegraphed attack.",
    checklist: ["Best available armor and shield", "Repaired ranged weapon plus ammunition", "Ground-type Pal with useful active skills", "A second healthy combat option", "Food for player and Pals", "Unencumbered inventory and nearby fast travel"],
    sections: [
      { id: "ready", title: "Readiness test", bullets: [
        "You can defeat nearby enemies without spending most of your ammunition or losing your active Pal.",
        "Your shield and armor are current for the Technology tier reached through the opening missions.",
        "Your main Pal has been leveled through real fights or captures and has active skills equipped for the encounter.",
        "You can carry the full combat load without becoming encumbered.",
        "You have activated the nearest travel point and know what your world's death penalty will drop.",
      ] },
      { id: "team", title: "Build the matchup", intro: "Grizzbolt is an Electric Pal. Ground damage is the natural answer, but survival and skill quality matter more than forcing an under-leveled counter.", bullets: [
        "Choose a Ground-type Pal that can reliably connect attacks in the arena rather than one built only for base work.",
        "Equip active skills with different cooldowns so your Pal has something useful to do throughout the fight.",
        "Carry a second combat Pal to cover a knockout or create a safe window while the first recovers.",
        "Feed your team before entry. Do not begin with low health, hunger, damaged gear, or an incomplete ammunition stack.",
      ] },
      { id: "fight", title: "The fight plan", steps: [
        { title: "Open with space", body: "Move away from the spawn area, deploy your Pal, and establish a line of sight that leaves cover nearby. Do not stand beside your Pal and invite the same attack to hit both of you." },
        { title: "Keep the player active", body: "Use a ranged weapon while your Pal attacks. Aim consistently, but stop shooting early enough to dodge telegraphed charges and area attacks." },
        { title: "Recall to protect", body: "Recall your Pal when a large attack is clearly committed, then redeploy it after the danger passes. This also lets you change the boss's target and improve positioning." },
        { title: "Respect the timer", body: "The tower is a damage check as well as a survival test. If the timer is the problem, upgrade weapon damage, ammunition supply, and Pal skills before returning." },
      ] },
      { id: "failure", title: "If you lose, diagnose one cause", bullets: [
        "Player defeated quickly: improve shield and armor, carry less weight, and prioritize dodging over damage.",
        "Pal defeated quickly: level it, change the elemental matchup, recall it during major attacks, or bring a stronger second option.",
        "Timer expired: improve ranged damage, bring more ammunition, and select Pal skills that connect reliably rather than miss or collide with cover.",
        "Ran out of supplies: move ammunition and repair materials into a dedicated pre-boss chest at the base so preparation is repeatable.",
      ], tip: "A clean first clear is mostly preparation. If you enter with the right matchup and enough damage, the arena becomes a simple rhythm of shoot, dodge, recall, and redeploy." },
    ],
    sources: [{ label: "Official Palworld 1.0 changelog", href: "https://steamcommunity.com/app/1623730/allnews/" }, { label: "Palworld Wiki", href: "https://palworld.wiki.gg/" }],
  },
];

export function getGuide(slug: string) {
  return guides.find((guide) => guide.slug === slug);
}
