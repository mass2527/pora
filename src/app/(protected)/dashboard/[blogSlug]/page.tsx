import { ArticleStatus } from "@prisma/client";
import { Button } from "~/components/ui/button";
import CreateBlogArticleButton from "./create-blog-article-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Suspense } from "react";
import Await from "~/components/await";
import { Skeleton } from "~/components/ui/skeleton";
import { BlogArticlesTable } from "./blog-articles-table";
import { getBlog } from "./get-blog";

const ARTICLE_STATUSES = {
  PUBLISHED: "발행됨",
  WRITING: "작성 중",
  HIDDEN: "숨겨짐",
} as const;

export default async function BlogArticlesPage({
  params,
}: {
  params: { blogSlug: string };
}) {
  return (
    <div className="min-h-screen p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-tight">아티클</h1>
        <Suspense fallback={<Button disabled>새 아티클</Button>}>
          <Await promise={getBlog(params.blogSlug)}>
            {(blog) => <CreateBlogArticleButton blog={blog} />}
          </Await>
        </Suspense>
      </div>

      <Tabs defaultValue={ArticleStatus.WRITING}>
        <TabsList>
          <TabsTrigger value={ArticleStatus.WRITING}>
            {ARTICLE_STATUSES[ArticleStatus.WRITING]}
          </TabsTrigger>
          <TabsTrigger value={ArticleStatus.PUBLISHED}>
            {ARTICLE_STATUSES[ArticleStatus.PUBLISHED]}
          </TabsTrigger>
        </TabsList>
        <TabsContent value={ArticleStatus.WRITING}>
          <Suspense fallback={<Skeleton className="h-16" />}>
            <Await promise={getBlog(params.blogSlug)}>
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
          <Suspense fallback={<Skeleton className="h-16" />}>
            <Await promise={getBlog(params.blogSlug)}>
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
