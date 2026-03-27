/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
        pathname: "/images/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/privacy-policy",
        destination: "/privacy",
        permanent: true,
      },
      // DUPLICATE URL FIX (2026-03-23): 301 redirect old slugs → canonical 2026 versions
      {
        source: "/best-wedding-planning-apps",
        destination: "/best-wedding-planning-apps-2026",
        permanent: true,
      },
      {
        source: "/wedding-budget-template",
        destination: "/wedding-budget-template-2026",
        permanent: true,
      },
      {
        source: "/wedding-planning-timeline",
        destination: "/wedding-planning-timeline-checklist",
        permanent: true,
      },
      {
        source: "/wedding-planning-checklist",
        destination: "/wedding-planning-timeline-checklist",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
