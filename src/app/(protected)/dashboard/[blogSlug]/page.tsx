import { ArticleStatus } from "@prisma/client";
import { notFound } from "next/navigation";
import { Button } from "~/components/ui/button";
import prisma from "~/lib/prisma";
import CreateBlogArticleButton from "./create-blog-article-button";
import { getUser } from "~/lib/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Suspense, cache } from "react";
import Await from "~/components/await";
import { Skeleton } from "~/components/ui/skeleton";
import { BlogArticlesTable } from "./blog-articles-table";
import { ifNullable } from "~/lib/promise";
import { assertAuthenticated } from "~/lib/asserts";

const articleStatuses = {
  PUBLISHED: "발행됨",
  WRITING: "작성중",
  HIDDEN: "숨겨짐",
};

const getBlogOrNull = cache(async (userId: string, blogSlug: string) => {
  const blog = await prisma.blog.findUnique({
    where: {
      slug: blogSlug,
      userId: userId,
    },
    include: {
      articles: {
        include: {
          blog: true,
          category: true,
        },
      },
    },
  });

  return blog;
});

function getBlog(userId: string, blogSlug: string) {
  return ifNullable(getBlogOrNull(userId, blogSlug), notFound);
}

export default async function BlogArticlesPage({
  params,
}: {
  params: { blogSlug: string };
}) {
  const user = await getUser();
  assertAuthenticated(user);

  return (
    <div className="min-h-screen p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-tight">아티클</h1>
        <Suspense fallback={<Button disabled>새 아티클</Button>}>
          <Await promise={getBlog(user.id, params.blogSlug)}>
            {(blog) => <CreateBlogArticleButton blog={blog} />}
          </Await>
        </Suspense>
      </div>

      <Tabs defaultValue={ArticleStatus.WRITING}>
        <TabsList>
          <TabsTrigger value={ArticleStatus.WRITING}>
            {articleStatuses[ArticleStatus.WRITING]}
          </TabsTrigger>
          <TabsTrigger value={ArticleStatus.PUBLISHED}>
            {articleStatuses[ArticleStatus.PUBLISHED]}
          </TabsTrigger>
        </TabsList>
        <TabsContent value={ArticleStatus.WRITING}>
          <Suspense fallback={<BlogArticlesPlaceholder />}>
            <Await promise={getBlog(user.id, params.blogSlug)}>
              {(blog) => {
                const writingArticles = blog.articles.filter(
                  (article) => article.status === "WRITING"
                );
                return <BlogArticlesTable articles={writingArticles} />;
              }}
            </Await>
          </Suspense>
        </TabsContent>
        <TabsContent value={ArticleStatus.PUBLISHED}>
          <Suspense fallback={<BlogArticlesPlaceholder />}>
            <Await promise={getBlog(user.id, params.blogSlug)}>
              {(blog) => {
                const publishedArticles = blog.articles.filter(
                  (article) => article.status === "PUBLISHED"
                );
                return <BlogArticlesTable articles={publishedArticles} />;
              }}
            </Await>
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function BlogArticlesPlaceholder() {
  return <Skeleton className="h-16" />;
}
