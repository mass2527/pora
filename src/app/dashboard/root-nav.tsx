"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import React from "react";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";

type Link = { href: string; name: string };

const LINKS: Link[] = [
  { href: "/dashboard", name: "블로그" },
  { href: "/account", name: "계정" },
] as const;

export default function RootNav() {
  const selectedLayoutSegment = useSelectedLayoutSegment();
  if (selectedLayoutSegment) {
    return null;
  }

  return (
    <div className="border-b">
      <nav className="px-4">
        <ul className="flex gap-4">
          {LINKS.map((link) => {
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
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
  );
}
