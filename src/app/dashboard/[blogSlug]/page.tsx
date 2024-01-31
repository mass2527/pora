import { Prisma } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ReactNode } from "react";
import { EmptyPlaceholder } from "~/components/empty-placeholder";
import { buttonVariants } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { getCurrentUser } from "~/lib/auth";
import prisma from "~/lib/prisma";
import { assertNever, cn, formatDate, invariant } from "~/lib/utils";
import { getArticleStatusLabel } from "~/services/article";
import ArticleRowAction from "./article-row-action";

export default async function BlogPage({
  params,
}: {
  params: { blogSlug: string };
}) {
  const user = await getCurrentUser();
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
          category: true,
        },
      },
    },
  });
  if (!blog) {
    notFound();
  }

  return (
    <div className="min-h-screen p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-tight">아티클</h1>
        <Link
          href={`/dashboard/${params.blogSlug}/new`}
          className={buttonVariants()}
        >
          새 아티클
        </Link>
      </div>

      {blog.articles.length > 0 ? (
        <BlogTable blog={blog} />
      ) : (
        <EmptyPlaceholder
          title="아직 아무 글도 쓰지 않았어요."
          description="생각과 경험을 공유하고 블로그를 더 풍부하게 만들어보세요."
          action={
            <Link
              href={`/dashboard/${params.blogSlug}/new`}
              className={buttonVariants({ size: "sm" })}
            >
              새 아티클
            </Link>
          }
        />
      )}
    </div>
  );
}

function BlogTable({
  blog,
}: {
  blog: Prisma.BlogGetPayload<{
    include: { articles: { include: { category: true } } };
  }>;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>제목</TableHead>
          <TableHead>상태</TableHead>
          <TableHead>카테고리</TableHead>
          <TableHead>슬러그</TableHead>
          <TableHead>작성일</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {blog.articles.map((article) => {
          const statusLabel = getArticleStatusLabel(article.status);
          let title: ReactNode;
          if (statusLabel === "발행됨") {
            title = (
              <Link
                target="_blank"
                className={cn(buttonVariants({ variant: "link" }), "p-0")}
                href={`/${blog.slug}/articles/${article.slug}`}
              >
                {article.title}
              </Link>
            );
          } else if (statusLabel === "숨겨짐") {
            title = <span>{article.title}</span>;
          } else if (statusLabel === "작성중") {
            title = (
              <Link
                className={cn(buttonVariants({ variant: "link" }), "p-0")}
                href={`/dashboard/${blog.slug}/${article.slug}/edit`}
              >
                {article.title}
              </Link>
            );
          } else {
            assertNever(statusLabel);
          }

          return (
            <TableRow key={article.id}>
              <TableCell>{title}</TableCell>
              <TableCell>{statusLabel}</TableCell>
              <TableCell>{article.category.name}</TableCell>
              <TableCell>{article.slug}</TableCell>
              <TableCell>{formatDate(article.createdAt)}</TableCell>
              <TableCell>
                <ArticleRowAction article={article} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
