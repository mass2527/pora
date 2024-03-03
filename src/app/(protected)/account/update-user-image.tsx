"use client";

import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { Loading } from "~/components/ui/loading";
import UserAvatar from "~/components/user-avatar";
import { cn } from "~/lib/utils";
import { Skeleton } from "~/components/ui/skeleton";
import Card from "~/components/card";
import { deleteFileFromS3 } from "~/actions/file";
import { updateUser } from "./actions";
import { handleError, throwServerError } from "~/lib/errors";
import { toast } from "sonner";
import { uploadFileToS3 } from "~/services/file";
import { useSession } from "next-auth/react";

export default function UpdateUserImage() {
  const session = useSession();
  const user = session.data?.user;
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  if (!user) {
    return <Skeleton className="h-52" />;
  }

  return (
    <Card
      title="이미지"
      description="아바타를 클릭해 변경할 이미지 파일을 선택해 주세요."
      content={
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
              user={{ name: user.name ?? null, image: user.image ?? null }}
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
                const prevUserImage = user.image;
                const objectUrl = await uploadFileToS3(file);
                const response = await updateUser(
                  {
                    image: objectUrl,
                  },
                  pathname
                );
                if (response.status === "failure") {
                  throwServerError(response);
                }
                await session.update();
                toast.success("이미지가 수정되었어요.");

                if (prevUserImage) {
                  deleteFileFromS3(prevUserImage);
                }
              } catch (error) {
                handleError(error);
              } finally {
                setIsLoading(false);
              }
            }}
          />
        </div>
      }
    />
  );
}
