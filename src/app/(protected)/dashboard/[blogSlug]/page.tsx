import { ArticleStatus, Prisma } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buttonVariants } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import prisma from "~/lib/prisma";
import { cn, formatDate } from "~/lib/utils";
import BlogArticleRowAction from "./blog-article-row-action";
import CreateBlogArticleButton from "./create-blog-article-button";
import { getUser } from "~/lib/auth";
import { Badge } from "~/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { EmptyPlaceholder } from "~/components/empty-placeholder";

const articleStatuses = {
  PUBLISHED: "발행됨",
  WRITING: "작성중",
  HIDDEN: "숨겨짐",
};

export default async function BlogArticlesPage({
  params,
}: {
  params: { blogSlug: string };
}) {
  const user = await getUser();
  if (!user) {
    notFound();
  }

  const blog = await prisma.blog.findUnique({
    where: {
      slug: params.blogSlug,
      userId: user.id,
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
  if (!blog) {
    notFound();
  }

  const articles = blog.articles;
  const writingArticles = blog.articles.filter(
    (article) => article.status === "WRITING"
  );
  const publishedArticles = blog.articles.filter(
    (article) => article.status === "PUBLISHED"
  );

  return (
    <div className="min-h-screen p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-tight">아티클</h1>
        <CreateBlogArticleButton blog={blog} />
      </div>

      {articles.length === 0 ? (
        <EmptyPlaceholder
          title="아직 아무 글도 쓰지 않았어요."
          description="생각과 경험을 공유하고 블로그를 더 풍부하게 만들어보세요."
          action={<CreateBlogArticleButton blog={blog} />}
        />
      ) : (
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
            <BlogArticlesTable articles={writingArticles} />
          </TabsContent>
          <TabsContent value={ArticleStatus.PUBLISHED}>
            <BlogArticlesTable articles={publishedArticles} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

function BlogArticlesTable({
  articles,
}: {
  articles: Prisma.ArticleGetPayload<{
    include: { blog: true; category: true };
  }>[];
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>제목</TableHead>
          <TableHead>카테고리</TableHead>
          <TableHead>슬러그</TableHead>
          <TableHead>작성일</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {articles.map((article) => {
          const title =
            article.status === "PUBLISHED" ? (
              <Link
                target="_blank"
                className={cn(buttonVariants({ variant: "link" }), "p-0")}
                href={`/blog/${article.blog.slug}/article/${article.slug}`}
              >
                {article.title}
              </Link>
            ) : (
              article.title
            );

          return (
            <TableRow key={article.id}>
              <TableCell>{title}</TableCell>
              <TableCell>
                {article.category?.name && (
                  <Badge>{article.category?.name}</Badge>
                )}
              </TableCell>
              <TableCell>{article.slug}</TableCell>
              <TableCell>{formatDate(article.createdAt)}</TableCell>
              <TableCell>
                <BlogArticleRowAction article={article} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
