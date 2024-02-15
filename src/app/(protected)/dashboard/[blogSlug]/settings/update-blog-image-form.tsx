"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Blog } from "@prisma/client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";

import { toast } from "sonner";
import FormSubmitButton from "~/components/form-submit-button";
import { ResponseError, handleError } from "~/lib/errors";
import { useRouter } from "next/navigation";
import SingleImageUploader from "~/components/single-image-uploader";
import { imageFileSchema } from "~/lib/validations/common";
import { deleteFile, uploadFile } from "~/services/file";
import { tsFetch } from "~/lib/ts-fetch";

const schema = z.object({
  image: imageFileSchema.optional(),
});

export default function UpdateBlogImageForm({ blog }: { blog: Blog }) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      image: undefined,
    },
  });
  const router = useRouter();

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-2"
        onSubmit={form.handleSubmit(async (values) => {
          let newImageUrl: string | undefined;
          const imageFile = values.image;
          if (imageFile) {
            const { url } = await uploadFile(imageFile);
            newImageUrl = url;
          }

          try {
            const response = await tsFetch(`/api/blogs/${blog.id}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                image: newImageUrl ?? (blog.image ? null : undefined),
              }),
            });
            if (!response.ok) {
              throw new ResponseError("Bad fetch response", response);
            }

            const hasDeleted = !newImageUrl && blog.image;
            const hasUpdated =
              newImageUrl && blog.image && newImageUrl !== blog.image;
            if ((hasDeleted || hasUpdated) && blog.image) {
              deleteFile(blog.image);
            }

            router.refresh();
            toast.success("이미지가 수정되었어요.");
          } catch (error) {
            handleError(error);
          }
        })}
      >
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <SingleImageUploader
                  value={blog.image}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (!file) {
                      return;
                    }

                    field.onChange({ target: { value: file } });
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormSubmitButton formState={form.formState} className="mr-auto">
          수정
        </FormSubmitButton>
      </form>
    </Form>
  );
}
