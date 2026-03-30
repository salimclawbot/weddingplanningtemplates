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

        <Script id="ga4-custom-event-tracking" strategy="afterInteractive">{`
          (function () {
            if (typeof window === 'undefined') return;

            const getPagePath = () => window.location.pathname + window.location.search;

            const findNearestHeadingText = (el) => {
              let node = el;
              while (node && node !== document.body) {
                const heading = node.querySelector?.('h1, h2, h3, h4, h5, h6');
                if (heading && heading.textContent) return heading.textContent.trim();
                node = node.parentElement;
              }
              const fallbackHeading = document.querySelector('h1, h2');
              return fallbackHeading?.textContent?.trim() || '';
            };

            const getProductName = (link) => {
              const linkText = link.textContent?.trim() || '';
              if (linkText) return linkText;
              return findNearestHeadingText(link) || '';
            };

            const isAmazonAffiliateLink = (url) => {
              const value = (url || '').toLowerCase();
              return (
                value.includes('amazon.com') ||
                value.includes('amzn.to') ||
                value.includes('tag=theforge05-20') ||
                value.includes('tag=doublefury-22')
              );
            };

            const trackEvent = (eventName, params) => {
              if (typeof window.gtag !== 'function') return;
              window.gtag('event', eventName, params);
            };

            document.addEventListener('click', (event) => {
              const target = event.target;
              if (!(target instanceof Element)) return;
              const link = target.closest('a[href]');
              if (!link) return;

              const href = link.getAttribute('href') || '';
              const absoluteUrl = (() => {
                try {
                  return new URL(href, window.location.origin).toString();
                } catch {
                  return href;
                }
              })();

              if (!isAmazonAffiliateLink(absoluteUrl)) return;

              const linkText = (link.textContent || '').trim();
              trackEvent('affiliate_click', {
                link_url: absoluteUrl,
                link_text: linkText,
                page_path: getPagePath(),
                product_name: getProductName(link),
              });
            });

            const scrollMilestones = [25, 50, 75, 100];
            const scrollFired = new Set();

            const checkScrollDepth = () => {
              const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
              const docHeight = Math.max(
                document.documentElement.scrollHeight,
                document.body.scrollHeight,
                document.documentElement.offsetHeight,
                document.body.offsetHeight,
                document.documentElement.clientHeight
              );
              const winHeight = window.innerHeight || document.documentElement.clientHeight;
              const scrollable = Math.max(docHeight - winHeight, 1);
              const percent = Math.min(100, Math.round((scrollTop / scrollable) * 100));

              scrollMilestones.forEach((milestone) => {
                if (percent >= milestone && !scrollFired.has(milestone)) {
                  scrollFired.add(milestone);
                  trackEvent('scroll_depth', {
                    percent_scrolled: milestone,
                    page_path: getPagePath(),
                  });
                }
              });
            };

            let scrollTicking = false;
            window.addEventListener('scroll', () => {
              if (scrollTicking) return;
              scrollTicking = true;
              window.requestAnimationFrame(() => {
                checkScrollDepth();
                scrollTicking = false;
              });
            }, { passive: true });
            checkScrollDepth();

            const engagementMilestones = [30, 60, 120, 300];
            engagementMilestones.forEach((seconds) => {
              window.setTimeout(() => {
                trackEvent('engagement_time', {
                  time_seconds: seconds,
                  page_path: getPagePath(),
                });
              }, seconds * 1000);
            });
          })();
        `}</Script>

      </body>
    </html>
  );
}
