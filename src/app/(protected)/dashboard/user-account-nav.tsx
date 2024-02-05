"use client";

import { signOut } from "next-auth/react";
import React, { ComponentProps } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import UserAvatar from "~/components/user-avatar";

export default function UserAccountNav({
  user,
}: {
  user: ComponentProps<typeof UserAvatar>["user"];
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" aria-label="사용자 아바타">
          <UserAvatar user={user} className="w-8 h-8" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col font-normal">
            <span className="text-sm">{user.name}</span>
            <span className="text-sm text-zinc-500">{user.email}</span>
          </div>
        </DropdownMenuLabel>
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
