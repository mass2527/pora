"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import AlertDialog from "~/components/alert-dialog";

import { Button, buttonVariants } from "~/components/ui/button";
import { Loading } from "~/components/ui/loading";
import { handleError } from "~/lib/errors";
import { deleteBlog } from "~/services/blog";

export default function DeleteBlogButton({ blogId }: { blogId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  return (
    <AlertDialog
      trigger={
        <Button type="button" variant="destructive">
          삭제
        </Button>
      }
      title="정말 블로그를 삭제할까요?"
      description="진행 시 블로그와 관련된 모든 데이터가 삭제되며 돌이킬 수 없어요."
      action={
        <Button
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
        </Button>
      }
    />
  );
}
