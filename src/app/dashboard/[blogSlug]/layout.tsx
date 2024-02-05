import Link from "next/link";
import React, { ReactNode } from "react";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export default function BlogLayout({
  params,
  children,
}: {
  params: { blogSlug: string };
  children: ReactNode;
}) {
  return (
    <div>
      <div className="border-b">
        <nav className="px-4">
          <ul className="flex gap-4">
            <li>
              <Link
                href={`/dashboard/${params.blogSlug}`}
                className={cn(buttonVariants({ variant: "link" }), "px-0")}
              >
                아티클
              </Link>
            </li>
            <li>
              <Link
                href={`/dashboard/${params.blogSlug}/categories`}
                className={cn(buttonVariants({ variant: "link" }), "px-0")}
              >
                카테고리
              </Link>
            </li>
            <li>
              <Link
                href={`/dashboard/${params.blogSlug}/settings`}
                className={cn(buttonVariants({ variant: "link" }), "px-0")}
              >
                설정
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      {children}
    </div>
  );
}
