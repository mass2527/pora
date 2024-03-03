import React, { ReactNode, Suspense } from "react";
import Link from "next/link";

import RootNav from "./root-nav";
import UserAccountMenu from "./dashboard/user-account-menu";
import PoraLogo from "~/components/pora-logo";
import BlogInfo from "./blog-info";

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div>
      <div className="flex justify-between items-center p-4 sticky top-0 bg-background z-10">
        <div className="flex items-center gap-4 h-8">
          <Link href="/dashboard">
            <PoraLogo />
          </Link>

          <Suspense>
            <BlogInfo />
          </Suspense>
        </div>

        <UserAccountMenu />
      </div>
      <RootNav />

      {children}
    </div>
  );
}
