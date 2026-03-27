"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

const DEFAULT_CATEGORIES = [
  { name: "Venue & Catering", minPct: 40, maxPct: 50, defaultPct: 45 },
  { name: "Photography & Video", minPct: 10, maxPct: 12, defaultPct: 11 },
  { name: "Flowers & Decor", minPct: 8, maxPct: 10, defaultPct: 9 },
  { name: "Attire & Beauty", minPct: 8, maxPct: 10, defaultPct: 9 },
  { name: "Music & Entertainment", minPct: 5, maxPct: 8, defaultPct: 6 },
  { name: "Stationery & Invitations", minPct: 2, maxPct: 3, defaultPct: 2.5 },
  { name: "Transport", minPct: 2, maxPct: 3, defaultPct: 2.5 },
  { name: "Miscellaneous / Buffer", minPct: 5, maxPct: 10, defaultPct: 7.5 },
];

const STYLE_MULTIPLIERS: Record<string, Record<string, number>> = {
  budget: { "Venue & Catering": 40, "Photography & Video": 10, "Flowers & Decor": 8, "Attire & Beauty": 8, "Music & Entertainment": 5, "Stationery & Invitations": 2, "Transport": 2, "Miscellaneous / Buffer": 10 },
  "mid-range": { "Venue & Catering": 45, "Photography & Video": 11, "Flowers & Decor": 9, "Attire & Beauty": 9, "Music & Entertainment": 6, "Stationery & Invitations": 2.5, "Transport": 2.5, "Miscellaneous / Buffer": 7.5 },
  luxury: { "Venue & Catering": 50, "Photography & Video": 12, "Flowers & Decor": 10, "Attire & Beauty": 10, "Music & Entertainment": 8, "Stationery & Invitations": 3, "Transport": 3, "Miscellaneous / Buffer": 5 },
};

const FAQ_DATA = [
  { q: "How much does the average wedding cost in 2026?", a: "The average wedding in 2026 costs between $30,000 and $35,000 in the United States, though costs vary significantly by location, guest count, and style. Major cities like New York and Los Angeles tend to be 20–40% above the national average." },
  { q: "What percentage of my wedding budget should go to the venue?", a: "Venue and catering typically account for 40–50% of the total wedding budget. This is the largest single expense and includes the ceremony space, reception venue, food, and beverages." },
  { q: "How can I reduce my wedding costs without sacrificing quality?", a: "Consider off-peak dates (weekdays or winter months), limit your guest list, choose in-season flowers, hire a photographer for fewer hours, use digital invitations, and compare at least three vendors for every category." },
  { q: "Should I set aside a contingency fund in my wedding budget?", a: "Yes. We recommend reserving 5–10% of your total budget as a miscellaneous or buffer fund. Unexpected costs almost always arise — last-minute décor changes, weather-related adjustments, or vendor surcharges." },
  { q: "How does guest count affect wedding budget?", a: "Guest count is one of the biggest cost drivers. Each additional guest adds to catering, seating, favours, and stationery costs. On average, expect to spend $100–$300 per guest depending on your wedding style." },
];

const STATE_DATA = [
  { state: "Alabama", avg: 22000, diff: -26 },
  { state: "Alaska", avg: 28000, diff: -7 },
  { state: "Arizona", avg: 29000, diff: -3 },
  { state: "Arkansas", avg: 20000, diff: -33 },
  { state: "California", avg: 42000, diff: +40 },
  { state: "Colorado", avg: 33000, diff: +10 },
  { state: "Connecticut", avg: 38000, diff: +27 },
  { state: "Delaware", avg: 32000, diff: +7 },
  { state: "Florida", avg: 31000, diff: +3 },
  { state: "Georgia", avg: 28000, diff: -7 },
  { state: "Hawaii", avg: 38000, diff: +27 },
  { state: "Idaho", avg: 24000, diff: -20 },
  { state: "Illinois", avg: 35000, diff: +17 },
  { state: "Indiana", avg: 23000, diff: -23 },
  { state: "Iowa", avg: 21000, diff: -30 },
  { state: "Kansas", avg: 22000, diff: -27 },
  { state: "Kentucky", avg: 22000, diff: -27 },
  { state: "Louisiana", avg: 25000, diff: -17 },
  { state: "Maine", avg: 27000, diff: -10 },
  { state: "Maryland", avg: 37000, diff: +23 },
  { state: "Massachusetts", avg: 40000, diff: +33 },
  { state: "Michigan", avg: 26000, diff: -13 },
  { state: "Minnesota", avg: 27000, diff: -10 },
  { state: "Mississippi", avg: 18000, diff: -40 },
  { state: "Missouri", avg: 24000, diff: -20 },
  { state: "Montana", avg: 23000, diff: -23 },
  { state: "Nebraska", avg: 22000, diff: -27 },
  { state: "Nevada", avg: 30000, diff: 0 },
  { state: "New Hampshire", avg: 30000, diff: 0 },
  { state: "New Jersey", avg: 44000, diff: +47 },
  { state: "New Mexico", avg: 22000, diff: -27 },
  { state: "New York", avg: 46000, diff: +53 },
  { state: "North Carolina", avg: 27000, diff: -10 },
  { state: "North Dakota", avg: 20000, diff: -33 },
  { state: "Ohio", avg: 25000, diff: -17 },
  { state: "Oklahoma", avg: 22000, diff: -27 },
  { state: "Oregon", avg: 31000, diff: +3 },
  { state: "Pennsylvania", avg: 34000, diff: +13 },
  { state: "Rhode Island", avg: 35000, diff: +17 },
  { state: "South Carolina", avg: 26000, diff: -13 },
  { state: "South Dakota", avg: 20000, diff: -33 },
  { state: "Tennessee", avg: 26000, diff: -13 },
  { state: "Texas", avg: 27000, diff: -10 },
  { state: "Utah", avg: 24000, diff: -20 },
  { state: "Vermont", avg: 28000, diff: -7 },
  { state: "Virginia", avg: 35000, diff: +17 },
  { state: "Washington", avg: 34000, diff: +13 },
  { state: "West Virginia", avg: 19000, diff: -37 },
  { state: "Wisconsin", avg: 24000, diff: -20 },
  { state: "Wyoming", avg: 22000, diff: -27 },
];

const NATIONAL_AVERAGE = 30000;

export default function WeddingBudgetCalculator() {
  const [budget, setBudget] = useState(30000);
  const [guests, setGuests] = useState(100);
  const [style, setStyle] = useState("mid-range");
  const [overrides, setOverrides] = useState<Record<string, number>>({});

  const categories = useMemo(() => {
    const stylePcts = STYLE_MULTIPLIERS[style];
    return DEFAULT_CATEGORIES.map((cat) => {
      const pct = overrides[cat.name] ?? stylePcts[cat.name] ?? cat.defaultPct;
      const amount = (budget * pct) / 100;
      return { ...cat, pct, amount };
    });
  }, [budget, style, overrides]);

  const totalAllocated = categories.reduce((s, c) => s + c.pct, 0);
  const perGuest = guests > 0 ? budget / guests : 0;

  const handleOverride = (name: string, val: string) => {
    const n = parseFloat(val);
    if (!isNaN(n)) setOverrides((o) => ({ ...o, [name]: n }));
  };

  const handlePrint = () => window.print();

  const handleShare = () => {
    const lines = categories.map((c) => `${c.name}: ${c.pct}% — $${c.amount.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`);
    const text = `Wedding Budget: $${budget.toLocaleString()}\nGuests: ${guests}\nStyle: ${style}\nPer Guest: $${perGuest.toFixed(0)}\n\n${lines.join("\n")}\n\nGenerated at startweddingplanning.com/wedding-budget-calculator`;
    navigator.clipboard.writeText(text).then(() => alert("Budget summary copied to clipboard!"));
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_DATA.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const appSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Free Wedding Budget Calculator",
    url: "https://startweddingplanning.com/wedding-budget-calculator",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "Free wedding budget calculator that generates an instant personalised spending breakdown across 8 categories based on your total budget, guest count, and wedding style.",
  };

  return (
    <>
      <head>
        <title>Free Wedding Budget Calculator (2026) — Plan Your Dream Wedding | Start Wedding Planning</title>
        <meta name="description" content="Use our free wedding budget calculator and wedding budget planner to get an instant personalised spending breakdown. Includes average wedding cost 2026 data by state and guest count." />
        <link rel="canonical" href="https://startweddingplanning.com/wedding-budget-calculator" />
        <meta property="og:title" content="Free Wedding Budget Calculator (2026) — Plan Your Dream Wedding" />
        <meta property="og:description" content="Calculate your wedding budget instantly. Enter your total budget and guest count to get a personalised breakdown by category." />
        <meta property="og:url" content="https://startweddingplanning.com/wedding-budget-calculator" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://startweddingplanning.com/images/calculator/wedding-budget-calculator-og.jpg" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      </head>

      <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6">

        {/* --- Hero Image --- */}
        <figure className="mb-8 overflow-hidden rounded-2xl shadow-md">
          <img
            src="/images/calculator/wedding-budget-calculator-hero.jpg"
            alt="Couple using wedding budget calculator"
            width={1408}
            height={768}
            loading="lazy"
            className="w-full object-cover"
          />
        </figure>

        <h1 className="mb-2 text-3xl font-bold text-rose-900 sm:text-4xl">Free Wedding Budget Calculator (2026)</h1>
        <p className="mb-8 text-lg text-slate-600">Use our free wedding budget planner to get an instant personalised breakdown — enter your details below.</p>

        {/* --- Inputs --- */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="budget" className="mb-1 block text-sm font-semibold text-slate-700">Total Budget ($)</label>
            <input id="budget" type="number" min={0} step={1000} value={budget} onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-200" aria-label="Total wedding budget in dollars" />
          </div>
          <div>
            <label htmlFor="guests" className="mb-1 block text-sm font-semibold text-slate-700">Number of Guests</label>
            <input id="guests" type="number" min={1} max={1000} value={guests} onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-200" aria-label="Number of wedding guests" />
          </div>
          <div>
            <label htmlFor="style" className="mb-1 block text-sm font-semibold text-slate-700">Wedding Style</label>
            <select id="style" value={style} onChange={(e) => { setStyle(e.target.value); setOverrides({}); }}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-200" aria-label="Wedding style">
              <option value="budget">Budget</option>
              <option value="mid-range">Mid-Range</option>
              <option value="luxury">Luxury</option>
            </select>
          </div>
        </div>

        {/* Summary */}
        <div className="mb-6 flex flex-wrap gap-4">
          <div className="rounded-lg bg-rose-50 px-4 py-3">
            <span className="text-sm text-rose-700">Per Guest</span>
            <p className="text-xl font-bold text-rose-900">${perGuest.toFixed(0)}</p>
          </div>
          <div className={`rounded-lg px-4 py-3 ${Math.abs(totalAllocated - 100) < 0.5 ? "bg-green-50" : "bg-red-50"}`}>
            <span className={`text-sm ${Math.abs(totalAllocated - 100) < 0.5 ? "text-green-700" : "text-red-700"}`}>Total Allocated</span>
            <p className={`text-xl font-bold ${Math.abs(totalAllocated - 100) < 0.5 ? "text-green-900" : "text-red-900"}`}>{totalAllocated.toFixed(1)}%</p>
          </div>
        </div>

        {/* --- Category Cards --- */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2" id="calculator-output">
          {categories.map((cat) => {
            const over = cat.pct > cat.maxPct;
            const under = cat.pct < cat.minPct;
            return (
              <div key={cat.name} className={`rounded-xl border p-4 shadow-sm ${over ? "border-red-300 bg-red-50" : under ? "border-green-300 bg-green-50" : "border-slate-200 bg-white"}`}>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-800">{cat.name}</h3>
                  {over && <span className="text-xs font-medium text-red-600">Over recommended</span>}
                  {under && <span className="text-xs font-medium text-green-600">Under recommended</span>}
                </div>
                <p className="text-sm text-slate-500">Recommended: {cat.minPct}–{cat.maxPct}%</p>
                <div className="mt-2 flex items-center gap-3">
                  <label htmlFor={`pct-${cat.name}`} className="sr-only">Percentage for {cat.name}</label>
                  <input id={`pct-${cat.name}`} type="number" min={0} max={100} step={0.5} value={cat.pct}
                    onChange={(e) => handleOverride(cat.name, e.target.value)}
                    className="w-20 rounded border border-slate-300 px-2 py-1 text-sm focus:border-rose-500 focus:outline-none" aria-label={`Percentage for ${cat.name}`} />
                  <span className="text-sm text-slate-500">%</span>
                  <span className="ml-auto text-lg font-bold text-slate-800">${cat.amount.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Buttons */}
        <div className="mb-12 flex flex-wrap gap-3 print:hidden">
          <button onClick={handlePrint} className="rounded-lg bg-rose-700 px-6 py-3 text-base font-bold text-white shadow-md hover:bg-rose-800 focus:outline-none focus:ring-2 focus:ring-rose-300" aria-label="Download and print budget breakdown">📥 Download My Budget Breakdown</button>
          <button onClick={handleShare} className="rounded-lg border border-rose-300 px-5 py-2.5 text-sm font-semibold text-rose-700 hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-200" aria-label="Copy budget summary to clipboard">📋 Share Results</button>
        </div>

        {/* --- SEO Content --- */}
        <section className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-bold text-rose-900">How to Use This Wedding Cost Calculator</h2>
          <p>Planning a wedding is one of the most exciting — and expensive — milestones in life. Our free wedding budget planner and wedding cost calculator takes the guesswork out of allocating your funds. Simply enter your total budget, the number of guests you plan to invite, and select your wedding style (budget, mid-range, or luxury). The calculator instantly generates a recommended spending breakdown across eight major wedding expense categories.</p>
          <p>Each category shows a recommended percentage range based on industry standards. You can override any percentage to match your personal priorities — maybe you want to splurge on photography and save on stationery. The dollar amounts update in real time, and the total allocation indicator shows whether you&apos;re over or under 100%. Cards are colour-coded green if you&apos;re under the recommended range and red if you&apos;re over, making it easy to spot where adjustments are needed.</p>
          <p>Once you&apos;re happy with your breakdown, click the <strong>📥 Download My Budget Breakdown</strong> button to print a clean, formatted copy of your wedding budget planner. This is great for sharing with your partner, parents, or wedding coordinator.</p>

          {/* Cost Breakdown Infographic */}
          <figure className="my-8 overflow-hidden rounded-xl shadow-sm">
            <img
              src="/images/calculator/wedding-budget-breakdown-infographic.jpg"
              alt="Wedding budget percentage breakdown by category infographic"
              width={1408}
              height={768}
              loading="lazy"
              className="w-full object-cover"
            />
            <figcaption className="bg-slate-50 px-4 py-2 text-center text-sm text-slate-500">Average Wedding Budget Breakdown (2026)</figcaption>
          </figure>

          <h2 className="text-2xl font-bold text-rose-900">How Much Does a Wedding Cost in 2026?</h2>
          <p>One of the most common questions couples ask is: <em>how much does a wedding cost?</em> The average wedding cost 2026 in the United States falls between $30,000 and $35,000, though this number varies enormously depending on where you live, how many guests you invite, and the level of luxury you want. Use our wedding cost calculator above to personalise these figures to your situation.</p>
          <p>According to wedding industry surveys, venue and catering alone account for nearly half of the total wedding budget. Guest count plays a massive role — each additional guest can add $100–$300 to your total, depending on your catering style. This is why our wedding budget planner includes a per-guest cost indicator: so you can see the real cost of every name on that invitation list.</p>
          <p>Major metropolitan areas like New York City, Los Angeles, and San Francisco consistently run 20–50% above the national average wedding cost. Meanwhile, couples in the Midwest and South often celebrate beautiful weddings for $20,000–$25,000. The table below breaks down average wedding costs by state so you can benchmark against what couples in your area are actually spending.</p>

          <h2 className="text-2xl font-bold text-rose-900">Tips to Save on Your Wedding Budget</h2>
          <p>For a complete step-by-step guide, check out our <Link href="/how-to-plan-a-wedding-on-a-budget" className="text-rose-700 underline">guide to planning a wedding on a budget</Link>. You might also find our <Link href="/best-wedding-planning-apps" className="text-rose-700 underline">best wedding planning apps</Link> and <Link href="/wedding-planning-checklist" className="text-rose-700 underline">wedding planning checklist</Link> helpful as you work through the process.</p>
          <ul>
            <li><strong>Choose an off-peak date.</strong> Weddings on Fridays, Sundays, or during winter months often come with significant venue discounts.</li>
            <li><strong>Trim the guest list.</strong> This single decision has the biggest impact on your total cost. Be selective and prioritise the people who matter most.</li>
            <li><strong>Use in-season flowers.</strong> Seasonal blooms are cheaper and look better than imported out-of-season arrangements.</li>
            <li><strong>Negotiate with vendors.</strong> Always get at least three quotes and don&apos;t be afraid to ask for package deals or off-peak pricing.</li>
            <li><strong>Go digital for invitations.</strong> Beautiful digital invitations can save hundreds of dollars and are more environmentally friendly.</li>
            <li><strong>Limit the open bar.</strong> Offering beer, wine, and a signature cocktail instead of a full open bar can save thousands.</li>
          </ul>
        </section>

        {/* --- FAQ --- */}
        <section className="mt-12">
          <h2 className="mb-6 text-2xl font-bold text-rose-900">Frequently Asked Questions</h2>
          {FAQ_DATA.map((f, i) => (
            <details key={i} className="mb-3 rounded-lg border border-slate-200 bg-white">
              <summary className="cursor-pointer px-4 py-3 font-semibold text-slate-800 hover:text-rose-700">{f.q}</summary>
              <p className="px-4 pb-4 text-slate-600">{f.a}</p>
            </details>
          ))}
        </section>

        {/* --- State Table --- */}
        <section className="mt-16">
          <h2 className="mb-2 text-2xl font-bold text-rose-900">Average Wedding Cost by State (2026)</h2>
          <p className="mb-4 text-slate-600">How much does a wedding cost in your state? The table below shows the average wedding cost 2026 for all 50 US states compared to the national average of ${NATIONAL_AVERAGE.toLocaleString()}. Use this data alongside our wedding cost calculator to set a realistic budget for your location.</p>

          {/* State Map Infographic */}
          <figure className="mb-6 overflow-hidden rounded-xl shadow-sm">
            <img
              src="/images/calculator/wedding-cost-by-state-map.jpg"
              alt="Wedding costs by US region map showing cost ranges by state"
              width={1408}
              height={768}
              loading="lazy"
              className="w-full object-cover"
            />
            <figcaption className="bg-slate-50 px-4 py-2 text-center text-sm text-slate-500">Wedding Costs Vary Significantly by US Region</figcaption>
          </figure>

          <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-rose-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-rose-900">State</th>
                  <th className="px-4 py-3 text-right font-semibold text-rose-900">Average Cost (2026)</th>
                  <th className="px-4 py-3 text-right font-semibold text-rose-900">vs National Average</th>
                </tr>
              </thead>
              <tbody>
                {STATE_DATA.map((row, i) => (
                  <tr key={row.state} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                    <td className="px-4 py-2.5 font-medium text-slate-800">{row.state}</td>
                    <td className="px-4 py-2.5 text-right text-slate-700">${row.avg.toLocaleString()}</td>
                    <td className={`px-4 py-2.5 text-right font-semibold ${row.diff > 0 ? "text-red-600" : row.diff < 0 ? "text-green-700" : "text-slate-500"}`}>
                      {row.diff > 0 ? `+${row.diff}%` : row.diff < 0 ? `${row.diff}%` : "National avg"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-slate-500">Figures based on 2026 wedding industry data. Actual costs vary by venue, guest count, and vendor selection. Use our wedding budget planner above to personalise these estimates.</p>
        </section>

        {/* --- Guest Count Table --- */}
        <section className="mt-16">
          <h2 className="mb-2 text-2xl font-bold text-rose-900">Average Wedding Cost by Guest Count</h2>
          <p className="mb-6 text-slate-600">Your guest list is one of the most powerful levers in your wedding budget. The table below shows estimated total wedding cost ranges by guest count, assuming a mid-range wedding style. For a personalised figure, use our wedding cost calculator at the top of this page and adjust the guest count.</p>
          <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-rose-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-rose-900">Guest Count</th>
                  <th className="px-4 py-3 text-right font-semibold text-rose-900">Budget Wedding</th>
                  <th className="px-4 py-3 text-right font-semibold text-rose-900">Mid-Range Wedding</th>
                  <th className="px-4 py-3 text-right font-semibold text-rose-900">Luxury Wedding</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { guests: 50, budget: "12,000–18,000", mid: "18,000–25,000", luxury: "35,000–55,000" },
                  { guests: 100, budget: "20,000–28,000", mid: "28,000–38,000", luxury: "55,000–85,000" },
                  { guests: 150, budget: "27,000–36,000", mid: "36,000–50,000", luxury: "75,000–120,000" },
                  { guests: 200, budget: "33,000–44,000", mid: "44,000–62,000", luxury: "95,000–155,000" },
                  { guests: 250, budget: "40,000–54,000", mid: "54,000–76,000", luxury: "120,000–190,000" },
                ].map((row, i) => (
                  <tr key={row.guests} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                    <td className="px-4 py-2.5 font-medium text-slate-800">{row.guests} guests</td>
                    <td className="px-4 py-2.5 text-right text-slate-700">${row.budget}</td>
                    <td className="px-4 py-2.5 text-right text-slate-700">${row.mid}</td>
                    <td className="px-4 py-2.5 text-right text-slate-700">${row.luxury}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-slate-500">Ranges are estimates based on national average wedding cost 2026 data. Costs are higher in major metro areas. Per-guest catering typically runs $85–$250 depending on style and region.</p>
        </section>

        {/* --- How to Cut Costs --- */}
        <section className="mt-16 prose prose-slate max-w-none">
          <h2 className="text-2xl font-bold text-rose-900">How to Cut Wedding Costs Without Sacrificing Quality</h2>

          {/* Cost Saving Tips Image */}
          <figure className="my-6 overflow-hidden rounded-xl shadow-sm not-prose">
            <img
              src="/images/calculator/wedding-cost-saving-tips.jpg"
              alt="8 ways to save money on your wedding infographic"
              width={1408}
              height={768}
              loading="lazy"
              className="w-full object-cover"
            />
            <figcaption className="bg-slate-50 px-4 py-2 text-center text-sm text-slate-500">8 Proven Ways to Save on Your Wedding Budget</figcaption>
          </figure>

          <p>Every couple wants a beautiful, memorable wedding — but that doesn&apos;t have to mean spending $40,000 or more. With smart planning and a few strategic decisions, you can significantly reduce your wedding budget while keeping the experience just as special. Here are eight proven strategies to help you stretch your dollars further. Use our wedding budget planner above to model how each of these changes affects your bottom line.</p>

          <h3 className="text-xl font-bold text-slate-800">1. Choose an Off-Peak Date and Time</h3>
          <p>Venue pricing is heavily influenced by demand. Saturdays in spring and autumn are the most popular — and most expensive — times to get married. A Friday evening or Sunday afternoon wedding can save you 15–30% on venue hire alone. Similarly, winter months (November through February, excluding the holiday weeks) are significantly cheaper in most parts of the country. Some venues offer their lowest rates for daytime ceremonies, so a brunch or lunch reception can unlock major savings without compromising the elegance of your event.</p>

          <h3 className="text-xl font-bold text-slate-800">2. Be Strategic With Your Guest List</h3>
          <p>Nothing affects the average wedding cost more than the number of guests. Every additional person means more catering, another place setting, another chair, another favour, and higher venue minimums. Cutting your guest list from 150 to 100 can realistically save $8,000–$15,000 depending on your market. Be honest about who genuinely matters to you on this day, and resist social pressure to invite extended acquaintances. A smaller, more intimate wedding often creates stronger memories than a large one where the couple barely talks to half the room.</p>

          <h3 className="text-xl font-bold text-slate-800">3. Simplify Your Floral Arrangements</h3>
          <p>Flowers are one of the most visually impactful elements of a wedding — and one of the easiest places to overspend without noticing. The key is to concentrate your floral budget where it gets the most attention: the bridal bouquet, the ceremony arch or altar, and the head table centrepiece. For guest tables, consider alternatives like candles, lanterns, potted plants, or framed prints that guests can take home. Choosing in-season, locally grown flowers rather than imported blooms can cut your floral bill by 30–50%. Ask your florist which flowers are in season on your wedding date for the biggest savings.</p>

          <h3 className="text-xl font-bold text-slate-800">4. Limit Your Photography Hours</h3>
          <p>Wedding photographers typically charge by the hour or by package. Most couples book 8–10 hours of coverage, but in reality the most valuable shots happen in a 5–6 hour window: getting ready, ceremony, portraits, and first dances. Consider booking a talented photographer for 6 hours instead of 8 — you&apos;ll still get all the key moments while saving $500–$1,500. You might also consider hiring a second photographer who is newer to the industry and charges less, while keeping your primary shooter as your lead. Alternatively, set up a DIY photo booth at the reception so guests can capture candid moments themselves.</p>

          <h3 className="text-xl font-bold text-slate-800">5. Rethink the Bar Program</h3>
          <p>A full open bar is one of the most expensive wedding budget line items, and also one of the most flexible. Instead of offering every spirit imaginable, consider a curated bar: beer, wine, and one or two signature cocktails that tie into your wedding theme. Guests appreciate the personal touch, and you&apos;ll spend far less. If your venue allows it, purchasing your own alcohol rather than going through the venue&apos;s beverage package can also result in significant savings. Always check corkage fees before making this decision.</p>

          <h3 className="text-xl font-bold text-slate-800">6. Go Digital With Invitations and Save-the-Dates</h3>
          <p>Traditional printed wedding invitations, with their multiple inserts, envelopes, and calligraphy, can easily cost $500–$2,000 for a 100-guest wedding. Digital invitations through platforms like Paperless Post or Zola can cut that cost to near zero while still looking beautifully designed. If you love the idea of physical invitations, consider a hybrid approach: send printed invites to close family and older relatives, and digital invitations to everyone else. This is also more environmentally responsible — something many couples today care deeply about.</p>

          <h3 className="text-xl font-bold text-slate-800">7. Negotiate and Get Multiple Quotes</h3>
          <p>One of the most overlooked money-saving strategies is simply shopping around. For every vendor category — venue, catering, photography, florals, music — get at least three quotes. Prices for the same service can vary by 40–60% depending on the vendor. Once you have multiple quotes, use them as negotiating leverage. Ask vendors if they can match or beat a competitor&apos;s price, or offer additional services to win your business. Many vendors, particularly for off-peak dates, will negotiate. Never accept the first price you&apos;re quoted.</p>

          <h3 className="text-xl font-bold text-slate-800">8. Prioritise Your Must-Haves and Cut Everything Else</h3>
          <p>The most important budgeting strategy is also the simplest: decide as a couple what matters most to you, allocate the bulk of your budget to those items, and cut ruthlessly everywhere else. Maybe incredible food and photography are non-negotiable for you, but you don&apos;t care about a fancy cake or expensive favours. That&apos;s a completely valid approach — and it&apos;s one that our wedding budget planner is specifically designed to support. Use the category override feature in the calculator above to increase the percentages for your priorities and decrease them for the things you care less about. Your budget, your rules.</p>
        </section>

        {/* --- Timeline --- */}
        <section className="mt-16 prose prose-slate max-w-none">
          <h2 className="text-2xl font-bold text-rose-900">Wedding Budget Timeline: When to Book and Pay</h2>

          {/* Timeline Infographic */}
          <figure className="my-6 overflow-hidden rounded-xl shadow-sm not-prose">
            <img
              src="/images/calculator/wedding-budget-timeline-infographic.jpg"
              alt="Wedding planning and payment timeline from 12 months to 1 month before the wedding"
              width={1376}
              height={768}
              loading="lazy"
              className="w-full object-cover"
            />
            <figcaption className="bg-slate-50 px-4 py-2 text-center text-sm text-slate-500">Wedding Planning Timeline: Key Booking and Payment Milestones</figcaption>
          </figure>

          <p>Managing your wedding budget isn&apos;t just about how much to spend — it&apos;s about when to spend it. Wedding vendors have their own booking windows and payment schedules, and understanding these timelines helps you avoid last-minute cash crunches. Here&apos;s a month-by-month wedding budget timeline to keep you on track from engagement to wedding day.</p>

          <h3 className="text-xl font-bold text-slate-800">12 Months Out — Set Your Budget and Book Your Venue</h3>
          <p>This is when the big decisions happen. Use our wedding cost calculator to establish your total budget and rough category allocations. Research venues in your area and understand the pricing landscape. Most popular venues book out 12–18 months in advance, so if you have your heart set on a specific location, move quickly. Expect to pay a 20–50% deposit to secure your date. Also book your photographer and videographer at this stage — the best ones fill up fast.</p>

          <h3 className="text-xl font-bold text-slate-800">10–11 Months Out — Book Catering and Key Vendors</h3>
          <p>If your venue doesn&apos;t include catering, now is the time to start interviewing caterers. Get detailed quotes and understand exactly what&apos;s included in per-head pricing (staffing, rentals, cake cutting fees, corkage, etc.). Book your florist and officiant. Start dress shopping if you haven&apos;t already — bridal gowns often require 4–6 months for ordering and alterations.</p>

          <h3 className="text-xl font-bold text-slate-800">8–9 Months Out — Music, Hair, and Décor</h3>
          <p>Book your band or DJ. Good wedding bands are often booked a year or more in advance, while DJs are generally more available. Begin sourcing décor items — if you&apos;re DIYing elements like centrepieces or signage, start buying materials early to spread the cost. Book your hair and makeup artists. Discuss preliminary floral arrangements with your florist and get a detailed quote.</p>

          <h3 className="text-xl font-bold text-slate-800">6–7 Months Out — Invitations and Transportation</h3>
          <p>Order or design your wedding invitations so they&apos;re ready to send at 6–8 weeks before the wedding. Book your wedding transport — limousines, vintage cars, or shuttle buses for guests fill up quickly for popular dates. If you&apos;re hiring a wedding planner or day-of coordinator, confirm all details and ensure they have a full timeline. Finalise your wedding cake with a bakery and taste-test options.</p>

          <h3 className="text-xl font-bold text-slate-800">4–5 Months Out — Guest List Confirmations</h3>
          <p>At this stage, your guest list should be nearly finalised. This matters for your budget because final catering quotes and seating plans are based on confirmed numbers. Begin paying vendor balances as they come due. Send save-the-dates if you haven&apos;t already. Purchase wedding rings. Finalise your honeymoon bookings and confirm travel insurance.</p>

          <h3 className="text-xl font-bold text-slate-800">2–3 Months Out — Final Vendor Payments</h3>
          <p>Most vendors require final payment 30–60 days before the wedding. Review every contract and understand the payment schedule. This is typically when your cash outflow peaks — make sure your savings plan accounts for this. Confirm every vendor booking with a formal written confirmation. Send wedding invitations if you haven&apos;t already (6–8 weeks before is standard). Organise rehearsal dinner logistics.</p>

          <h3 className="text-xl font-bold text-slate-800">1 Month Out — Final Details and Buffer</h3>
          <p>This is when you should lean on your contingency fund. Unexpected expenses almost always arise in the final month — last-minute table linen upgrades, extra shuttle runs, alterations, or tips for vendors. Make sure you have 5–10% of your total budget liquid and available. Confirm final headcounts with your caterer and venue. Pay any remaining balances. Prepare vendor gratuities in labelled envelopes. Take a breath — the hard work is done.</p>
        </section>
      </article>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          header, footer, nav, .print\\:hidden { display: none !important; }
          article { max-width: 100% !important; padding: 1cm !important; }
          #calculator-output { page-break-inside: avoid; }
          h2, h3 { page-break-after: avoid; }
          details { display: block !important; }
          details summary::after { content: none !important; }
          table { page-break-inside: auto; }
          tr { page-break-inside: avoid; page-break-after: auto; }
        }
      `}</style>
    </>
  );
}
