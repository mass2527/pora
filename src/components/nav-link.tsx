"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { ComponentProps } from "react";
import { cn } from "~/lib/utils";
import { buttonVariants } from "./ui/button";

export default function NavLink({
  href,
  className,
  ...props
}: ComponentProps<typeof Link>) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={cn(
        buttonVariants({ variant: "link" }),
        "text-zinc-500 hover:no-underline hover:text-primary",
        {
          "text-primary underline hover:underline": pathname === href,
        },
        className
      )}
      {...props}
    />
  );
}
