import type { Metadata } from "next";
import LegalPage from "../components/legal-page";
import { createLegalMetadata } from "../lib/legal-metadata";

export const metadata: Metadata = createLegalMetadata(
  "About Palworld Guide",
  "Learn who builds Palworld Guide, why it exists, how its Palworld 1.0 data is checked, and how to report an error.",
  "/about",
);

export default function AboutPage() {
  return <LegalPage
    title="About Palworld Guide"
    intro="A transparent, independent resource for players who want practical Palworld 1.0 data in one place."
    sections={[
      { title: "Who makes this site", paragraphs: [<>Palworld Guide is built and maintained by an independent developer. The project is a small, focused effort to make Palworld data easier to search, compare, and use while planning a play session.</>] },
      { title: "Why it exists", paragraphs: [<>After the Palworld 1.0 update, older breeding tables and spreadsheets no longer matched the current game. Reliable, easy-to-search information was difficult to find, so this site was created to bring the current breeding matrix and Pal reference data together in a practical interface.</>] },
      { title: "Data sources and method", paragraphs: [<>The current reference set includes a 300-record breeding combination matrix for Palworld 1.0 and a 299-entry Pal index. The data is organized from game-version reference material and manually checked for consistency before being published. The calculator uses the same current data context as the Pal profiles, while maps and guide pages provide additional planning context.</>, <>The site is a reference aid, not an official game database. Values and combinations can change when the game changes, and some details may require another review.</>] },
      { title: "Updates and corrections", paragraphs: [<>We review the project when the game version changes and update the data when a new version requires it. If you find an incorrect name, combination, link, or explanation, please send the details to <a className="text-link underline" href="/contact">the contact page</a>. Specific examples and the page URL make corrections easier to investigate.</>] },
      { title: "Independent fan site", paragraphs: [<>Palworld Guide is an unofficial fan site and is not affiliated with, authorized by, endorsed by, or sponsored by Pocketpair, Inc.</>] },
    ]}
  />;
}
