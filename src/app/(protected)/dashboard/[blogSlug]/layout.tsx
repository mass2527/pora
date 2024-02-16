import React, { ReactNode } from "react";
import Nav, { NavProps } from "~/components/nav";

const LINKS: NavProps["links"] = [
  {
    href: "",
    name: "아티클",
  },
  {
    href: "/categories",
    name: "카테고리",
  },
  {
    href: "/settings",
    name: "설정",
  },
] as const;

export default function BlogLayout({
  params,
  children,
}: {
  params: { blogSlug: string };
  children: ReactNode;
}) {
  const links = LINKS.map((link) => ({
    ...link,
    href: `/dashboard/${params.blogSlug}${link.href}`,
  }));

  return (
    <div>
      <div className="border-b">
        <Nav links={links} />
      </div>
      {children}
    </div>
  );
}
