import Link from "next/link";
import React, { ReactNode } from "react";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";

type Link = { href: string; name: string };

const LINKS: Link[] = [
  {
    href: "",
    name: "아티클",
  },
  {
    href: "/categories",
    name: "카테고리",
  },
  {
    href: "/settings",
    name: "설정",
  },
] as const;

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
            {LINKS.map((link) => {
              return (
                <li key={link.href}>
                  <Link
                    href={`/dashboard/${params.blogSlug}${link.href}`}
                    className={cn(buttonVariants({ variant: "link" }), "px-0")}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
      {children}
    </div>
  );
}
