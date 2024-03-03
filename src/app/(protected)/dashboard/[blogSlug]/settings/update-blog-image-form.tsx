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
import { handleError, throwServerError } from "~/lib/errors";
import { usePathname } from "next/navigation";
import SingleImageUploader from "~/components/single-image-uploader";
import { imageFileSchema } from "~/lib/validations/common";
import { uploadFileToS3 } from "~/services/file";
import { updateBlog } from "./actions";
import { deleteFileFromS3 } from "~/actions/file";

const schema = z.object({
  image: imageFileSchema.optional(),
});

export default function UpdateBlogImageForm({ blog }: { blog: Blog }) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });
  const pathname = usePathname();

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-2"
        onSubmit={form.handleSubmit(async (values) => {
          let imageUrl: string | undefined;
          const imageFile = values.image;
          if (imageFile) {
            const objectUrl = await uploadFileToS3(imageFile);
            imageUrl = objectUrl;
          }

          try {
            const response = await updateBlog(
              blog.id,
              {
                image: imageUrl ?? (blog.image ? null : undefined),
              },
              pathname
            );
            if (response.status === "failure") {
              throwServerError(response);
            }

            const hasDeleted = !imageUrl && blog.image;
            const hasUpdated =
              imageUrl && blog.image && imageUrl !== blog.image;
            if ((hasDeleted || hasUpdated) && blog.image) {
              deleteFileFromS3(blog.image);
            }

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
