import Link from "next/link";
import { EmptyPlaceholder } from "~/components/empty-placeholder";
import { buttonVariants } from "~/components/ui/button";
import { List, ListItem } from "~/components/ui/list";
import { Skeleton } from "~/components/ui/skeleton";
import prisma from "~/lib/prisma";
import { cn } from "~/lib/utils";

export function BlogListPlaceholder() {
  return (
    <List>
      <Skeleton className="h-[110px]" />
      <Skeleton className="h-[110px]" />
      <Skeleton className="h-[110px]" />
    </List>
  );
}

export default async function BlogList({ userId }: { userId: string }) {
  const blogs = await prisma.blog.findMany({
    where: {
      userId,
    },
    include: {
      articles: true,
    },
  });

  return blogs.length > 0 ? (
    <List>
      {blogs.map((blog) => {
        return (
          <ListItem key={blog.id} className="flex flex-col">
            <code className="text-xs text-zinc-500 truncate">
              /blog/{blog.slug}
            </code>
            <Link
              href={`/dashboard/${blog.slug}`}
              className={cn(
                buttonVariants({ variant: "link" }),
                "justify-start p-0"
              )}
            >
              <h2 className="text-2xl font-semibold tracking-tight truncate">
                {blog.name}
              </h2>
            </Link>

            <span className="text-sm text-zinc-500">
              {blog.articles.length}개의 아티클
            </span>
          </ListItem>
        );
      })}
    </List>
  ) : (
    <EmptyPlaceholder
      title="생성된 블로그가 없어요."
      description="새로운 블로그를 생성하고 아티클을 작성해 보세요."
      action={
        <Link href="/dashboard/new" className={buttonVariants()}>
          블로그 생성
        </Link>
      }
    />
  );
}
