"use client";

import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { deleteFile, uploadFile } from "~/services/file";
import { Loading } from "~/components/ui/loading";
import UserAvatar from "~/components/user-avatar";
import { ResponseError, handleError } from "~/lib/errors";
import { cn } from "~/lib/utils";
import { tsFetch } from "~/lib/ts-fetch";

export default function UpdateUserImage({
  user,
}: {
  user: Pick<User, "image" | "id" | "name">;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div>
      <button
        type="button"
        disabled={isLoading}
        onClick={() => {
          inputRef.current?.click();
        }}
        className="relative border rounded-full"
        aria-label="사용자 이미지 변경"
      >
        <UserAvatar
          user={user}
          className={cn("w-20 h-20", {
            "opacity-50": isLoading,
          })}
        />
        {isLoading && (
          <Loading className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg"
        className="hidden"
        onChange={async (event) => {
          const file = event.target.files?.[0];
          if (!file) {
            return;
          }

          try {
            setIsLoading(true);
            const { url } = await uploadFile(file);
            const userResponse = await tsFetch(`/api/users/${user.id}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                image: url,
              }),
            });
            if (!userResponse.ok) {
              throw new ResponseError("", userResponse);
            }

            if (user.image) {
              deleteFile(user.image);
            }

            router.refresh();
            toast.success("이미지가 수정되었어요.");
          } catch (error) {
            handleError(error);
          } finally {
            setIsLoading(false);
          }
        }}
      />
    </div>
  );
}
