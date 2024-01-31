import Link from "next/link";
import { notFound } from "next/navigation";
import { buttonVariants } from "~/components/ui/button";
import { getCurrentUser } from "~/lib/auth";
import prisma from "~/lib/prisma";
import CreateArticleForm from "./create-article-form";

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
        <CreateArticleForm blog={blog} />
      </div>
    </div>
  );
}
