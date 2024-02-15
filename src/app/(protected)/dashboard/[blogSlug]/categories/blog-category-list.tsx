"use client";

import { Prisma } from "@prisma/client";

import { buttonVariants } from "~/components/ui/button";
import { List, ListItem } from "~/components/ui/list";
import { cn } from "~/lib/utils";
import CategoryRowAction from "./category-row-action";
import Link from "next/link";
import { ResponseError, handleError } from "~/lib/errors";
import { useAtom } from "jotai";
import { blogOrderSaveStatusAtom } from "./blog-order-save-status-atom";
import { useSortableList } from "~/hooks/use-sortable-list";
import { tsFetch } from "~/lib/ts-fetch";

export default function BlogCategoryList({
  blog,
}: {
  blog: Prisma.BlogGetPayload<{
    include: { categories: true };
  }>;
}) {
  const [saveStatus, setSaveStatus] = useAtom(blogOrderSaveStatusAtom);
  const { sortableList: sortableCategories, getSortableListItemProps } =
    useSortableList({
      draggable: saveStatus !== "순서 변경중...",
      initialSortableList: blog.categories,
      onSorted: async (sortedCategories) => {
        try {
          setSaveStatus("순서 변경중...");
          const response = await tsFetch(`/api/blogs/${blog.id}/categories`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(
              sortedCategories.map((category, index) => ({
                id: category.id,
                orderIndex: index,
              }))
            ),
          });
          if (!response.ok) {
            throw new ResponseError("Bad fetch request", response);
          }

          setSaveStatus("순서 변경됨");
        } catch (error) {
          setSaveStatus("순서 변경 실패");
          handleError(error);
        }
      },
    });

  return (
    <List>
      {sortableCategories.map((category, index) => {
        return (
          <ListItem
            key={category.id}
            className="flex justify-between items-center"
            {...getSortableListItemProps(index)}
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
