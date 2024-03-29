import { Prisma } from "@prisma/client";

import { buttonVariants } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { cn, formatDate } from "~/lib/utils";
import BlogArticleRowAction from "./blog-article-row-action";
import { Badge } from "~/components/ui/badge";
import NewTabLink from "~/components/new-tab-link";

export function BlogArticlesTable({
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
              <NewTabLink
                className={cn(buttonVariants({ variant: "link" }), "p-0")}
                href={`/blog/${article.blog.slug}/article/${article.slug}`}
              >
                {article.title}
              </NewTabLink>
            ) : (
              article.title
            );

          return (
            <TableRow key={article.id}>
              <TableCell>{title}</TableCell>
              <TableCell>
                {article.category?.name && (
                  <Badge className="whitespace-nowrap">
                    {article.category?.name}
                  </Badge>
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
