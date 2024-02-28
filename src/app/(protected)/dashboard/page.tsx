import Link from "next/link";
import React, { Suspense } from "react";
import { buttonVariants } from "~/components/ui/button";
import BlogList from "./blog-list";
import { List } from "~/components/ui/list";
import { Skeleton } from "~/components/ui/skeleton";

export default async function DashboardPage() {
  return (
    <div className="min-h-screen p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-tight">대시보드</h1>
        <Link href="/dashboard/new" className={buttonVariants()}>
          블로그 생성
        </Link>
      </div>
      <Suspense
        fallback={
          <List>
            <Skeleton className="h-[110px]" />
          </List>
        }
      >
        <BlogList />
      </Suspense>
    </div>
  );
}
