import type { Metadata } from "next";
import Link from "next/link";

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
  title: "Our Wedding Planning Templates & Spreadsheets",
  description:
    "Shop wedding planning spreadsheets, trackers, seating kits, and Notion templates for couples who want everything organised in one place.",
  alternates: { canonical: "https://startweddingplanning.com/products" },
};

export default function ProductsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <section>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Our Wedding Planning Templates & Spreadsheets
        </h1>
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <article
              key={product.href}
              className="flex h-full flex-col rounded-3xl border border-[#ec4899]/20 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-xl font-semibold text-slate-900">{product.name}</h2>
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
    </main>
  );
}
