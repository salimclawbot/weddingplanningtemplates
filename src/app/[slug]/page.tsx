import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticle, getAllSlugs } from "@/lib/articles";

interface PageProps { params: { slug: string } }

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const article = await getArticle(params.slug);
  if (!article) return { title: "Not Found" };
  return {
    title: { absolute: article.title },
    description: article.description,
    alternates: { canonical: `https://startweddingplanning.com/${article.slug}` },
    openGraph: {
      title: article.title,
      description: article.description,
      url: `https://startweddingplanning.com/${article.slug}`,
      images: [{ url: `https://startweddingplanning.com/og-image.jpg`, width: 1200, height: 630, alt: article.title }],
      type: "article",
      siteName: "Wedding Planning Templates",
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const article = await getArticle(params.slug);
  if (!article) notFound();

  const articleSchema =
    article.articleSchema ??
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description: article.description,
      author: { "@type": "Person", name: article.author || "Emma Walsh" },
      publisher: {
        "@type": "Organization",
        name: "Wedding Planning Templates",
        logo: { "@type": "ImageObject", url: "https://startweddingplanning.com/icon.svg" },
      },
      datePublished: article.date,
      dateModified: article.dateModified,
      mainEntityOfPage: { "@type": "WebPage", "@id": `https://startweddingplanning.com/${article.slug}` },
    };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      {article.faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(article.faqSchema) }} />
      )}
      <p className="text-xs font-semibold uppercase tracking-wide text-pink-600">{article.category}</p>
      <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900">{article.title}</h1>
      <p className="mt-3 text-slate-600">By {article.author || "Emma Walsh"} · Updated {article.dateModified}</p>
      <div className="prose prose-slate max-w-none mt-8" dangerouslySetInnerHTML={{ __html: article.htmlContent }} />
      <section className="mt-10 rounded-xl border-2 border-pink-300 bg-rose-50 p-6">
        <h3 className="text-2xl font-semibold text-slate-900">Ready to plan with less stress?</h3>
        <p className="mt-3 max-w-2xl text-slate-700">
          Our <strong>Complete Wedding Planning Tracker</strong> has 247 tasks, a 12-month countdown, and vendor
          contact hub, all in one spreadsheet.
        </p>
        <Link
          href="/products/wedding-planning-tracker"
          className="mt-4 inline-flex rounded-lg bg-pink-500 px-7 py-3 font-semibold text-white transition hover:bg-pink-600"
        >
          Get the Tracker - $27 →
        </Link>
      </section>
    </article>
  );
}
