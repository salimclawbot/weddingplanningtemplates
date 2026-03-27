import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-rose-100 bg-rose-50/40">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 text-sm text-slate-700 sm:px-6 md:grid-cols-3">
        <div>
          <h3 className="font-semibold text-slate-900">Start Wedding Planning</h3>
          <p className="mt-2">Expert wedding planning guides, budget templates, and organiser tools for your perfect day.</p>
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">Guides</h3>
          <ul className="mt-2 space-y-1">
            <li><Link href="/wedding-budget-template-2026" className="hover:text-rose-700">Wedding Budget</Link></li>
            <li><Link href="/how-to-plan-a-wedding-on-a-budget" className="hover:text-rose-700">Plan on Budget</Link></li>
            <li><Link href="/best-wedding-planning-spreadsheet" className="hover:text-rose-700">Spreadsheet</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">Contact</h3>
          <p className="mt-2">hello@startweddingplanning.com</p>
          <ul className="mt-2 space-y-1">
            <li><Link href="/privacy" className="hover:text-rose-700">Privacy Policy</Link></li>
            <li><Link href="/affiliate-disclosure" className="hover:text-rose-700">Affiliate Disclosure</Link></li>
            <li><Link href="/about" className="hover:text-rose-700">About</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-rose-100 py-4 text-center text-xs text-slate-500">© {new Date().getFullYear()} Start Wedding Planning</div>
    </footer>
  );
}
