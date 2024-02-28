import Link from "next/link";
import React, { Suspense } from "react";
import { buttonVariants } from "~/components/ui/button";
import BlogList, { BlogListPlaceholder } from "./blog-list";

export default async function DashboardPage() {
  return (
    <div className="min-h-screen p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-tight">대시보드</h1>
        <Link href="/dashboard/new" className={buttonVariants()}>
          블로그 생성
        </Link>
      </div>
      <Suspense fallback={<BlogListPlaceholder />}>
        <BlogList />
      </Suspense>
    </div>
  );
}
