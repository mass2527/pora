import { notFound } from "next/navigation";
import Card from "~/components/card";
import { Skeleton } from "~/components/ui/skeleton";
import prisma from "~/lib/prisma";
import UpdateBlogNameForm from "./update-blog-name-form";
import UpdateBlogDescriptionForm from "./update-blog-description-form";
import UpdateBlogImageForm from "./update-blog-image-form";
import DeleteBlogButton from "./delete-blog-button";

export function BlogFormsPlaceholder() {
  return (
    <>
      <Skeleton className="h-52" />
      <Skeleton className="h-52" />
      <Skeleton className="h-52" />
    </>
  );
}

export default async function BlogForms({
  userId,
  blogSlug,
}: {
  userId: string;
  blogSlug: string;
}) {
  const blog = await prisma.blog.findUnique({
    where: {
      userId,
      slug: blogSlug,
    },
    include: {
      categories: true,
    },
  });
  if (!blog) {
    notFound();
  }

  return (
    <>
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
    </>
  );
}
