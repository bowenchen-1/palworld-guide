import { createPageMetadata } from "../lib/seo";
import PaldexPageContent from "./paldex-page-content";

export const metadata = createPageMetadata({
  title: "Palworld Paldeck Database (1.0) | Field Guide",
  description: "Search the Palworld Paldeck database for version 1.0. Filter 289 Pals by work suitability and compare current breeding power values in one current index.",
  keywords: ["palworld paldeck"],
  path: "/paldex",
});

export default function PaldexPage() {
  return <PaldexPageContent />;
}
