import React, { ReactNode } from "react";
import { getUser } from "~/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";

import prisma from "~/lib/prisma";
import BlogNav from "./dashboard/blog-nav";
import RootNav from "./root-nav";
import UserAccountNav from "./dashboard/user-account-nav";
import Image from "next/image";

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
            <div className="flex items-center gap-2">
              <Image src="/pora.svg" alt="Pora Logo" width={24} height={24} />
              <span className="text-xl font-semibold tracking-tight">Pora</span>
            </div>
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
