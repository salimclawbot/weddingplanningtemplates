export interface Product {
  slug: string;
  name: string;
  price: number;
  description: string;
  features: string[];
}

export const products: Product[] = [
  {
    slug: "wedding-budget-spreadsheet",
    name: "Wedding Budget Spreadsheet",
    price: 17,
    description:
      "Track every cost across 15 categories. Includes vendor comparison tabs, payment schedule, and hidden cost alerts.",
    features: ["15 budget categories", "Payment tracker", "Vendor comparison", "Auto-totals"],
  },
  {
    slug: "wedding-planning-tracker",
    name: "Complete Wedding Planning Tracker",
    price: 27,
    description:
      "12-month countdown system with 247 tasks, vendor contacts, and weekly check-in prompts.",
    features: ["12-month timeline", "247 tasks", "Vendor tracker", "Weekly prompts"],
  },
  {
    slug: "notion-wedding-planner",
    name: "Notion Wedding Planner Template",
    price: 37,
    description:
      "Full Notion workspace for couples. Guest list, RSVP tracker, vendor hub, mood board, and budget dashboard all in one.",
    features: ["Guest + RSVP tracker", "Vendor hub", "Mood board", "Budget dashboard"],
  },
  {
    slug: "guest-seating-kit",
    name: "Guest List & Seating Chart Kit",
    price: 9,
    description:
      "Spreadsheet + visual seating planner for up to 300 guests. Includes dietary/plus-one tracking.",
    features: ["Up to 300 guests", "Dietary tracking", "Plus-one manager", "Table layout planner"],
  },
];

export function getProduct(slug: string): Product | null {
  return products.find((product) => product.slug === slug) ?? null;
}
