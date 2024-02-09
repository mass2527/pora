"use client";

import { Prisma } from "@prisma/client";

import React, { useRef, useState } from "react";
import { buttonVariants } from "~/components/ui/button";
import { List, ListItem } from "~/components/ui/list";
import { cn, invariant } from "~/lib/utils";
import CategoryRowAction from "./category-row-action";
import Link from "next/link";
import { ResponseError, handleError } from "~/lib/errors";
import { useAtom } from "jotai";
import { blogOrderSaveStatusAtom } from "./blog-order-save-status-atom";

export default function BlogCategoryList({
  blog,
}: {
  blog: Prisma.BlogGetPayload<{
    include: { categories: true };
  }>;
}) {
  const [categories, setCategories] = useState(blog.categories);
  const dragStartIndexRef = useRef(-1);
  const [saveStatus, setSaveStatus] = useAtom(blogOrderSaveStatusAtom);

  return (
    <List>
      {categories.map((category, index) => {
        return (
          <ListItem
            key={category.id}
            className="flex justify-between items-center"
            onDragStart={() => {
              dragStartIndexRef.current = index;
            }}
            onDragOver={(event) => {
              event.preventDefault();
            }}
            onDrop={async () => {
              const isUnchanged = index === dragStartIndexRef.current;
              if (isUnchanged) {
                return;
              }

              const targetCategory = categories.splice(
                dragStartIndexRef.current,
                1
              )[0];
              invariant(targetCategory);
              categories.splice(index, 0, targetCategory);
              setCategories([...categories]);

              try {
                setSaveStatus("순서 변경중...");
                const response = await fetch(
                  `/api/blogs/${blog.id}/categories`,
                  {
                    method: "PATCH",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(
                      categories.map((category, index) => ({
                        id: category.id,
                        orderIndex: index,
                      }))
                    ),
                  }
                );
                if (!response.ok) {
                  throw new ResponseError("Bad fetch request", response);
                }

                setSaveStatus("순서 변경됨");
              } catch (error) {
                setSaveStatus("순서 변경 실패");
                handleError(error);
              }
            }}
            draggable={saveStatus !== "순서 변경중..."}
          >
            <div className="flex flex-col">
              <Link
                href={`/${blog.slug}/category/${category.slug}`}
                className={cn(buttonVariants({ variant: "link" }), "p-0")}
              >
                <h2 className="text-xl font-semibold tracking-tight">
                  {category.name}
                </h2>
              </Link>
              <span className="text-xs text-zinc-500">{category.slug}</span>
            </div>

            <CategoryRowAction category={category} />
          </ListItem>
        );
      })}
    </List>
  );
}
