import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
  },
  // "/" serves the Russian build of app/[lang] directly (not a redirect) so
  // the deploy workflow's health check — a plain `curl -fsS` against "/",
  // which does not follow redirects — keeps seeing a direct 200. "/en" is a
  // real, separately-crawlable route under the same [lang] segment.
  async rewrites() {
    return [{ source: "/", destination: "/ru" }];
  },
};

export default nextConfig;
