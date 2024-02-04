import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import { buttonVariants } from "~/components/ui/button";
import { List, ListItem } from "~/components/ui/list";
import { getUser } from "~/lib/auth";
import prisma from "~/lib/prisma";

export default async function DashboardPage() {
  const user = await getUser();
  if (!user) {
    notFound();
  }

  const blogs = await prisma.blog.findMany({
    where: {
      userId: user.id,
    },
    include: {
      articles: true,
    },
  });

  return (
    <div className="min-h-screen p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-tight">블로그</h1>
        <Link href="/dashboard/new" className={buttonVariants()}>
          블로그 생성
        </Link>
      </div>

      {blogs.length > 0 ? (
        <List>
          {blogs.map((blog) => {
            return (
              <ListItem key={blog.id} className="flex flex-col gap-1">
                <code className="text-xs text-zinc-500">{blog.slug}</code>
                <Link href={`/dashboard/${blog.slug}`}>
                  <h2 className="text-2xl font-semibold tracking-tight">
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
      ) : null}
    </div>
  );
}
