"use client";

import { Category } from "@prisma/client";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React from "react";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export default function CategoryLinks({
  categories,
}: {
  categories: Category[];
}) {
  const params = useParams();
  const pathname = usePathname();

  const allCategories: Category[] = [
    { id: "all", name: "모든 아티클", slug: "", blogId: "" },
    ...categories,
  ];

  return (
    <nav>
      {categories.length > 0 ? (
        <ul className="flex">
          {allCategories.map((category) => {
            let href = `/${params.blogSlug}`;
            if (category.slug !== "") {
              href += `/category/${category.slug}`;
            }

            return (
              <li key={category.id}>
                <Link
                  href={href}
                  className={cn(
                    buttonVariants({ variant: "link" }),
                    "text-zinc-500 hover:no-underline hover:text-primary",
                    {
                      "text-primary underline hover:underline":
                        pathname === href,
                    }
                  )}
                >
                  {category.name}
                </Link>
              </li>
            );
          })}
        </ul>
      ) : null}
    </nav>
  );
}
