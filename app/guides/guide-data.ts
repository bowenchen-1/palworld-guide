export type GuideSection = {
  id: string;
  title: string;
  intro?: string;
  steps?: { title: string; body: string }[];
  bullets?: string[];
  tip?: string;
};

export type VideoResearch = {
  title: string;
  creator: string;
  href: string;
  reviewed: string;
  focus: string;
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
  videoResearch: VideoResearch[];
};

export type GuideCategory = {
  id: string;
  name: string;
  description: string;
  icon: string;
  accent: string;
  soft: string;
};

export const guideCategories: GuideCategory[] = [
  { id: "getting-started", name: "Getting Started", description: "Fresh-save routes, technology priorities and habits that prevent early grind.", icon: "☀", accent: "#e9665d", soft: "#fff0dc" },
  { id: "pals-breeding", name: "Pals & Breeding", description: "Build better parties, workers and breeding projects without wasting good traits.", icon: "✦", accent: "#2f8b5a", soft: "#e6f5df" },
  { id: "base-building", name: "Base Building", description: "Layouts, worker paths, food systems and production chains that keep moving.", icon: "⌂", accent: "#c87839", soft: "#ffedd6" },
  { id: "resources-crafting", name: "Resources & Crafting", description: "Repeatable farming loops, storage rules and the handoff to automation.", icon: "◆", accent: "#7166b5", soft: "#eee9fb" },
  { id: "exploration", name: "Exploration", description: "Map-clearing circuits, dungeons, missions and safer expedition planning.", icon: "⌖", accent: "#27849d", soft: "#ddf3f5" },
  { id: "combat", name: "Combat", description: "Boss preparation, elemental matchups, loadouts and reliable fight rhythms.", icon: "⚑", accent: "#c6534e", soft: "#ffe7e0" },
];

const earlyGameVideo: VideoResearch = {
  title: "Palworld 1.0 — Do This Now: Early Pals, Base Unlocks, Iron and Flight",
  creator: "RageGamingVideos",
  href: "https://www.youtube.com/watch?v=iM8Z05uoW08",
  reviewed: "Reviewed July 2026",
  focus: "Fresh-save priorities, early Pals, capture progress, raids and the Desolate Church ore route.",
};

const featuresVideo: VideoResearch = {
  title: "Palworld 1.0 — Biggest New Features and Mistakes to Avoid",
  creator: "KhrazeGaming",
  href: "https://www.youtube.com/watch?v=EDa-AHQ9iw4",
  reviewed: "Reviewed July 2026",
  focus: "Watchtowers, Hacking Towers, new regions, combat changes and progression traps.",
};

const baseVideo: VideoResearch = {
  title: "Palworld 1.0 Base Building Tips I Wish I Knew Sooner",
  creator: "Chaos Bear Gaming",
  href: "https://www.youtube.com/watch?v=dnzEsx99PVM",
  reviewed: "Reviewed July 2026",
  focus: "Palbox placement, circular foundations, perimeter space, vertical layouts and worker pathing.",
};

const stackingVideo: VideoResearch = {
  title: "Palworld New Stacking Method: Pro Base Building Tips",
  creator: "Chaos Bear Gaming",
  href: "https://www.youtube.com/watch?v=xsAVWeKlS7k",
  reviewed: "Rechecked for 1.0 in July 2026",
  focus: "Compact plantation and storage layouts using alignment and temporary support pieces.",
};

const resourceVideo: VideoResearch = {
  title: "Palworld 1.0 — How to Farm Infinite Resources Fast",
  creator: "RageGamingVideos",
  href: "https://www.youtube.com/watch?v=SKJ_4xaILiI",
  reviewed: "Reviewed July 2026",
  focus: "Manual resource loops, early mining bases, ranch production and the handoff to automation.",
};

const missionVideo: VideoResearch = {
  title: "Do These Palworld Missions Now: Rare Weapons and Armor Locations",
  creator: "Verlisify",
  href: "https://www.youtube.com/watch?v=p7SJ07xtU_A",
  reviewed: "Reviewed July 2026",
  focus: "Mission routing, Hacking Tower rewards and exploration objectives worth prioritizing.",
};

const combatVideo: VideoResearch = {
  title: "Palworld 1.0: 10 Advanced Tips You Need for the Mid-Game",
  creator: "Azrial",
  href: "https://www.youtube.com/watch?v=HF5TTuPxUfg",
  reviewed: "Reviewed July 2026",
  focus: "Combat visibility, safe capture tools, food buffs and practical preparation habits.",
};

type QuickGuide = {
  slug: string;
  number: string;
  category: string;
  title: string;
  description: string;
  difficulty?: string;
  takeaway: string;
  checklist: string[];
  sections: GuideSection[];
  videos: VideoResearch[];
};

function makeGuide({ slug, number, category, title, description, difficulty = "All players", takeaway, checklist, sections, videos }: QuickGuide): Guide {
  return {
    slug,
    number,
    category,
    title,
    description,
    readTime: `${Math.max(7, sections.length * 3)} min read`,
    updated: "July 14, 2026",
    difficulty,
    takeaway,
    checklist,
    sections,
    videoResearch: videos,
  };
}

export const guides: Guide[] = [
  {
    slug: "first-7-days",
    number: "01",
    category: "Getting Started",
    title: "Your First 7 Days in Palworld",
    description: "A player-tested fresh-save route for learning 1.0, building a useful base, and reaching the first tower without grinding blindly.",
    readTime: "12 min read",
    updated: "July 14, 2026",
    difficulty: "Beginner",
    takeaway: "Learn the new command controls, spend early points where they save the most time, complete the five-capture loop as you explore, and build only enough base infrastructure to unlock better Pals, ore and mobility.",
    checklist: [
      "Learn the command that focuses your active Pal on one target",
      "Put early stat points into Stamina, then useful Work Speed",
      "Catch five of each easy species while following the story route",
      "Add Cattiva, Daedream and Pupperai to your early rotation",
      "Build beds, food, storage, a hot spring and the stations your base actually uses",
      "Secure a repeatable ore source before committing to heavy production",
    ],
    sections: [
      {
        id: "day-one",
        title: "Day 1 — Learn the 1.0 opening loop",
        intro: "The fastest start is not a straight sprint toward the tower. It is a loop of capture, unlock, build and leave again.",
        steps: [
          { title: "Learn focused Pal commands", body: "Pal targeting changed in 1.0. Practice the command that sends your active Pal at the enemy you are aiming at, because reliable focus fire matters more than throwing your Pal and hoping it chooses correctly." },
          { title: "Spend points for immediate value", body: "Stamina improves nearly everything you do outside the base. Once crafting becomes the bottleneck, a few Work Speed points are far more noticeable than a tiny early Attack increase." },
          { title: "Capture in sets of five", body: "The current capture milestone rewards the first five copies of a species. Complete easy sets while moving through new areas instead of standing in one field and overfarming a single Pal." },
        ],
        tip: "Keep one Cattiva in the party when weight is slowing you down. Its carry bonus can replace early Weight spending while your party slots are still flexible.",
      },
      {
        id: "first-team",
        title: "Days 2–3 — Build a problem-solving team",
        bullets: [
          "Catch Daedream near the starting region. Its 1.0 partner behavior can chip a capture target without finishing it, making low-HP throws much less stressful.",
          "Catch Pupperai for a Ground option before the first Electric tower fight. Its party utility also supports the melee-heavy opening hours.",
          "Let early raids happen if your base can survive them. They are a source of experience, captures and possible Direhowl access for a fast first ground mount.",
          "Use the other slots for current needs: one worker you want to level, one elemental counter and one travel or carrying utility Pal.",
        ],
      },
      {
        id: "base",
        title: "Days 3–5 — Build the smallest base that runs itself",
        steps: [
          { title: "Cover survival first", body: "Give every active worker a bed, keep a feed box stocked, add a hot spring, and place storage beside the stations that create loose items." },
          { title: "Balance the work chain", body: "A plantation needs Planting, Watering and Gathering; ingots need Mining, Transporting and Kindling. Assign the whole chain instead of adding more miners to an unfinished process." },
          { title: "Keep walking distances short", body: "Put automated stations, food and storage close together. A compact route often produces more than a larger base filled with workers who spend the day crossing it." },
        ],
        tip: "Do not decorate permanent walls around an untested layout. Run the base for a full day, watch where workers get stuck, and only then make it pretty.",
      },
      {
        id: "ore-and-tower",
        title: "Days 5–7 — Solve ore, then test the tower",
        bullets: [
          "The ore cluster behind the Desolate Church is a strong early answer before the Ore Mining Site arrives. A small mining outpost can turn repeated pickaxe trips into passive stock.",
          "Use Mining level 2 or better for natural ore nodes, and pair miners with transport workers so the ground does not fill with heavy drops.",
          "Enter nearby dungeons when you pass them. In 1.0, some are short treasure rooms; normal ones can still supply useful nodes and materials.",
          "Before the tower, repair gear, bring enough ammunition, feed the party, and choose a trained Ground-type Pal rather than a high-level worker with poor combat skills.",
        ],
      },
    ],
    videoResearch: [earlyGameVideo, featuresVideo],
  },
  {
    slug: "best-early-game-pals",
    number: "02",
    category: "Pals & Breeding",
    title: "Best Early-Game Pals",
    description: "A compact 1.0 roster chosen for capture control, carrying, travel, base work and the first tower matchup.",
    readTime: "11 min read",
    updated: "July 14, 2026",
    difficulty: "Beginner",
    takeaway: "The best early roster is a toolkit, not a tier list: use Cattiva for carrying, Daedream for safer captures, Pupperai for early Ground utility, Direhowl for travel, and a stronger miner such as Penking or Tombat when ore becomes the bottleneck.",
    checklist: [
      "Cattiva for flexible base work and party carrying",
      "Daedream for low-risk capture setup",
      "Pupperai for Ground coverage and early melee support",
      "Direhowl or another accessible mount",
      "Penking or Tombat when natural ore nodes become important",
      "One farming trio that covers Planting, Watering and Gathering",
    ],
    sections: [
      {
        id: "core-three",
        title: "The first three Pals to look for",
        steps: [
          { title: "Cattiva — carry and cover", body: "Cattiva is common, works several starter jobs, and provides party carrying utility. It is not the final answer to any one job, but it removes several early annoyances at once." },
          { title: "Daedream — capture control", body: "Daedream's reworked partner behavior is the standout capture tool: it can keep pressure on a target without pushing that target below one HP. Use it when accidental knockouts are wasting Spheres and time." },
          { title: "Pupperai — first-tower value", body: "Pupperai is available early, brings a Ground matchup into the first Electric tower battle, and supports the melee weapons that dominate the opening technology tiers." },
        ],
      },
      {
        id: "movement",
        title: "Upgrade movement before damage",
        bullets: [
          "Direhowl is a high-value early raid capture because its saddle turns long statue-to-statue runs into short trips.",
          "Hangyu remains useful as traversal utility when cliffs and gaps matter more than raw speed.",
          "Take the first practical flying option you can actually saddle. Access to high ground and safer scouting matters more than perfect passives on an early mount.",
          "Do not keep five combat Pals in the party. One carrying or traversal slot usually saves more time than a redundant attacker.",
        ],
      },
      {
        id: "workers",
        title: "Graduate from starter workers",
        bullets: [
          "Natural ore needs a stronger miner than basic stone work. Penking is an accessible upgrade near the early tower route, while Tombat can provide stronger mining if you find or purchase one early.",
          "Purchased Pals scale to your level, but their Work Suitability remains useful. Check Black Market stock when your base lacks a specialist.",
          "A balanced farm needs Planting, Watering and Gathering before it needs a second plantation. Fix the missing step first.",
          "Use specialists for permanent bottlenecks and flexible Pals for cleanup, transporting and short crafting queues.",
        ],
      },
      {
        id: "keep-or-box",
        title: "How to decide which copy to keep",
        bullets: [
          "For field use, prefer a Pal whose active skills can reliably hit the fights you are actually taking.",
          "For base work, value the required Work Suitability first; passives are a bonus until production is stable.",
          "For travel, movement and stamina quality matter every minute, while a small damage bonus matters only during fights.",
          "Keep unusual passives even on a Pal you do not currently use. The 1.0 breeding and synergy systems make a good trait more valuable later.",
        ],
        tip: "Build around jobs, not rarity. A common Pal solving today's bottleneck is better than a rare Pal waiting in the box for a future build.",
      },
    ],
    videoResearch: [earlyGameVideo, featuresVideo],
  },
  {
    slug: "explorers-map",
    number: "03",
    category: "Exploration",
    title: "The Explorer's Map",
    description: "A 1.0 scouting method for Watchtowers, Hacking Towers, dungeons, missions and resource routes that are worth revisiting.",
    readTime: "12 min read",
    updated: "July 14, 2026",
    difficulty: "All players",
    takeaway: "Build every expedition around a visible objective: reveal the region from a Watchtower, check nearby Hacking Towers and dungeons, mark any repeatable resource or mission stop, then return before weight and durability erase the value of the trip.",
    checklist: [
      "Food, Spheres and repaired equipment",
      "A mount plus one reliable combat Pal",
      "Free carrying capacity",
      "Temperature protection for the destination",
      "A plan for the nearest Watchtower or fast-travel point",
      "Consistent map markers for resources, bosses and dungeons",
    ],
    sections: [
      {
        id: "watchtowers",
        title: "Start each region at a Watchtower",
        bullets: [
          "Watchtowers clear local map fog, reveal nearby points of interest and become part of your travel network.",
          "Look for the wind circle near the base when the tower seems unreachable. A grapple, glider Pal or flying mount is another valid route upward.",
          "Use the revealed icons to create one local circuit instead of crossing the whole world for a single objective.",
          "Finish the circuit at a travel point so your next expedition begins deeper in the region.",
        ],
      },
      {
        id: "hacking-towers",
        title: "Do not skip Hacking Towers",
        intro: "These bright technology structures are short activities with a much better time-to-reward ratio than random wandering.",
        steps: [
          { title: "Complete the circuit", body: "Connect the path through the simple panel puzzle. The activity is brief enough to include whenever one appears on a route." },
          { title: "Check the reward, not just the XP", body: "Hacking Towers can award schematics and accessories in addition to experience. A strong resistance or combat accessory may change which biome or mission you can attempt next." },
          { title: "Mark the surrounding cluster", body: "Treat the tower as an anchor. Nearby missions, bosses and dungeons can often be cleared in the same supply run." },
        ],
      },
      {
        id: "dungeons",
        title: "Peek into every dungeon once",
        bullets: [
          "Some 1.0 dungeons can open into a short treasure room with little or no combat, so the entrance itself is worth checking.",
          "Normal dungeons still justify the detour through concentrated materials, possible sulfur, mushrooms, lotuses and boss rewards.",
          "Mark an entrance even when you do not clear it. Availability and your readiness can change on a later visit.",
          "Leave enough weight for the dungeon before entering; mining every node while already full turns good loot into inventory management.",
        ],
      },
      {
        id: "loop",
        title: "Run a four-step exploration loop",
        steps: [
          { title: "Reveal", body: "Activate the regional tower or the nearest travel point and choose one edge of the newly visible area." },
          { title: "Collect", body: "Clear one mission, dungeon or resource cluster rather than bouncing between unrelated icons." },
          { title: "Record", body: "Mark repeatable resources, difficult fights and useful merchants with a consistent symbol system." },
          { title: "Return", body: "Bank materials before weight, hunger, temperature or durability turns a successful route into a rescue trip." },
        ],
        tip: "A good expedition returns with two things: loot for today and a shorter route for tomorrow.",
      },
    ],
    videoResearch: [featuresVideo, missionVideo],
  },
  {
    slug: "build-a-better-base",
    number: "04",
    category: "Base Building",
    title: "Build a Better Base",
    description: "A creator-tested 1.0 layout that saves space, shortens worker routes, and leaves room for later production.",
    readTime: "13 min read",
    updated: "July 14, 2026",
    difficulty: "Beginner–Intermediate",
    takeaway: "Center the Palbox carefully, leave its worker spawn side clear, group automated stations around food and storage, give stairs a full foundation of approach, and use alignment tools before resorting to cramped decorative layouts.",
    checklist: [
      "Flat area with enough space to preview the full Palbox circle",
      "Clear worker spawn space behind the Palbox",
      "Automated stations grouped around storage and food",
      "Wide stairs with a full foundation of approach",
      "Two or three floors of clearance for large Pals and machinery",
      "A one-day pathing test before permanent decoration",
    ],
    sections: [
      {
        id: "palbox",
        title: "Place the Palbox before the base",
        steps: [
          { title: "Preview the circle", body: "Use a small centered foundation area to test the Palbox boundary before filling the site. The sphere side is the front; workers appear from the back, so keep that side open." },
          { title: "Build toward the edges", body: "Extend foundations in the four main directions first, then fill the diagonal gaps. This produces a usable circular footprint instead of a square that wastes the corners." },
          { title: "Treat perimeter tricks as patch-sensitive", body: "Some large structures can sit partly beyond the boundary while still counting as inside. Test the placement and deterioration warning in your current world before building a permanent wing around it." },
        ],
      },
      {
        id: "workflow",
        title: "Separate automated and manual work",
        bullets: [
          "Group mining, plantations, electricity and ranch output around a central food box and storage cluster. These jobs run constantly, so every saved step matters.",
          "Move workbenches and cooking stations farther out. Workers visit them only when you queue a job, so they do not deserve the best central space.",
          "Keep transport routes short and unobstructed. A high-level hauler cannot fix a layout that forces it across the base for every item.",
          "Leave the working side of solid stations open; non-solid mining structures can be placed where workers can safely walk through them.",
        ],
      },
      {
        id: "vertical",
        title: "Go vertical without breaking pathing",
        bullets: [
          "Use at least two floors of height for ordinary Pal traffic and three around tall machinery or very large workers.",
          "Give every staircase a full foundation of straight approach. Tight turns at the foot of stairs are a common cause of stalled workers.",
          "Keep daily production on the ground floor. Breeding, expeditions and other set-and-forget structures are better upstairs.",
          "Place oversized equipment before closing walls and ceilings so you can confirm its footprint and interaction point.",
        ],
      },
      {
        id: "stacking",
        title: "Use stacking for space, not for chaos",
        bullets: [
          "Alignment mode can line up storage, stairs and workstations against a wall more reliably than free placement.",
          "A small support item such as a floor cushion can act as a temporary spacer for stackable plantations or containers; remove it only after confirming the upper piece remains stable.",
          "Keep plantation stacks modest. The current creator-tested route recommends stopping around four levels because taller stacks create pathing failures.",
          "Stack storage close to the station that produces the item, not in a remote warehouse that turns every delivery into a commute.",
        ],
        tip: "Watch the base operate for one full in-game day. Where a Pal pauses, turns around or drops an item is more valuable design feedback than how the layout looks from above.",
      },
    ],
    videoResearch: [baseVideo, stackingVideo],
  },
  {
    slug: "ore-coal-sulfur-routes",
    number: "05",
    category: "Resources & Crafting",
    title: "Ore, Coal & Sulfur Routes",
    description: "A 1.0 resource plan that moves from light manual runs to mining outposts and finally to permanent base automation.",
    readTime: "11 min read",
    updated: "July 14, 2026",
    difficulty: "Intermediate",
    takeaway: "Travel empty, mine dense clusters, use dungeons for early sulfur, and stop repeating a route as soon as the corresponding base facility becomes practical. The best farming route is the one your base eventually replaces.",
    checklist: [
      "Empty inventory and the best available pickaxe",
      "A carrying Pal or mount",
      "Temperature protection for the destination",
      "Mining workers strong enough for the target node",
      "Transport workers and storage beside the mining area",
      "A clear next automation unlock in the Technology tree",
    ],
    sections: [
      {
        id: "manual",
        title: "Make manual runs short and dense",
        steps: [
          { title: "Leave almost empty", body: "Ore and later metals consume carrying capacity quickly. Bring only tools, food, protection, Spheres and the combat gear needed for the route." },
          { title: "Mine clusters, not single nodes", body: "A dense field near a travel point is worth repeating; scattered nodes along a long ride are not. Mark the closest exit before you start mining." },
          { title: "Return while movement still works", body: "Do not trade every dodge and mount action for one extra node. A safe ten-minute loop is better than a twenty-minute overloaded walk home." },
        ],
      },
      {
        id: "early-ore",
        title: "Use an early ore outpost",
        bullets: [
          "The Desolate Church cluster packs several ore nodes close enough for a compact early mining base.",
          "Natural ore requires Mining level 2 or better. Add transport workers and nearby storage or the output will remain on the ground.",
          "Keep the outpost minimal: beds, food, recovery, storage and only the production needed to support mining.",
          "If base slots are scarce, mine the cluster manually from the travel point until the Ore Mining Site makes the trip obsolete.",
        ],
      },
      {
        id: "coal-sulfur",
        title: "Treat coal and sulfur differently",
        bullets: [
          "Coal is a mid-game bottleneck worth collecting in dense clusters or at a dedicated site once refined metal production becomes routine.",
          "Sulfur appears in early dungeons, making dungeon checks the least disruptive way to build a starter gunpowder stock while still earning other rewards.",
          "Do not build a permanent base around one weak node. A dedicated outpost should solve several trips or support another useful resource nearby.",
          "Use the Technology tree in your current save as the authority for timing; world settings and future patches can change how quickly you reach an automation tier.",
        ],
      },
      {
        id: "automation",
        title: "Hand the route to your base",
        bullets: [
          "The current 1.0 farming route places the Ore Mining Site around level 24, with coal and sulfur automation arriving later. Check the live unlock before planning a permanent move.",
          "Place storage beside every mining facility and assign enough transport capacity to clear output between work cycles.",
          "Keep miners fed, rested and focused on the job. More workers do not help if half the team is switching tasks or carrying items across the base.",
          "Once automation covers ordinary demand, save field trips for sudden crafting spikes or resources that have not reached a base facility yet.",
        ],
        tip: "Every manual run should buy progress toward the facility that ends that run permanently.",
      },
    ],
    videoResearch: [resourceVideo, baseVideo],
  },
  {
    slug: "first-tower-boss",
    number: "06",
    category: "Combat",
    title: "Prepare for Your First Tower Boss",
    description: "A cautious 1.0 preparation plan for Zoe and Grizzbolt that focuses on matchup, targeting, movement and repeatable damage.",
    readTime: "10 min read",
    updated: "July 14, 2026",
    difficulty: "Beginner",
    takeaway: "Bring a trained Ground-type Pal, repaired ranged gear and enough ammunition; use the new focus-target command, keep yourself separate from your Pal, and treat a failed attempt as information about damage, survival or supplies.",
    checklist: [
      "A trained Ground-type Pal such as an invested Pupperai",
      "A second healthy combat option",
      "Repaired armor, shield and ranged weapon",
      "Enough ammunition for a full timed attempt",
      "Food for the player and active Pals",
      "The focus-target command bound and practiced",
    ],
    sections: [
      {
        id: "matchup",
        title: "Build for the Electric matchup",
        bullets: [
          "Zoe and Grizzbolt make the first tower an Electric encounter, so Ground damage is the clearest early advantage.",
          "Pupperai is a convenient 1.0 starter because it is available near the opening route and also supports early melee play while in the party.",
          "Do not force an untrained counter into the fight. A Pal with the right element still needs useful active skills, adequate level and enough health to stay present.",
          "Carry a second combat Pal so one knockout does not turn the rest of the timer into a player-only damage check.",
        ],
      },
      {
        id: "readiness",
        title: "Pass the readiness check",
        steps: [
          { title: "Repair everything", body: "A damaged shield or weapon is avoidable failure. Repair before travel, then enter without the weight of unrelated gathering materials." },
          { title: "Count ammunition", body: "Bring enough for a complete timed attempt, not enough for the first minute. If ammunition is expensive, improve the production loop before repeatedly entering." },
          { title: "Feed the team", body: "Start at full health and hunger. Useful food buffs can increase your margin, but ordinary preparation matters more than chasing a perfect recipe." },
        ],
      },
      {
        id: "fight",
        title: "Use a simple fight rhythm",
        steps: [
          { title: "Focus the correct target", body: "Aim and use the 1.0 command that directs your active Pal at the chosen enemy. This removes wasted attacks and makes your damage plan repeatable." },
          { title: "Split the incoming attacks", body: "Stand away from your Pal so a single charge or area attack does not hit both of you. Keep a pillar or clear dodge lane nearby." },
          { title: "Shoot, dodge, recall", body: "Use your ranged weapon while the Pal attacks, stop shooting early enough to dodge, and recall the Pal when a large telegraphed hit is about to land." },
          { title: "Redeploy from a better angle", body: "Throw the Pal back out after the danger passes. Redeployment is both protection and repositioning, not a sign that the attempt is going badly." },
        ],
      },
      {
        id: "diagnose",
        title: "Turn a loss into one clear upgrade",
        bullets: [
          "If the player dies first, improve armor and shield quality, carry less, and spend more attention on movement.",
          "If the Pal dies first, level it, change skills, recall earlier or bring a sturdier Ground option.",
          "If the timer expires, improve weapon damage, ammunition supply and the uptime of Pal attacks that actually connect.",
          "If supplies run out, create a boss-preparation chest at the base so the next attempt begins with the same complete loadout.",
        ],
        tip: "The first clear is mostly logistics. Once survival, ammunition and target focus are stable, the fight becomes a repeatable rhythm instead of a scramble.",
      },
    ],
    videoResearch: [earlyGameVideo, combatVideo],
  },
  makeGuide({
    slug: "technology-points-priorities",
    number: "07",
    category: "Getting Started",
    title: "Technology Points: What to Unlock First",
    description: "A practical unlock order that favors movement, reliable production and the tools your current route actually needs.",
    difficulty: "Beginner",
    takeaway: "Spend points on the next bottleneck, not the most exciting icon: survival basics, a usable weapon, one travel upgrade and the production station required for your next objective.",
    checklist: ["Current objective", "Missing crafting station", "Ammunition plan", "Mount saddle requirement", "Unspent point reserve", "Next automation milestone"],
    sections: [
      { id: "survival-first", title: "Buy the first complete loop", bullets: ["Unlock a bed, food production, storage and the tools required to keep workers healthy.", "Choose one dependable weapon line instead of buying every early weapon and its ammunition chain.", "Reserve points until a real need appears; an unlocked recipe has no value if its materials are still out of reach."] },
      { id: "movement", title: "Movement beats a small damage upgrade", bullets: ["Prioritize the saddle for a Pal you already own and plan to use.", "Add traversal tools that solve cliffs, gaps or long overland routes in the region you are exploring.", "Skip saddles for Pals that will stay in the box; collect the point later if the Pal becomes part of your route."] },
      { id: "production", title: "Unlock production in chains", bullets: ["Before buying a station, confirm its input material, power or worker requirement.", "Pair every new production step with nearby storage so its output enters the next recipe quickly.", "Use the Technology tree as a roadmap toward the facility that replaces your most repeated manual trip."] },
    ],
    videos: [earlyGameVideo, resourceVideo],
  }),
  makeGuide({
    slug: "first-mount-route",
    number: "08",
    category: "Getting Started",
    title: "Your First Mount and Faster Travel",
    description: "Choose the first practical ground and air options without waiting for perfect stats or rare traits.",
    difficulty: "Beginner",
    takeaway: "The best first mount is the one you can capture, saddle and use now; upgrade later when a faster option changes a route you run often.",
    checklist: ["Captured mount candidate", "Saddle unlock", "Crafting materials", "Open party slot", "Food for the trip", "Nearby travel point"],
    sections: [
      { id: "ground", title: "Start with a usable ground mount", bullets: ["Direhowl can arrive through early raids and turns long beginner routes into manageable loops.", "Test handling and stamina before investing in several saddles.", "Keep the mount in the party only while its travel value exceeds the combat or carrying slot it replaces."] },
      { id: "air", title: "Take access before perfection", bullets: ["An early flying option opens cliffs, tower approaches and safer scouting even without ideal passives.", "Carry enough stamina to land somewhere safe instead of crossing the final stretch while exhausted.", "Activate travel points from the air, then return later for resources with an empty inventory."] },
      { id: "upgrade", title: "Upgrade when a route changes", bullets: ["Compare a mount on the journey you repeat, not in a short flat test.", "Movement traits matter continuously; damage traits matter only when the mount is also your fighter.", "Keep the old saddle loadout until the new mount is captured, crafted and proven useful."] },
    ],
    videos: [earlyGameVideo, featuresVideo],
  }),
  makeGuide({
    slug: "inventory-expedition-prep",
    number: "09",
    category: "Getting Started",
    title: "The Five-Minute Expedition Checklist",
    description: "A repeatable packing routine that prevents broken gear, full inventories and avoidable rescue trips.",
    takeaway: "Leave with one objective, repaired essentials and empty carrying capacity; return before hunger, durability or weight begins deciding the route for you.",
    checklist: ["One written objective", "Repaired gear", "Food and Spheres", "Correct protection", "Empty weight allowance", "Marked return point"],
    sections: [
      { id: "objective", title: "Choose one primary objective", bullets: ["Combine nearby stops only when they fit the same route and loadout.", "A boss trip, mining run and capture session need different inventory space and party roles.", "Mark optional detours, then skip them if the primary goal consumes more supplies than expected."] },
      { id: "pack", title: "Pack for the failure you can prevent", bullets: ["Repair weapons, armor and shields before leaving the base.", "Bring the correct temperature protection and enough ammunition for the full activity.", "Leave decorative materials, duplicate tools and unrelated drops in a departure chest."] },
      { id: "return", title: "Set the return condition early", bullets: ["Return when the objective is complete, not when every slot is full.", "Bank rare materials before attempting an optional fight that could erase the trip.", "Record what ran out first and adjust the next loadout by that specific amount."] },
    ],
    videos: [featuresVideo, combatVideo],
  }),
  makeGuide({
    slug: "capture-control",
    number: "10",
    category: "Pals & Breeding",
    title: "Capture Control Without Accidental Knockouts",
    description: "Lower targets safely, keep pressure controlled and stop losing valuable captures to one extra hit.",
    takeaway: "Separate damage from capture setup: use predictable attacks, recall early and let a capture-focused partner create the final safe throwing window.",
    checklist: ["Several Sphere tiers", "Capture-focused Pal", "Low-damage backup weapon", "Clear dodge space", "Party slot available", "Escape route"],
    sections: [
      { id: "setup", title: "Create a controlled damage phase", bullets: ["Open with your normal damage while the target is healthy.", "Switch to a weaker, predictable option before the health bar reaches the danger zone.", "Recall any Pal with a long animation or delayed projectile before it launches the final hit."] },
      { id: "partner", title: "Use a capture-focused partner", bullets: ["Daedream's current partner behavior is useful for applying pressure without finishing the target.", "Position so you can see both the target and incoming attacks while preparing a throw.", "Do not let an unrelated wild Pal turn a controlled capture into a three-way fight."] },
      { id: "throws", title: "Make every Sphere throw deliberate", bullets: ["Use the Sphere tier that matches the target instead of repeating a clearly weak option.", "Improve the angle and status window before spending the next Sphere.", "If the encounter becomes unsafe, reset distance and health rather than forcing another throw."] },
    ],
    videos: [earlyGameVideo, combatVideo],
  }),
  makeGuide({
    slug: "balanced-party-building",
    number: "11",
    category: "Pals & Breeding",
    title: "Build a Party That Solves More Problems",
    description: "Balance damage, counters, carrying and movement instead of filling every slot with similar attackers.",
    takeaway: "Give each party slot a job: primary fighter, elemental answer, travel utility, capture control and one flexible slot for the current objective.",
    checklist: ["Primary combat Pal", "Elemental counter", "Movement Pal", "Capture utility", "Flexible worker or carrier", "Food for every active Pal"],
    sections: [
      { id: "roles", title: "Assign one job per slot", bullets: ["A role makes it obvious which Pal should enter a fight and which should stay safe.", "Avoid carrying two Pals that solve the same matchup unless the next boss demands it.", "Change the flexible slot before each expedition rather than rebuilding the entire party."] },
      { id: "skills", title: "Check active skills, not just species", bullets: ["A correct element is useful only when the equipped skills can land reliably.", "Mix quick, dependable attacks with one larger cooldown instead of loading three slow moves.", "Keep enough distance and terrain access for the Pal's attack style."] },
      { id: "field-test", title: "Test the team on a real route", bullets: ["Run one normal expedition and note which slot never contributed.", "Replace dead weight with the missing utility: carry, movement, capture or counter damage.", "A team that returns safely with the objective complete is stronger than a paper damage ranking."] },
    ],
    videos: [earlyGameVideo, combatVideo],
  }),
  makeGuide({
    slug: "work-suitability-basics",
    number: "12",
    category: "Pals & Breeding",
    title: "Work Suitability: Pick the Right Worker",
    description: "Read production chains as connected jobs and assign specialists where a missing step blocks the whole base.",
    takeaway: "Choose workers by the job the base is waiting on, then add transport and recovery support so their suitability produces real output.",
    checklist: ["Blocked station identified", "Required suitability", "Food access", "Nearby storage", "Transport coverage", "Recovery space"],
    sections: [
      { id: "bottleneck", title: "Find the station that is waiting", bullets: ["Watch one production cycle and identify whether input, labor or transport stops first.", "Adding another miner does not help a smelter waiting for Kindling.", "Upgrade the missing job before expanding the number of stations."] },
      { id: "specialists", title: "Use specialists on permanent work", bullets: ["Place strong suitability levels on jobs that run all day.", "Use flexible workers for short crafting queues and cleanup tasks.", "Avoid overloading one Pal with several nearby task types if the important station must stay active."] },
      { id: "support", title: "Support the worker, not only the station", bullets: ["Short paths to food and storage protect productive time.", "Beds, hot springs and reliable meals reduce long recovery gaps.", "Transport capacity converts finished work into usable stock instead of ground clutter."] },
    ],
    videos: [baseVideo, resourceVideo],
  }),
  makeGuide({
    slug: "worker-pathing-fixes",
    number: "13",
    category: "Base Building",
    title: "Fix Worker Pathing and Stuck Pals",
    description: "Diagnose narrow stairs, blocked interaction points and long routes before replacing good workers.",
    takeaway: "Observe the exact pause, widen the approach and simplify one route at a time; most pathing problems are layout problems, not worker quality problems.",
    checklist: ["One full work cycle observed", "Clear station front", "Wide straight stairs", "Enough ceiling height", "Nearby food", "Nearby storage"],
    sections: [
      { id: "observe", title: "Find the first failed movement", bullets: ["Watch from the worker spawn point to the station instead of only checking the final error.", "Note turns, doorway edges and item piles where movement changes.", "Move one obstruction at a time so the successful fix is obvious."] },
      { id: "approach", title: "Give stations a clean approach", bullets: ["Keep the working face of each solid station open.", "Allow a full foundation of straight approach before stairs and avoid immediate ninety-degree turns.", "Use taller floors around large workers and machinery."] },
      { id: "routes", title: "Shorten repeated routes", bullets: ["Place food and output storage inside the production cluster.", "Move manual benches away from the high-traffic center.", "If a worker crosses the base after every action, relocate the destination before adding more transporters."] },
    ],
    videos: [baseVideo, stackingVideo],
  }),
  makeGuide({
    slug: "food-and-recovery",
    number: "14",
    category: "Base Building",
    title: "Food, Beds and Recovery That Scale",
    description: "Keep production stable by treating hunger and recovery as part of every work chain.",
    takeaway: "A slightly smaller team with short food routes, enough beds and dependable recovery will outperform a crowded base full of interrupted workers.",
    checklist: ["One bed per active worker", "Stocked feed box", "Reliable food chain", "Hot spring access", "Short walking routes", "Spare food reserve"],
    sections: [
      { id: "baseline", title: "Cover the non-negotiables", bullets: ["Provide a bed for every deployed worker before raising the active count.", "Keep the feed box stocked with a meal the farm can replace reliably.", "Place recovery close enough that using it does not become an expedition."] },
      { id: "food-loop", title: "Build a complete food loop", bullets: ["Cover Planting, Watering and Gathering before adding a second plantation.", "Place food storage near the farm and worker traffic.", "Keep a reserve so one missing worker does not empty the feed box immediately."] },
      { id: "scale", title: "Scale support before labor", bullets: ["Add beds, food throughput and recovery capacity before deploying new workers.", "Watch for repeated hunger trips that interrupt specialist jobs.", "Use a smaller stable team while redesigning a base that cannot support its current population."] },
    ],
    videos: [baseVideo, resourceVideo],
  }),
  makeGuide({
    slug: "vertical-base-layouts",
    number: "15",
    category: "Base Building",
    title: "Vertical Base Layouts That Still Work",
    description: "Use upper floors for low-traffic systems while protecting ground-floor production and worker movement.",
    difficulty: "Intermediate",
    takeaway: "Keep daily work on the ground, give stairs generous approach space and move set-and-forget structures upstairs only after testing access.",
    checklist: ["Wide stairs", "Three-floor machinery clearance", "Open interaction points", "Ground-floor production", "Upper-floor low-traffic jobs", "Pathing test"],
    sections: [
      { id: "zoning", title: "Zone by visit frequency", bullets: ["Keep food, storage and nonstop production on the ground floor.", "Place breeding, expeditions and other low-frequency structures above.", "Do not force every worker upstairs for a resource used several times per minute."] },
      { id: "stairs", title: "Build stairs for large workers", bullets: ["Use a straight, wide approach with no doorway at the first step.", "Provide extra vertical clearance where large Pals turn or enter a floor.", "Test both directions with the largest worker you plan to deploy."] },
      { id: "stacking", title: "Stack with a maintenance plan", bullets: ["Use alignment and temporary supports to keep repeated pieces consistent.", "Stop before a compact stack becomes impossible to inspect or repair.", "Leave a clear interaction side and confirm every level remains reachable after reload."] },
    ],
    videos: [baseVideo, stackingVideo],
  }),
  makeGuide({
    slug: "manual-to-automation",
    number: "16",
    category: "Resources & Crafting",
    title: "From Manual Runs to Full Automation",
    description: "Know when to stop repeating a gathering route and invest in the facility that replaces it.",
    takeaway: "Use manual runs to fund the next permanent facility, then redirect field time toward the resource your base still cannot supply.",
    checklist: ["Current resource deficit", "Dense manual route", "Facility unlock checked", "Qualified workers", "Transport coverage", "Output storage"],
    sections: [
      { id: "measure", title: "Measure the real bottleneck", bullets: ["Track which material stops crafting rather than collecting everything equally.", "Count travel and unloading time as part of a manual route.", "Avoid building automation for a resource already overflowing in storage."] },
      { id: "handoff", title: "Prepare the automation handoff", bullets: ["Check the live Technology tree and material cost before moving a base.", "Recruit the required suitability and transport support in advance.", "Place output storage close enough that the facility can keep cycling."] },
      { id: "redirect", title: "Redirect your field time", bullets: ["Stop routine manual runs once passive output covers ordinary demand.", "Use field trips for sudden crafting spikes and resources without a practical facility.", "Revisit storage limits so automation does not create a new hauling bottleneck."] },
    ],
    videos: [resourceVideo, baseVideo],
  }),
  makeGuide({
    slug: "ranch-production",
    number: "17",
    category: "Resources & Crafting",
    title: "Build a Useful Ranch Production Loop",
    description: "Turn passive drops into dependable stock with the right ranch workers, transport and nearby storage.",
    takeaway: "Choose ranch output based on a recipe you repeatedly craft, then keep the ranch close to storage and supported by enough transport capacity.",
    checklist: ["Target recipe", "Correct ranch Pal", "Open ranch space", "Nearby storage", "Transport worker", "Feed and recovery"],
    sections: [
      { id: "demand", title: "Start from a recipe, not a Pal", bullets: ["Identify the ingredient that repeatedly stops ammunition, Spheres or food production.", "Assign ranch Pals whose output directly answers that shortage.", "Change the ranch roster when the target recipe changes."] },
      { id: "layout", title: "Keep the collection route short", bullets: ["Place storage close to the ranch boundary without blocking access.", "Give transporters a direct route with no stairs or decorative bottlenecks.", "Leave enough open space for each assigned Pal to enter and work consistently."] },
      { id: "audit", title: "Audit output after one cycle", bullets: ["Check whether drops are being created, collected and stored.", "If items remain on the ground, fix transport before adding another ranch worker.", "Compare passive stock against recipe demand before expanding the ranch."] },
    ],
    videos: [resourceVideo, baseVideo],
  }),
  makeGuide({
    slug: "storage-and-logistics",
    number: "18",
    category: "Resources & Crafting",
    title: "Storage and Logistics Without the Mess",
    description: "Place containers where items are created and reduce the crossings that quietly slow every production chain.",
    takeaway: "Storage belongs beside the station that creates or consumes an item; organize by workflow first and labels second.",
    checklist: ["Output container", "Input container", "Short transport route", "Reserved item groups", "Overflow space", "Departure chest"],
    sections: [
      { id: "workflow", title: "Organize by production workflow", bullets: ["Place ore storage between mining and smelting rather than in a distant central warehouse.", "Keep food inputs and cooked output beside the kitchen chain.", "Use a separate departure chest for gear that should never be consumed by base crafting."] },
      { id: "distance", title: "Remove unnecessary crossings", bullets: ["Watch where transporters travel after picking up one item.", "Move the destination closer before adding another worker.", "Avoid placing the most-used container behind stairs, doors or crowded stations."] },
      { id: "overflow", title: "Plan for spikes and overflow", bullets: ["Leave spare slots in high-output containers.", "Split unrelated bulk materials before one type fills every slot.", "Review stock after major crafting sessions so empty categories do not hide a new shortage."] },
    ],
    videos: [resourceVideo, baseVideo],
  }),
  makeGuide({
    slug: "watchtower-region-circuit",
    number: "19",
    category: "Exploration",
    title: "Turn Every Watchtower Into a Region Circuit",
    description: "Reveal the map, group nearby objectives and finish at a travel point instead of wandering between isolated icons.",
    takeaway: "Use the Watchtower as the start of a local circuit: reveal, choose one edge, clear a cluster, mark repeatable value and exit through the travel network.",
    checklist: ["Watchtower located", "Wind-circle access checked", "Mount or grapple", "Free carry space", "Map markers", "Return point"],
    sections: [
      { id: "reveal", title: "Reveal before collecting", bullets: ["Reach the tower first so nearby points of interest become visible.", "Check the wind circle, grapple route or flight path when the top seems inaccessible.", "Choose one edge of the revealed area rather than crossing it diagonally several times."] },
      { id: "cluster", title: "Clear one objective cluster", bullets: ["Combine a Hacking Tower, dungeon and mission only when they share the same local route.", "Mark difficult encounters and repeatable resource nodes for a later specialist trip.", "Skip low-value detours once weight or durability begins threatening the main objective."] },
      { id: "exit", title: "Finish deeper than you started", bullets: ["Activate a travel point at the far side of the circuit.", "Bank materials before attempting an optional boss.", "Use the new point as the departure location for the next regional loop."] },
    ],
    videos: [featuresVideo, missionVideo],
  }),
  makeGuide({
    slug: "dungeon-checklist",
    number: "20",
    category: "Exploration",
    title: "The Dungeon Entry Checklist",
    description: "Decide quickly whether to clear, mark or leave a dungeon while protecting the value of the current trip.",
    takeaway: "Peek once, assess supplies and weight, then either clear deliberately or mark the entrance; entering without room for loot wastes the strongest reason to be there.",
    checklist: ["Repaired weapon", "Ammunition", "Free weight", "Food", "Combat Pal", "Entrance marker"],
    sections: [
      { id: "peek", title: "Check the entrance every time", bullets: ["Some current dungeons may open into a short treasure room, making a quick check worthwhile.", "Mark the entrance even when the route or timer makes a full clear impractical.", "Confirm your return path before moving deep enough to lose orientation."] },
      { id: "clear", title: "Clear with a loot budget", bullets: ["Reserve weight for the reward instead of mining every early node.", "Use a dependable combat Pal and avoid spending rare supplies on ordinary rooms.", "Collect concentrated materials that answer a current crafting need."] },
      { id: "leave", title: "Know when to leave", bullets: ["Exit if durability or ammunition drops below the amount needed for the remaining route.", "Do not risk rare expedition loot on an optional fight with no recovery supplies.", "Record why the clear failed so the next loadout solves one specific problem."] },
    ],
    videos: [featuresVideo, combatVideo],
  }),
  makeGuide({
    slug: "mission-routing",
    number: "21",
    category: "Exploration",
    title: "Route Missions for Better Rewards",
    description: "Combine mission objectives, Hacking Towers and nearby travel points into efficient regional runs.",
    takeaway: "Prioritize missions that unlock or improve your next activity, then group them geographically so every run advances several nearby objectives without overpacking.",
    checklist: ["Reward checked", "Region revealed", "Nearby mission cluster", "Combat requirement", "Free inventory space", "Exit point"],
    sections: [
      { id: "reward", title: "Start with the reward", bullets: ["Choose objectives whose schematics, accessories or gear improve your current progression wall.", "Delay a distant reward that duplicates equipment you already use.", "Check whether a Hacking Tower or dungeon can be included without changing the loadout."] },
      { id: "route", title: "Build a regional route", bullets: ["Reveal the area first and group stops on one side of the map.", "Enter with enough room for mission rewards and nearby materials.", "Activate a travel point near the final stop so the route shortens permanently."] },
      { id: "review", title: "Review the result at base", bullets: ["Equip or test the reward before starting the next mission chain.", "Store mission-specific gear together for repeat attempts.", "Mark unfinished fights with the missing counter, ammunition or protection requirement."] },
    ],
    videos: [missionVideo, featuresVideo],
  }),
  makeGuide({
    slug: "elemental-matchups",
    number: "22",
    category: "Combat",
    title: "Elemental Matchups Without a Tier List",
    description: "Choose counters by encounter, active skills and survivability instead of relying on species rank alone.",
    takeaway: "Bring the right element only after checking that the Pal is trained, its equipped attacks can connect and your player loadout covers the fight's real danger.",
    checklist: ["Enemy element", "Counter element", "Equipped active skills", "Pal level and health", "Second combat option", "Player survival gear"],
    sections: [
      { id: "counter", title: "Start with the encounter", bullets: ["Identify the main enemy element and the attacks that create the most danger.", "Choose a counter that can survive the arena and consistently reach the target.", "Keep a second option in case the primary Pal is knocked out or poorly suited to the terrain."] },
      { id: "skills", title: "Inspect the equipped attacks", bullets: ["A matching species does not help if its current skills are slow or unreliable.", "Use at least one quick attack to maintain pressure between larger cooldowns.", "Test range and tracking on ordinary enemies before entering a timed boss room."] },
      { id: "player", title: "Protect the player side of the plan", bullets: ["Repair armor and shield and remove unnecessary carry weight.", "Stand apart from the Pal so one attack does not hit both targets.", "Recall before a large telegraphed hit, then redeploy from a safer angle."] },
    ],
    videos: [combatVideo, earlyGameVideo],
  }),
  makeGuide({
    slug: "boss-loadout-planner",
    number: "23",
    category: "Combat",
    title: "Build a Repeatable Boss Loadout",
    description: "Prepare one dedicated chest, count a full attempt's supplies and diagnose losses without rebuilding from memory.",
    takeaway: "A repeatable loadout turns every attempt into useful data: if the same supplies enter each time, you can identify whether survival, damage or Pal uptime needs improvement.",
    checklist: ["Dedicated loadout chest", "Repaired armor and shield", "Full ammunition count", "Food and buffs", "Primary counter Pal", "Backup combat Pal"],
    sections: [
      { id: "chest", title: "Create a boss departure chest", bullets: ["Store the weapon, ammunition, protection and food used for that encounter together.", "Keep unrelated gathering tools out of the loadout.", "Restock the chest immediately after an attempt while the missing amounts are obvious."] },
      { id: "attempt", title: "Standardize the attempt", bullets: ["Enter fed, repaired and at the same carrying weight.", "Use the focus-target command so Pal damage begins consistently.", "Follow the same opening position before experimenting with one change at a time."] },
      { id: "diagnose", title: "Classify the failure", bullets: ["Player death points to movement, protection or attention problems.", "Pal death points to level, matchup, skill choice or recall timing.", "Timer failure points to weapon output, ammunition supply or lost attack uptime."] },
    ],
    videos: [combatVideo, earlyGameVideo],
  }),
  makeGuide({
    slug: "advanced-combat-habits",
    number: "24",
    category: "Combat",
    title: "Advanced Combat Habits for the Mid-Game",
    description: "Improve visibility, positioning, capture safety and supply discipline before chasing rarer equipment.",
    difficulty: "Intermediate",
    takeaway: "Mid-game consistency comes from information and rhythm: keep the arena readable, separate player and Pal positions, preserve capture options and leave with supplies for the entire objective.",
    checklist: ["Readable arena", "Clear dodge lane", "Pal recall practiced", "Capture backup", "Food buffs", "Exit supplies"],
    sections: [
      { id: "visibility", title: "Make the fight readable", bullets: ["Move away from visual clutter and keep the enemy, Pal and escape lane in view.", "Avoid fighting against walls that hide telegraphs or trap the camera.", "Use terrain to break dangerous approaches without blocking your own shots."] },
      { id: "rhythm", title: "Build a recall-and-redeploy rhythm", bullets: ["Recall before large predictable attacks rather than after the Pal takes the damage.", "Redeploy from an angle that restores pressure without sharing the player's position.", "Use quick active skills to reduce long periods where the Pal contributes nothing."] },
      { id: "discipline", title: "Protect the objective", bullets: ["Carry capture tools when the route includes a valuable target.", "Use food and protection that address the actual encounter instead of generic bonuses.", "Bank rare rewards before extending the trip into optional fights."] },
    ],
    videos: [combatVideo, missionVideo],
  }),
];

export function getGuide(slug: string) {
  return guides.find((guide) => guide.slug === slug);
}
