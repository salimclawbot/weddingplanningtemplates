"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-rose-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="text-xl font-bold text-rose-800">Start Wedding Planning</Link>
        <nav className="hidden gap-6 text-sm font-medium text-slate-700 md:flex">
          <Link href="/wedding-budget-template-2026" className="hover:text-rose-700">Wedding Budget</Link>
          <Link href="/how-to-plan-a-wedding-on-a-budget" className="hover:text-rose-700">Plan on Budget</Link>
          <Link href="/best-wedding-planning-spreadsheet" className="hover:text-rose-700">Spreadsheet</Link>
          <Link href="/wedding-budget-calculator" className="hover:text-rose-700">Budget Calculator</Link>
          <Link href="/about" className="hover:text-rose-700">About</Link>
        </nav>
      </div>
    </header>
  );
}
