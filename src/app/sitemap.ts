import { MetadataRoute } from "next";
import prisma from "~/lib/prisma";
import { invariant } from "~/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL;
  invariant(baseUrl);

  const [blogs, blogCategories, blogArticles] = await Promise.all([
    prisma.blog.findMany({
      include: {
        categories: true,
      },
    }),
    prisma.category.findMany({
      include: {
        blog: true,
      },
    }),
    prisma.article.findMany({
      include: {
        blog: true,
      },
    }),
  ]);

  const blogPages: MetadataRoute.Sitemap = blogs.map((blog) => ({
    url: `${baseUrl}/${blog.slug}`,
    lastModified: blog.updatedAt,
  }));
  const blogCategoryPages: MetadataRoute.Sitemap = blogCategories.map(
    (category) => ({
      url: `${baseUrl}/${category.blog.slug}/category/${category.slug}`,
      lastModified: category.blog.updatedAt,
    })
  );
  const blogArticlePages: MetadataRoute.Sitemap = blogArticles.map(
    (article) => ({
      url: `${baseUrl}/${article.blog.slug}/${article.slug}`,
      lastModified: article.updatedAt,
    })
  );

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
    },
    ...blogPages,
    ...blogCategoryPages,
    ...blogArticlePages,
  ];
}
