import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import { buttonVariants } from "~/components/ui/button";
import { user } from "~/lib/auth";
import prisma from "~/lib/prisma";

export default async function DashboardPage() {
  const currentUser = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    include: {
      blogs: {
        include: {
          articles: true,
        },
      },
    },
  });
  if (!currentUser) {
    notFound();
  }

  return (
    <div className="min-h-screen p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-tight">블로그</h1>
        <Link href="/dashboard/new" className={buttonVariants()}>
          블로그 생성
        </Link>
      </div>

      {currentUser.blogs.length > 0 ? (
        <ul className="grid grid-cols-2">
          {currentUser.blogs.map((blog) => {
            return (
              <li key={blog.id}>
                <div className="flex flex-col gap-1">
                  <code className="text-xs text-zinc-500">{blog.slug}</code>
                  <Link href={`/dashboard/${blog.slug}`}>
                    <h2 className="text-2xl font-semibold tracking-tight">
                      {blog.name}
                    </h2>
                  </Link>

                  <span className="text-sm text-zinc-500">
                    {blog.articles.length}개의 아티클
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
