import React from "react";

import { getUser } from "~/lib/auth";
import prisma from "~/lib/prisma";

import { notFound } from "next/navigation";
import CreateCategoryButton from "./create-category-button";
import { EmptyPlaceholder } from "~/components/empty-placeholder";
import CategoryRowAction from "./category-row-action";
import { List, ListItem } from "~/components/ui/list";
import Link from "next/link";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export default async function CategoriesPage({
  params,
}: {
  params: { blogSlug: string };
}) {
  const user = await getUser();
  if (!user) {
    notFound();
  }

  const blog = await prisma.blog.findUnique({
    where: {
      slug: params.blogSlug,
      userId: user.id,
    },
    include: {
      categories: true,
    },
  });
  if (!blog) {
    notFound();
  }

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-tight">카테고리</h1>
        <CreateCategoryButton blogId={blog.id} />
      </div>

      {blog.categories.length > 0 ? (
        <List>
          {blog?.categories.map((category) => {
            return (
              <ListItem
                key={category.id}
                className="flex justify-between items-center"
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
      ) : (
        <EmptyPlaceholder
          title="추가된 카테고리가 없어요."
          description="새로운 카테고리를 추가하고 글을 분류해 보세요."
          action={<CreateCategoryButton blogId={blog.id} />}
        />
      )}
    </div>
  );
}
