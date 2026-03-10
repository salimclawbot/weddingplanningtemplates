import type { Metadata } from "next"; import { Inter } from "next/font/google"; import "./globals.css";
const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: { default: "Wedding Planning Templates — Free Checklists & Timelines (2026)", template: "%s | Wedding Planning Templates" },
  description: "Free wedding planning templates for 2026: checklists, budgets, timelines, seating charts and vendor trackers — everything you need to plan your perfect day.",
  metadataBase: new URL("https://weddingplanningtemplates.com"),
  openGraph: { siteName: "Wedding Planning Templates", type: "website" },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body className={inter.className}>{children}</body></html>);
}
