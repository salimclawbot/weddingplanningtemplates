import Script from 'next/script';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Start Wedding Planning — Complete Wedding Planning Guide (2026)", template: "%s | Start Wedding Planning" },
  description: "Complete wedding planning guides, checklists and templates for 2026. Plan your perfect wedding stress-free.",
  metadataBase: new URL("https://startweddingplanning.com"),
  alternates: { canonical: "https://startweddingplanning.com" },
  openGraph: {
    siteName: "Start Wedding Planning",
    type: "website",
    title: "Start Wedding Planning — Complete Wedding Planning Guide (2026)",
    description: "Complete wedding planning guides, checklists and templates for 2026. Plan your perfect wedding stress-free.",
    url: "https://startweddingplanning.com",
    images: [{ url: "https://startweddingplanning.com/og-image.jpg", width: 1200, height: 630, alt: "Start Wedding Planning — Complete Wedding Planning Guide (2026)" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Start Wedding Planning — Complete Wedding Planning Guide (2026)",
    description: "Complete wedding planning guides, checklists and templates for 2026. Plan your perfect wedding stress-free.",
    images: ["https://startweddingplanning.com/og-image.jpg"],
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Start Wedding Planning",
  "url": "https://startweddingplanning.com",
  "description": "Complete wedding planning guides and resources",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://startweddingplanning.com/?s={{search_term_string}}",
    "query-input": "required name=search_term_string"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-DP1XPQYXCN"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-DP1XPQYXCN');
          `}
        </Script>
      </body>
    </html>
  );
}
