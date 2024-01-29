import { Article } from "@prisma/client";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import React from "react";
import { z } from "zod";
import { buttonVariants, Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { user } from "~/lib/auth";
import prisma from "~/lib/prisma";
import { invariant } from "~/lib/utils";

export default async function NewArticlePage({
  params,
}: {
  params: { blogSlug: string };
}) {
  const blog = await prisma.blog.findUnique({
    where: {
      slug: params.blogSlug,
      userId: user.id,
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
        slug: z.string(),
        title: z.string(),
        content: z.string(),
      });
      const { slug, title, content } = schema.parse({
        slug: formData.get("slug"),
        title: formData.get("title"),
        content: formData.get("content"),
      });
      newArticle = await prisma.article.create({
        data: {
          slug,
          title,
          content,
          blogId: blog.id,
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
    <div className="grid place-items-center min-h-screen">
      <form
        className="w-full max-w-[350px] flex flex-col gap-2"
        action={createArticle}
      >
        <Label htmlFor="slug">슬러그</Label>
        <Input id="slug" name="slug" required />
        <Label htmlFor="title">제목</Label>
        <Input id="title" name="title" required />
        <Label htmlFor="content">내용</Label>
        <Textarea id="content" name="content" required />
        <div className="flex gap-2 ml-auto">
          <Link
            className={buttonVariants({ variant: "outline" })}
            href={`/dashboard/${params.blogSlug}`}
          >
            취소
          </Link>
          <Button type="submit">생성</Button>
        </div>
      </form>
    </div>
  );
}
