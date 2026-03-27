import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface PageProps {
  params: { slug: string };
}

const products = {
  "wedding-budget-spreadsheet": {
    slug: "wedding-budget-spreadsheet",
    title: "Wedding Budget Spreadsheet",
    price: "$17",
    description:
      "Track every cost across 15 categories with auto-totals and vendor comparison.",
    features: [
      "15 budget categories with built-in totals",
      "Vendor comparison columns for easy decisions",
      "Payment due dates and deposit tracking",
      "Actual vs planned spend at a glance",
      "Simple setup you can start using immediately",
    ],
  },
  "wedding-planning-tracker": {
    slug: "wedding-planning-tracker",
    title: "Complete Wedding Planning Tracker",
    price: "$27",
    description:
      "12-month countdown with 247 tasks, vendor contacts, and weekly check-ins.",
    features: [
      "247 tasks mapped across a 12-month timeline",
      "Weekly check-ins to keep momentum visible",
      "Vendor contact database in one place",
      "Planning milestones by month and category",
      "Built for couples juggling work and wedding admin",
    ],
  },
  "notion-wedding-planner": {
    slug: "notion-wedding-planner",
    title: "Notion Wedding Planner",
    price: "$37",
    description:
      "Full Notion workspace: guest list, RSVP, vendor hub, mood board, budget all-in-one.",
    features: [
      "Guest list and RSVP dashboards",
      "Vendor hub with notes and key dates",
      "Mood board pages for inspiration and planning",
      "Budget tracking inside the same workspace",
      "Connected system for planning everything together",
    ],
  },
  "guest-seating-kit": {
    slug: "guest-seating-kit",
    title: "Guest List & Seating Kit",
    price: "$9",
    description:
      "Track up to 300 guests with dietary needs, plus-ones, and table assignments.",
    features: [
      "Guest tracking for up to 300 people",
      "Dietary notes and plus-one management",
      "Table assignment and seating overview",
      "RSVP status columns for quick filtering",
      "Clean format for printing or sharing",
    ],
  },
} as const;

export function generateStaticParams() {
  return Object.values(products).map((product) => ({ slug: product.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const product = products[params.slug as keyof typeof products];

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: `${product.title} | Wedding Planning Templates`,
    description: product.description,
    alternates: { canonical: `https://startweddingplanning.com/products/${product.slug}` },
  };
}

export default function ProductPage({ params }: PageProps) {
  const product = products[params.slug as keyof typeof products];

  if (!product) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <section className="rounded-3xl border border-[#ec4899]/20 bg-white p-8 shadow-sm sm:p-10">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">{product.title}</h1>
        <p className="mt-4 text-2xl font-semibold text-[#ec4899]">{product.price}</p>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">{product.description}</p>
        <ul className="mt-8 space-y-3 text-slate-700">
          {product.features.map((feature) => (
            <li key={feature} className="flex items-start gap-3">
              <span className="text-[#ec4899]">✓</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <a
          href="#buy"
          className="mt-8 inline-flex rounded-xl bg-[#ec4899] px-6 py-3 text-sm font-semibold text-white"
        >
          Buy Now
        </a>
      </section>
    </main>
  );
}
