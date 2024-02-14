"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React from "react";
import { cn } from "~/lib/utils";

const links = [
  { href: "/settings", name: "일반" },
  { href: "/settings/collaborators", name: "팀원" },
];

export default function SettingsNav() {
  const params = useParams();
  const pathname = usePathname();

  return (
    <nav>
      <ul className="flex gap-2">
        {links.map((link) => {
          const href = `/dashboard/${params.blogSlug}${link.href}`;

          return (
            <li key={link.name}>
              <Link
                href={href}
                className={cn(
                  "flex h-7 items-center justify-center rounded-full px-4 text-center text-sm transition-colors hover:text-primary",
                  pathname === href
                    ? "bg-muted font-medium text-primary"
                    : "text-muted-foreground"
                )}
              >
                {link.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
