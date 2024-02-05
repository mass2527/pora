"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { Loading } from "~/components/ui/loading";
import { ResponseError, handleError } from "~/lib/errors";

export default function DeleteBlogButton({ blogId }: { blogId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  return (
    <Button
      variant="destructive"
      onClick={async () => {
        try {
          setIsLoading(true);
          const response = await fetch(`/api/blogs/${blogId}`, {
            method: "DELETE",
          });
          setIsLoading(false);
          if (!response.ok) {
            throw new ResponseError("Bad fetch response", response);
          }

          router.replace("/dashboard");
        } catch (error) {
          handleError(error);
        }
      }}
      disabled={isLoading}
    >
      {isLoading ? <Loading /> : "삭제"}
    </Button>
  );
}
