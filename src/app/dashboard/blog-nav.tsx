"use client";

import { Blog } from "@prisma/client";
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import React from "react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { cn } from "~/lib/utils";

export default function BlogNav({ blogs }: { blogs: Blog[] }) {
  const selectedBlogSlug = useSelectedLayoutSegment();

  const selectedBlog = blogs.find((blog) => blog.slug === selectedBlogSlug);
  if (!selectedBlog) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          {selectedBlog?.name} <ChevronsUpDown className="w-4 h-4 ml-2" />{" "}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 text-sm">
        <DropdownMenuLabel>블로그</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {blogs.map((blog) => {
          const isSelectedBlog = blog.slug === selectedBlogSlug;

          return (
            <DropdownMenuItem key={blog.id} asChild>
              <Link
                href={`/dashboard/${blog.slug}`}
                className={cn("hover:bg-accent/50 cursor-pointer", {
                  "bg-accent": isSelectedBlog,
                })}
              >
                <div className="w-full flex justify-between items-center">
                  <span className="text-sm">{blog.name}</span>

                  {isSelectedBlog && <Check className="w-4 h-4" />}
                </div>
              </Link>
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/dashboard/new">
            <PlusCircle className="w-4 h-4 mr-2 text-blue-500" />새 블로그
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
