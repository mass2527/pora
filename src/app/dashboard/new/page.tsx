import React from "react";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { z } from "zod";
import prisma from "~/lib/prisma";
import { Blog } from "@prisma/client";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button, buttonVariants } from "~/components/ui/button";
import { getCurrentUser } from "~/lib/auth";

export default async function NewBlogPage() {
  async function createBlog(formData: FormData) {
    "use server";

    let newBlog: Blog | undefined = undefined;
    try {
      const user = await getCurrentUser();
      if (!user) {
        throw new Error("Forbidden");
      }

      const schema = z.object({
        name: z.string(),
        slug: z.string(),
      });
      const { name, slug } = schema.parse({
        name: formData.get("name"),
        slug: formData.get("slug"),
      });
      newBlog = await prisma.blog.create({
        data: {
          name,
          slug,
          userId: user.id,
        },
      });
    } catch (error) {
      console.error(error);
    }

    if (newBlog) {
      redirect(`/dashboard/${newBlog.slug}`);
    }
  }

  return (
    <div className="grid place-items-center min-h-screen p-4">
      <form
        className="w-full max-w-[350px] flex flex-col gap-2"
        action={createBlog}
      >
        <Label htmlFor="name">이름</Label>
        <Input id="name" name="name" required />
        <Label htmlFor="slug">슬러그</Label>
        <Input id="slug" name="slug" required />
        <div className="flex gap-2 ml-auto">
          <Link
            className={buttonVariants({ variant: "outline" })}
            href="/dashboard"
          >
            취소
          </Link>
          <Button type="submit">생성</Button>
        </div>
      </form>
    </div>
  );
}
