"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button, buttonVariants } from "~/components/ui/button";
import { Loading } from "~/components/ui/loading";
import { handleError } from "~/lib/errors";
import { deleteBlog } from "~/services/blog";

export default function DeleteBlogButton({ blogId }: { blogId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button type="button">삭제</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>정말 블로그를 삭제할까요?</AlertDialogTitle>
          <AlertDialogDescription>
            진행 시 블로그와 관련된 모든 데이터가 삭제되며 돌이킬 수 없어요.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction
            type="button"
            className={buttonVariants({ variant: "destructive" })}
            disabled={isLoading}
            onClick={async (event) => {
              event.preventDefault();
              try {
                setIsLoading(true);
                await deleteBlog(blogId);
                router.replace("/dashboard");
              } catch (error) {
                handleError(error);
              } finally {
                setIsLoading(false);
              }
            }}
          >
            {isLoading ? <Loading /> : "삭제"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
