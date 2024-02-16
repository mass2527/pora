import React, { ReactNode } from "react";
import { getUser } from "~/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";

import prisma from "~/lib/prisma";
import BlogNav from "./dashboard/blog-nav";
import RootNav from "./root-nav";
import UserAccountMenu from "./dashboard/user-account-menu";
import PoraLogo from "~/components/pora-logo";

export default async function ProtectedLayout({
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
          <Link href="/dashboard">
            <PoraLogo />
          </Link>
          <BlogNav blogs={blogs} />
        </div>

        <UserAccountMenu
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
