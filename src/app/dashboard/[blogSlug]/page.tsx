import Link from "next/link";
import { notFound } from "next/navigation";
import { user } from "~/lib/auth";
import prisma from "~/lib/prisma";

export default async function BlogPage({
  params,
}: {
  params: { blogSlug: string };
}) {
  const blog = await prisma.blog.findUnique({
    where: {
      slug: params.blogSlug,
      userId: user.id,
    },
    include: {
      articles: true,
    },
  });
  if (!blog) {
    notFound();
  }

  return (
    <div>
      <h2>{blog.name}</h2>
      <Link href={`/dashboard/${params.blogSlug}/new`}>아티클 작성</Link>

      <h1>업로드 된 아티클</h1>
      {blog.articles.length > 0 ? (
        <ul>
          {blog.articles.map((article) => {
            return (
              <li key={article.id}>
                <Link
                  target="_blank"
                  href={`/${params.blogSlug}/articles/${article.slug}`}
                >
                  {article.title}
                </Link>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
