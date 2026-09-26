import type { Metadata } from "next";
import LegalPage from "../components/legal-page";
import { createLegalMetadata } from "../lib/legal-metadata";

export const metadata: Metadata = createLegalMetadata(
  "Privacy Policy | Palworld Guide",
  "Learn what Palworld Guide collects, how analytics and advertising cookies are used, and how to contact us about privacy rights.",
  "/privacy",
);

export default function PrivacyPage() {
  return <LegalPage
    title="Privacy Policy"
    intro="This policy explains how Palworld Guide handles information when you visit palworldguide.net."
    sections={[
      { title: "Information we collect", paragraphs: [<>We may receive standard server logs such as your IP address, browser type, device information, request time, referring page, and the pages or files requested. These logs help us keep the site secure, diagnose errors, and understand basic site performance.</>, <>We may use cookies and similar technologies. Google Analytics 4 (GA4) may collect usage and device information, such as pages viewed, approximate location, traffic source, and interactions with the site. We use this information in aggregate to understand how the site is used and improve its content. Your browser may allow you to block or delete cookies.</>] },
      { title: "Google AdSense and third-party advertising", paragraphs: [<>If advertising is enabled, third-party vendors, including Google, may use cookies to serve ads based on a user&apos;s prior visits to this site and other websites. Google may use the DoubleClick DART cookie to help serve advertising based on a user&apos;s visits to this site and other sites on the internet.</>, <>You can manage or turn off personalized advertising through <a className="text-link underline" href="https://adssettings.google.com/" rel="noreferrer">Google&apos;s Ads Settings</a>. You can also visit <a className="text-link underline" href="https://aboutads.info/" rel="noreferrer">aboutads.info</a> to learn about and opt out of some third-party vendors&apos; use of cookies for personalized advertising. Other advertising partners may publish their own privacy policies and opt-out instructions.</>] },
      { title: "Your privacy rights", paragraphs: [<>Depending on where you live, you may have rights under privacy laws such as the GDPR in the European Union or the CCPA/CPRA in California. These may include the right to request access to personal information, correction of inaccurate information, deletion, a copy of information, restriction or objection to certain processing, and information about the categories of information collected or disclosed. California residents may also have rights to opt out of the sale or sharing of personal information where those terms apply.</>, <>To exercise a privacy right or ask a question, email <a className="text-link underline" href="mailto:contact@palworldguide.net">contact@palworldguide.net</a>. Please include enough detail for us to understand your request. We may need to verify your identity before completing a request. We will respond within the time required by applicable law.</>] },
      { title: "Children&apos;s privacy", paragraphs: [<>Palworld Guide is not directed to children under 13, and we do not knowingly collect personal information from children under 13. If you believe a child has provided personal information, contact us so we can review and delete it where appropriate.</>] },
      { title: "Data security and retention", paragraphs: [<>We use reasonable administrative and technical measures to protect information under our control. No online service can guarantee absolute security. We retain logs and analytics information only for as long as reasonably necessary for security, operations, reporting, or legal obligations.</>] },
      { title: "Changes and contact", paragraphs: [<>We may update this policy when our site, analytics, advertising, or legal obligations change. The date at the top of this page identifies the latest revision. Questions about this policy can be sent to <a className="text-link underline" href="mailto:contact@palworldguide.net">contact@palworldguide.net</a>.</>] },
    ]}
  />;
}
