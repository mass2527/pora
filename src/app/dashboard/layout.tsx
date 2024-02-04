import React, { ReactNode } from "react";
import { getUser } from "~/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import UserAccountNav from "./user-account-nav";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getUser();
  if (!user) {
    notFound();
  }

  return (
    <div>
      <div className="flex justify-between items-center p-4">
        <div>
          <Link
            href="/dashboard"
            className="text-xl font-semibold tracking-tight"
          >
            Pora
          </Link>
        </div>

        <UserAccountNav
          user={{
            name: user.name || null,
            email: user.email || null,
            image: user.image || null,
          }}
        />
      </div>
      {children}
    </div>
  );
}
