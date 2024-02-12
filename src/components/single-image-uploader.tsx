import { X } from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";
import { ACCEPTED_IMAGE_TYPES } from "~/lib/constants";
import { invariant } from "~/lib/utils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Image from "next/image";

interface ImageUploaderProps {
  accept?: string;
  value?: string | null;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export default function SingleImageUploader({
  accept = ACCEPTED_IMAGE_TYPES.join(","),
  value = null,
  onChange,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState(value);

  return (
    <div>
      <Input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(event) => {
          onChange?.(event);
          const fileList = event.target.files;
          if (!fileList) {
            return;
          }

          const file = fileList[0];
          if (!file) {
            return;
          }

          if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
          }
          const url = URL.createObjectURL(file);
          setPreviewUrl(url);
        }}
      />

      {previewUrl ? (
        <div className="max-w-[150px] max-h-[150px] relative">
          <Image
            src={previewUrl}
            alt="test"
            width={150}
            height={150}
            className="rounded-md"
          />
          <button
            type="button"
            className="absolute rounded-full p-1 right-2 top-2 bg-background border"
            onClick={() => {
              setPreviewUrl("");
            }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            const inputElement = inputRef.current;
            invariant(inputElement);

            inputElement.click();
          }}
        >
          이미지 선택
        </Button>
      )}
    </div>
  );
}
