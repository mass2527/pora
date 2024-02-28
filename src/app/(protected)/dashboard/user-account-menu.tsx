"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import UserAvatar from "~/components/user-avatar";
import { useAuthenticatedUser } from "~/lib/auth";

export default function UserAccountMenu() {
  const user = useAuthenticatedUser();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" aria-label="메뉴 열기">
          <UserAvatar
            user={{ name: user.name ?? null, image: user.image ?? null }}
            className="w-8 h-8"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col font-normal">
            <span className="text-sm">{user.name}</span>
            <span className="text-sm text-zinc-500">{user.email}</span>
          </div>
        </DropdownMenuLabel>{" "}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/dashboard">대시보드</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/account">계정</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={() =>
            signOut({
              callbackUrl: `${window.location.origin}/login`,
            })
          }
        >
          로그아웃
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
