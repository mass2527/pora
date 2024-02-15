"use client";

import { Category } from "@prisma/client";
import { useParams } from "next/navigation";
import React from "react";
import Nav from "~/components/nav";

export default function CategoryLinks({
  categories,
}: {
  categories: Category[];
}) {
  const params = useParams();

  const allCategories: Omit<Category, "orderIndex">[] = [
    { id: "all", name: "모든 아티클", slug: "", blogId: "" },
    ...categories,
  ];

  const links = allCategories.map((category) => {
    let href = `/${params.blogSlug}`;
    if (category.slug !== "") {
      href += `/category/${category.slug}`;
    }

    return { name: category.name, href };
  });

  return <Nav links={links} />;
}
