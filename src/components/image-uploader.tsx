import { X } from "lucide-react";
import { useState, useRef } from "react";
import { ACCEPTED_IMAGE_TYPES } from "~/lib/constants";
import { invariant } from "~/lib/utils";
import { Button } from "./ui/button";
import { InputProps, Input } from "./ui/input";
import Image from "next/image";

interface ImageUploaderProps extends Omit<InputProps, "type" | "onChange"> {
  onFileListChange: (fileList: FileList | null) => void;
}

export default function ImageUploader({
  accept = ACCEPTED_IMAGE_TYPES.join(","),
  onFileListChange,
  multiple,
  ...props
}: ImageUploaderProps) {
  const [currentFileList, setCurrentFileList] = useState<FileList | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <Input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(event) => {
          const fileList = event.target.files;
          onFileListChange(fileList);
          if (!fileList) {
            return;
          }

          setCurrentFileList(fileList);
        }}
        multiple={multiple}
        {...props}
      />

      <Button
        type="button"
        variant="secondary"
        onClick={() => {
          const inputElement = inputRef.current;
          invariant(inputElement);

          inputElement.click();
        }}
      >
        이미지 업로드
      </Button>

      <div className="min-h-[150px] py-4">
        {currentFileList && currentFileList?.length > 0 ? (
          <div className="flex">
            {[...currentFileList].map((file) => {
              const url = URL.createObjectURL(file);

              return (
                <div
                  key={file.name}
                  className="max-w-[150px] max-h-[150px] relative"
                >
                  <Image
                    src={url}
                    alt={file.name}
                    width={150}
                    height={150}
                    className="rounded-md"
                  />

                  <button
                    type="button"
                    className="p-1 absolute right-2 top-2 bg-background text-foreground rounded-full"
                    aria-label={`${file.name} 제거`}
                    onClick={() => {
                      URL.revokeObjectURL(url);
                      const dataTransfer = new DataTransfer();
                      const remainFiles = [...currentFileList].filter(
                        ({ lastModified }) => lastModified !== file.lastModified
                      );
                      remainFiles.forEach((file) => {
                        dataTransfer.items.add(file);
                      });

                      const inputElement = inputRef.current;
                      invariant(inputElement);
                      if (multiple) {
                        if (dataTransfer.files.length === 0) {
                          inputElement.value = "";
                        }
                      } else {
                        inputElement.value = "";
                      }

                      const updatedFileList =
                        dataTransfer.files.length > 0
                          ? dataTransfer.files
                          : null;
                      onFileListChange(updatedFileList);
                      setCurrentFileList(updatedFileList);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}
