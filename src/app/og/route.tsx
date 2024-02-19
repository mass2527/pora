/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";
import prisma from "~/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const blogSlug = searchParams.get("blogSlug");
  const articleSlug = searchParams.get("articleSlug");

  if (!blogSlug || !articleSlug) {
    return new ImageResponse(<>Invalid blogSlug or articleSlug</>, {
      width: 1920,
      height: 1080,
    });
  }

  const article = await prisma.article.findFirst({
    where: {
      slug: articleSlug,
      blog: {
        slug: blogSlug,
      },
    },
    include: {
      blog: {
        include: {
          user: true,
        },
      },
      category: true,
    },
  });
  if (!article) {
    return new ImageResponse(<>Invalid blogSlug or articleSlug</>, {
      width: 1920,
      height: 1080,
    });
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: `url(${process.env.NEXTAUTH_URL}/og-cover.png)`,

          padding: 190,
        }}
      >
        <div
          style={{
            color: "white",
            fontSize: 130,
            letterSpacing: "-0.05em",
            lineHeight: "120px",
            whiteSpace: "pre-wrap",
          }}
        >
          {article?.title}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            position: "absolute",
            left: 190,
            bottom: 190,
          }}
        >
          {article?.blog.user.image && (
            <img
              src={article?.blog.user.image}
              style={{ borderRadius: "100%" }}
              width={88}
              height={88}
              alt={article?.blog.user.name ?? "아바타"}
            />
          )}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 36, color: "#fafafa", fontWeight: 600 }}>
              {article?.blog.user.name}
            </span>
            <span style={{ fontSize: 36, color: "#a1a1aa" }}>
              {article?.blog.user.jobPosition}
            </span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1920,
      height: 1080,
    }
  );
}
