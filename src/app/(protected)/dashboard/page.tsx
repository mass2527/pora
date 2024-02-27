import Link from "next/link";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";
import { buttonVariants } from "~/components/ui/button";
import { getUser } from "~/lib/auth";
import BlogList, { EmptyBlogListPlaceholder } from "./blog-list";

export default async function DashboardPage() {
  const user = await getUser();
  if (!user) {
    notFound();
  }

  return (
    <div className="min-h-screen p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-tight">대시보드</h1>
        <Link href="/dashboard/new" className={buttonVariants()}>
          블로그 생성
        </Link>
      </div>
      <Suspense fallback={<EmptyBlogListPlaceholder />}>
        <BlogList userId={user.id} />
      </Suspense>
    </div>
  );
}
