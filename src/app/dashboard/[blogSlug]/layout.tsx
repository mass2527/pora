import Link from "next/link";
import React, { ReactNode } from "react";
import { buttonVariants } from "~/components/ui/button";

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
          <ul className="flex">
            <li>
              <Link
                href={`/dashboard/${params.blogSlug}`}
                className={buttonVariants({ variant: "link" })}
              >
                아티클
              </Link>
            </li>
            <li>
              <Link
                href={`/dashboard/${params.blogSlug}/categories`}
                className={buttonVariants({ variant: "link" })}
              >
                카테고리
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      {children}
    </div>
  );
}
