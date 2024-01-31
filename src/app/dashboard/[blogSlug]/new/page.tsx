import { Article, Category } from "@prisma/client";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "~/components/ui/select";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import React from "react";
import { z } from "zod";
import { buttonVariants, Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { getCurrentUser } from "~/lib/auth";
import { ARTICLE_STATUS } from "~/lib/constants";
import prisma from "~/lib/prisma";
import { invariant } from "~/lib/utils";

export default async function NewArticlePage({
  params,
}: {
  params: { blogSlug: string };
}) {
  const user = await getCurrentUser();
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

  async function createArticle(formData: FormData) {
    "use server";

    invariant(blog);

    let newArticle: Article | undefined = undefined;
    try {
      const schema = z.object({
        categoryId: z.string(),
        slug: z.string(),
        title: z.string(),
        description: z.string().optional(),
        content: z.string(),
        status: z.enum([ARTICLE_STATUS.writing, ARTICLE_STATUS.published]),
      });
      const { categoryId, slug, title, description, content, status } =
        schema.parse({
          categoryId: formData.get("category_id"),
          slug: formData.get("slug"),
          title: formData.get("title"),
          description: formData.get("description"),
          content: formData.get("content"),
          status: formData.get("status"),
        });
      newArticle = await prisma.article.create({
        data: {
          slug,
          title,
          description,
          content,
          blogId: blog.id,
          status,
          categoryId,
        },
      });
    } catch (error) {
      console.error(error);
    }

    if (newArticle) {
      redirect(`/dashboard/${params.blogSlug}`);
    }
  }

  return (
    <div className="p-4">
      <div>
        <Link
          className={buttonVariants({ variant: "outline" })}
          href={`/dashboard/${params.blogSlug}`}
        >
          취소
        </Link>
      </div>

      <div className="min-h-[calc(100vh-72px)] grid place-items-center">
        <form
          className="w-full max-w-[350px] flex flex-col gap-2"
          action={createArticle}
        >
          <Label htmlFor="category_id">카테고리*</Label>
          <Select name="category_id">
            <SelectTrigger id="category_id">
              <SelectValue placeholder="카테고리를 선택해 주세요." />
            </SelectTrigger>
            <SelectContent>
              {blog.categories.map((category) => {
                return (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          <Label htmlFor="slug">슬러그*</Label>
          <Input id="slug" name="slug" required />
          <Label htmlFor="title">제목*</Label>
          <Input id="title" name="title" required />
          <Label htmlFor="description">설명</Label>
          <Input id="description" name="description" />
          <Label htmlFor="content">내용*</Label>
          <Textarea id="content" name="content" required />
          <div className="flex gap-2 ml-auto">
            <Button type="submit" name="status" value={ARTICLE_STATUS.writing}>
              임시 저장
            </Button>
            <Button
              type="submit"
              name="status"
              value={ARTICLE_STATUS.published}
            >
              생성
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
