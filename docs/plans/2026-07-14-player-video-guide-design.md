# Player-Video Guide Research Design

## Goal

Rewrite the six Palworld guide pages so their practical advice is distilled from current, non-official creator videos instead of official pages or game wikis.

## Chosen approach

Keep every existing guide slug and the current article layout, but replace the generic `sources` field with structured `videoResearch` entries. Each entry records a specific video title, creator, publication date, YouTube URL, and the part of the article it informed. The article footer becomes a visible “Video research” section that explains the editorial method and links directly to the original creators.

The copy will be independently written in English. Video claims will be treated as player-tested recommendations rather than universal rules. Patch-sensitive statements will use cautious language, and tactics affected by world settings will be labelled as such. No official Palworld URLs, Steam announcements, or wiki links will remain in the guide data.

## Content map

- First seven days: RageGamingVideos early-game route and KhrazeGaming’s 1.0 mistakes overview.
- Early Pals: RageGamingVideos’ starter picks, supported by KhrazeGaming’s system overview.
- Exploration: KhrazeGaming’s watchtower and region notes plus Verlisify’s mission-and-reward route.
- Base building: Chaos Bear Gaming’s 1.0 base tour and stacking method.
- Resources: RageGamingVideos’ 1.0 farming route plus Chaos Bear Gaming’s compact-layout advice.
- First tower boss: RageGamingVideos’ Ground-type starter preparation plus Azrial’s targeting and capture-safety combat tips.

## Presentation and testing

The video cards will show creator, date, topic, and a direct “Watch on YouTube” action. Tests will reject official and wiki URLs, require at least one YouTube video per guide, and verify the new research label. The site will then be checked with the Node test suite, lint, and a production Next.js build.
