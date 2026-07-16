import { permanentRedirect } from "next/navigation";

export default function LegacyPaldexPage() {
  permanentRedirect("/pals");
}
