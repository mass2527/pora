"use client";

import { Prisma } from "@prisma/client";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "~/components/ui/dropdown-menu";
import { ResponseError, handleError } from "~/lib/errors";

export default function ArticleRowAction({
  article,
}: {
  article: Prisma.ArticleGetPayload<{ include: { blog: true } }>;
}) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          aria-label="메뉴 열기"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <Link href={`/dashboard/${article.blog.slug}/${article.slug}/edit`}>
            수정
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            try {
              const response = await fetch(
                `/api/blogs/${article.blogId}/articles/${article.id}`,
                {
                  method: "DELETE",
                }
              );
              if (!response.ok) {
                throw new ResponseError("Bad fetch response", response);
              }

              router.refresh();
            } catch (error) {
              handleError(error);
            }
          }}
        >
          삭제
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
