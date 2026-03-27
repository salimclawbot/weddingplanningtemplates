import type { Metadata } from "next";
import Link from "next/link";
import { getAllSlugs, getArticle } from "@/lib/articles";

const products = [
  {
    name: "Wedding Budget Spreadsheet",
    price: "$17",
    href: "/products/wedding-budget-spreadsheet",
    description:
      "Track every cost across 15 categories with auto-totals and vendor comparison.",
  },
  {
    name: "Complete Wedding Planning Tracker",
    price: "$27",
    href: "/products/wedding-planning-tracker",
    description:
      "12-month countdown with 247 tasks, vendor contacts, and weekly check-ins.",
  },
  {
    name: "Notion Wedding Planner",
    price: "$37",
    href: "/products/notion-wedding-planner",
    description:
      "Full Notion workspace: guest list, RSVP, vendor hub, mood board, budget all-in-one.",
  },
  {
    name: "Guest List & Seating Kit",
    price: "$9",
    href: "/products/guest-seating-kit",
    description:
      "Track up to 300 guests with dietary needs, plus-ones, and table assignments.",
  },
] as const;

export const metadata: Metadata = {
  title: "Start Wedding Planning — Complete Guides, Checklists & Budgeting",
  description:
    "Your complete wedding planning resource. Free checklists, budget templates, venue guides and photographer tips to plan your perfect wedding.",
  alternates: { canonical: "https://startweddingplanning.com" },
};

export default async function HomePage() {
  const articles = (await Promise.all(getAllSlugs().map((slug) => getArticle(slug)))).filter(Boolean);

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6"><img src="/images/wedding/wedding-planning-spreadsheet-hero.jpg" alt="Wedding planning spreadsheets trackers and Notion templates 2026" style={{width:"100%",maxHeight:"380px",objectFit:"cover",borderRadius:"12px",marginBottom:"1.5rem"}} />
      <section className="rounded-3xl bg-gradient-to-br from-rose-50 via-white to-pink-50 p-8 sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-600">
          Used by 2,000+ couples planning their perfect day
        </p>
        <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Start Wedding Planning
        </h1>
        <p className="mt-6 max-w-3xl text-xl leading-8 text-slate-600">
          Everything organised. Nothing forgotten. Your wedding, perfectly planned.
        </p>
      </section>

      <section className="mt-12">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-600">Products</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">Our Wedding Planning Templates</h2>
          </div>
          <Link href="/products" className="text-sm font-semibold text-pink-600 hover:text-pink-700">
            Browse all products →
          </Link>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <article
              key={product.href}
              className="flex h-full flex-col rounded-3xl border border-[#ec4899]/20 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-xl font-semibold text-slate-900">{product.name}</h3>
                <span className="rounded-full bg-[#ec4899]/10 px-3 py-1 text-sm font-semibold text-[#ec4899]">
                  {product.price}
                </span>
              </div>
              <p className="mt-4 flex-1 text-sm leading-6 text-slate-600">{product.description}</p>
              <Link href={product.href} className="mt-6 text-sm font-semibold text-[#ec4899]">
                Get it →
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Articles</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">Free planning advice for budgets, guests, and timelines</h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Start with the guides below if you want practical tips before choosing a template. Each article is built to
            help you plan with more clarity and less last-minute scrambling.
          </p>
        </div>
        <div className="mt-8 grid gap-6">
          {articles.map(
            (article) =>
              article && (
                <Link
                  key={article.slug}
                  href={`/${article.slug}`}
                  className="block rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-pink-400 hover:shadow-md"
                >
                  <h3 className="text-xl font-semibold text-slate-900">{article.title}</h3>
                  <p className="mt-2 text-slate-600">{article.description}</p>
                  <span className="mt-4 inline-block text-sm font-medium text-pink-600">Read guide →</span>
                </Link>
              ),
          )}
        </div>
      </section>
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {"@type":"Question","name":"How do I start planning a wedding?","acceptedAnswer":{"@type":"Answer","text":"Start wedding planning by setting your budget, choosing a date range, and estimating your guest list. These three decisions determine everything else. Book your venue and photographer first — they book out 12-18 months in advance."}},
            {"@type":"Question","name":"How much should a wedding budget be?","acceptedAnswer":{"@type":"Answer","text":"The average Australian wedding costs $36,000, while the US average is $33,000. However, beautiful weddings can be done for $10,000-$15,000 with smart prioritisation. Our free wedding budget template helps you allocate costs across all categories."}},
            {"@type":"Question","name":"What is the best wedding planning app or spreadsheet?","acceptedAnswer":{"@type":"Answer","text":"Our top wedding planning tools for 2026 are Zola (free app with checklist and budget tracker), Google Sheets with our free wedding budget template, and Trello for managing vendor communications and task lists."}}
          ]
        })}}
      />
      </main>
  );
}
