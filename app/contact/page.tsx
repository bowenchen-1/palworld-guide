import type { Metadata } from "next";
import LegalPage from "../components/legal-page";
import { createLegalMetadata } from "../lib/legal-metadata";

export const metadata: Metadata = createLegalMetadata(
  "Contact Palworld Guide",
  "Contact the independent Palworld Guide developer about corrections, privacy questions, rights concerns, or site feedback.",
  "/contact",
);

export default function ContactPage() {
  return <LegalPage
    title="Contact"
    intro={<>For corrections, privacy questions, rights concerns, or general feedback, email <a className="text-link underline" href="mailto:contact@palworldguide.net">contact@palworldguide.net</a>.</>}
    sections={[
      { title: "How to reach us", paragraphs: [<>Email <a className="text-link underline" href="mailto:contact@palworldguide.net">contact@palworldguide.net</a> with the page URL, a short description of the issue, and any relevant version or Pal name. There is no account or form to create, and you do not need to submit personal information beyond what is needed to reply.</>] },
      { title: "What to expect", paragraphs: [<>This is a small independent project. We aim to reply within 5 business days. A reply may take longer when an issue requires checking the game version, breeding data, or a third-party service.</>] },
      { title: "Corrections and privacy requests", paragraphs: [<>For a data correction, please include the exact page and the expected value. For a privacy request, please identify the right you want to exercise and the email address we can use to respond. We may ask for reasonable verification before handling a request.</>] },
    ]}
  />;
}
