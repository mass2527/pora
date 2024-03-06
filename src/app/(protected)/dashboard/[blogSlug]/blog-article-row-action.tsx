"use client";

import { Prisma } from "@prisma/client";
import { MoreHorizontal } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button, buttonVariants } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "~/components/ui/dropdown-menu";
import NewTabLink from "~/components/new-tab-link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { useState } from "react";
import { deleteArticle } from "./actions";
import { handleError, throwServerError } from "~/lib/errors";

export default function BlogArticleRowAction({
  article,
}: {
  article: Prisma.ArticleGetPayload<{ include: { blog: true } }>;
}) {
  const path = usePathname();
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  return (
    <>
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
            <NewTabLink
              href={`/dashboard/${article.blog.slug}/${article.slug}/edit`}
            >
              수정
            </NewTabLink>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive"
            onSelect={() => setIsDeleteAlertOpen(true)}
          >
            삭제
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              정말 &quot;{article.title}&quot; 아티클을 삭제할까요?
            </AlertDialogTitle>
            <AlertDialogDescription>
              진행 시 작성한 아티클은 삭제되며 돌이킬 수 없어요.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                type="button"
                className={buttonVariants({ variant: "destructive" })}
                onClick={async () => {
                  try {
                    const response = await deleteArticle(article.id, path);
                    if (response.status === "failure") {
                      throwServerError(response);
                    }
                  } catch (error) {
                    handleError(error);
                  }
                }}
              >
                삭제
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
