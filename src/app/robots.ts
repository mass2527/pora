import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/dashboard/", "/account"],
    },
    sitemap: `${process.env.NEXTAUTH_URL}/sitemap.xml`,
  };
}
