import React, { ReactNode } from "react";
import { getUser } from "~/lib/auth";
import { notFound, useSelectedLayoutSegment } from "next/navigation";
import Link from "next/link";
import UserAccountNav from "./user-account-nav";
import BlogNav from "./blog-nav";
import prisma from "~/lib/prisma";
import RootNav from "./root-nav";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getUser();
  if (!user) {
    notFound();
  }

  const blogs = await prisma.blog.findMany({
    where: {
      userId: user.id,
    },
  });

  return (
    <div>
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center gap-4 h-8">
          <Link
            href="/dashboard"
            className="text-xl font-semibold tracking-tight"
          >
            Pora
          </Link>
          <BlogNav blogs={blogs} />
        </div>

        <UserAccountNav
          user={{
            name: user.name || null,
            email: user.email || null,
            image: user.image || null,
          }}
        />
      </div>
      <RootNav />

      {children}
    </div>
  );
}
