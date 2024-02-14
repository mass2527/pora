import { notFound } from "next/navigation";
import React from "react";
import { getUser } from "~/lib/auth";
import prisma from "~/lib/prisma";
import DeleteBlogButton from "./delete-blog-button";
import UpdateBlogNameForm from "./update-blog-name-form";
import Card from "~/components/card";
import UpdateBlogDescriptionForm from "./update-blog-description-form";
import UpdateBlogImageForm from "./update-blog-image-form";

export default async function BlogSettingsPage({
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
    <div className="flex flex-col gap-4 p-4 min-h-screen">
      <h1 className="text-2xl font-semibold tracking-tight">일반</h1>

      <Card
        title="이름"
        description="블로그의 이름을 나타내기 위해 사용됩니다."
        content={<UpdateBlogNameForm blog={blog} />}
      />

      <Card
        title="설명"
        description="블로그를 소개하기 위해 사용됩니다."
        content={<UpdateBlogDescriptionForm blog={blog} />}
      />

      <Card
        title="이미지"
        description="블로그를 소개하기 위해 사용됩니다."
        content={<UpdateBlogImageForm blog={blog} />}
      />

      <Card
        title="삭제"
        description="블로그와 관련된 모든 아티클, 카테고리가 삭제되며 한 번 진행하면
        돌이킬 수 없습니다."
        content={<DeleteBlogButton blogId={blog.id} />}
      />
    </div>
  );
}
