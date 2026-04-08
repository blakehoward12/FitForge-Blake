import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/profile"],
    },
    sitemap: "https://fitforgelifts.co/sitemap.xml",
    host: "https://fitforgelifts.co",
  };
}
