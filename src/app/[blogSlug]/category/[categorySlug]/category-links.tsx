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

  return (
    <nav>
      {categories.length > 0 ? (
        <ul className="flex">
          {categories.map((category) => {
            return (
              <li key={category.id}>
                <Link
                  href={`/${params.blogSlug}/category/${category.slug}`}
                  className={cn(
                    buttonVariants({ variant: "link" }),
                    "text-zinc-500 hover:no-underline hover:text-primary",
                    {
                      "text-primary underline hover:underline":
                        pathname ===
                        `/${params.blogSlug}/category/${category.slug}`,
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
