"use client";

import { useSelectedLayoutSegments } from "next/navigation";
import React from "react";
import Nav, { NavProps } from "~/components/nav";

const LINKS: NavProps["links"] = [
  { href: "/dashboard", name: "대시보드" },
  { href: "/account", name: "계정" },
] as const;

export default function RootNav() {
  const selectedLayoutSegments = useSelectedLayoutSegments();
  if (selectedLayoutSegments.length > 1) {
    return null;
  }

  return (
    <div className="border-b">
      <Nav links={LINKS} />
    </div>
  );
}
