import React, { ReactNode, Suspense } from "react";
import { getUser } from "~/lib/auth";
import Link from "next/link";

import prisma from "~/lib/prisma";
import BlogMenu from "./blog-menu";
import RootNav from "./root-nav";
import UserAccountMenu from "./dashboard/user-account-menu";
import PoraLogo from "~/components/pora-logo";
import SelectedBlogLink from "./selected-blog-link";
import { assertAuthenticated } from "~/lib/asserts";
import Await from "~/components/await";

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getUser();
  assertAuthenticated(user);

  const blogsPromise = prisma.blog.findMany({
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

          <div className="flex items-center">
            <Suspense>
              <Await promise={blogsPromise}>
                {(blogs) => {
                  return (
                    <>
                      <SelectedBlogLink blogs={blogs} />
                      <BlogMenu blogs={blogs} />
                    </>
                  );
                }}
              </Await>
            </Suspense>
          </div>
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
