import Link from "next/link";
import SiteHeader from "../components/site-header";
import { createBreadcrumbSchema, createPageMetadata } from "../lib/seo";
import { guideCategories, guides } from "./guide-data";

export const metadata = createPageMetadata({
  title: "Palworld Guides — 24 Player-Researched 1.0 Articles",
  description:
    "Browse 24 English Palworld guides for version 1.0, organized by getting started, breeding, bases, resources, exploration, and combat, with practical routes.",
  keywords: ["palworld guides"],
  path: "/guides",
});

export default function GuidesIndexPage() {
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Guides", path: "/guides" },
  ]);
  return (
    <main id="main-content" className="hub-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="database-header">
        <SiteHeader current="/guides" />
      </div>
      <section className="hub-hero guides-hub-hero">
        <p className="database-eyebrow">24 complete English articles</p>
        <h1>Palworld Guides</h1>
        <p>
          Player-researched routes and practical checklists for version 1.0.
          Choose a system below instead of scanning one oversized homepage.
        </p>
      </section>
      <section className="guides-index-content">
        <div className="category-jump-grid">
          {guideCategories.map((category) => (
            <a
              key={category.id}
              href={`#category-${category.id}`}
              className="category-jump"
              style={
                {
                  "--category-accent": category.accent,
                  "--category-soft": category.soft,
                } as React.CSSProperties
              }
            >
              <span>{category.icon}</span>
              <div>
                <strong>{category.name}</strong>
                <small>
                  {
                    guides.filter((guide) => guide.category === category.name)
                      .length
                  }{" "}
                  guides
                </small>
              </div>
              <b>↓</b>
            </a>
          ))}
        </div>
        <div className="category-shelves">
          {guideCategories.map((category) => {
            const categoryGuides = guides.filter(
              (guide) => guide.category === category.name,
            );
            return (
              <section
                id={`category-${category.id}`}
                key={category.id}
                className="category-shelf scroll-mt-24"
                style={
                  {
                    "--category-accent": category.accent,
                    "--category-soft": category.soft,
                  } as React.CSSProperties
                }
              >
                <div className="category-shelf-intro">
                  <span>{category.icon}</span>
                  <p>Category</p>
                  <h2>{category.name}</h2>
                  <div>{category.description}</div>
                </div>
                <div className="category-guide-list">
                  {categoryGuides.map((guide) => (
                    <Link
                      key={guide.slug}
                      href={`/guides/${guide.slug}`}
                      className="category-guide-row"
                    >
                      <span>{guide.number}</span>
                      <div>
                        <strong>{guide.title}</strong>
                        <small>{guide.description}</small>
                      </div>
                      <b>{guide.readTime} →</b>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </section>
      <footer className="database-footer">
        <span>
          24 guides · six categories · researched from creator videos.
        </span>
        <Link href="/tools">Open Palworld tools →</Link>
      </footer>
    </main>
  );
}
