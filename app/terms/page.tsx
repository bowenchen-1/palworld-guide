import type { Metadata } from "next";
import LegalPage from "../components/legal-page";
import { createLegalMetadata } from "../lib/legal-metadata";

export const metadata: Metadata = createLegalMetadata(
  "Terms of Use | Palworld Guide",
  "Read the Palworld Guide terms of use, fan-site disclaimer, data disclaimer, and rules for using this independent resource.",
  "/terms",
);

export default function TermsPage() {
  return <LegalPage
    title="Terms of Use"
    intro="By using Palworld Guide, you agree to use this independent fan resource responsibly and understand its limitations."
    sections={[
      { title: "Independent fan site", paragraphs: [<>Palworld Guide is an independent, unofficial fan site. It is not affiliated with, authorized by, endorsed by, or sponsored by Pocketpair, Inc. Palworld and related names, images, and materials are owned by Pocketpair and their respective rights holders. This site does not claim ownership of those materials.</>] },
      { title: "Information and disclaimer", paragraphs: [<>The site, its pages, calculator, Pal data, breeding combinations, maps, guides, and other tools are provided “as is” and “as available.” We do not guarantee that information is complete, accurate, current, or suitable for a particular purpose. Breeding data is based on the Palworld 1.0 version and may become outdated after a game update.</>, <>To the fullest extent permitted by law, Palworld Guide is not responsible for loss, damage, missed progress, wasted resources, or other consequences arising from reliance on the site. Verify important information in the game and use your own judgment.</>] },
      { title: "Acceptable use", bullets: [<>Use the site only for lawful purposes and in a way that does not disrupt, overload, damage, or attempt to gain unauthorized access to the site or its services.</>, <>Do not scrape, copy, republish, frame, mirror, or commercially redistribute substantial portions of the site without permission, except where a law or license expressly allows it.</>, <>Do not use the site to upload or distribute malware, unlawful material, misleading claims, or content that infringes another person&apos;s rights.</>] },
      { title: "Content and intellectual property", paragraphs: [<>Original text, code, layout, and site organization belong to Palworld Guide or their respective contributors unless stated otherwise. Third-party names, trademarks, game assets, and other materials remain with their owners. If you believe content on this site infringes your rights, contact us at <a className="text-link underline" href="mailto:contact@palworldguide.net">contact@palworldguide.net</a>.</>] },
      { title: "Third-party links and services", paragraphs: [<>The site may link to third-party websites, analytics services, advertising providers, or other resources. We do not control or guarantee those services and are not responsible for their content, availability, privacy practices, or terms. Your use of a third-party service is governed by that service&apos;s own terms.</>] },
      { title: "Changes to these terms", paragraphs: [<>We may change these terms when the site or its legal requirements change. The updated version will be posted on this page with a new “Last updated” date. Continuing to use the site after an update means you accept the revised terms.</>] },
    ]}
  />;
}
