"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { uploadFileToS3 } from "~/services/file";
import SingleImageUploader from "~/components/single-image-uploader";
import FormSubmitButton from "~/components/form-submit-button";
import { buttonVariants } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { MAX_IMAGE_SIZE_IN_MEGA_BYTES } from "~/lib/constants";
import { ServerError, handleError, throwServerError } from "~/lib/errors";
import { blogSchema } from "~/lib/validations/blog";
import {
  SLUG_STRING_REGEX_MESSAGE,
  imageFileSchema,
} from "~/lib/validations/common";
import { createBlog } from "./actions";

const createBlogSchema = blogSchema.extend({
  image: imageFileSchema.optional(),
});

export default function CreateBlogForm() {
  const form = useForm<z.infer<typeof createBlogSchema>>({
    resolver: zodResolver(createBlogSchema),
    defaultValues: {
      name: "",
      description: "",
      slug: "",
    },
  });
  const router = useRouter();

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-2"
        onSubmit={form.handleSubmit(async (values) => {
          try {
            let imageUrl: string | undefined;
            const imageFile = values.image;
            if (imageFile) {
              const objectUrl = await uploadFileToS3(imageFile);
              imageUrl = objectUrl;
            }

            const response = await createBlog({
              ...values,
              image: imageUrl,
            });
            if (response.status === "failure") {
              throwServerError(response);
            }

            const blog = response.data;
            router.replace(`/dashboard/${blog.slug}`);
          } catch (error) {
            if (error instanceof ServerError) {
              if (error.status === 409) {
                form.setError("slug", {
                  message: "이미 존재하는 슬러그입니다.",
                });
                return;
              }
            }

            handleError(error);
          }
        })}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이름*</FormLabel>
              <FormControl>
                <Input placeholder="내 블로그" autoFocus {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>슬러그*</FormLabel>
              <div className="flex items-center gap-1">
                <span className="text-sm text-zinc-500 whitespace-nowrap">
                  {process.env.NEXT_PUBLIC_DOMAIN_NAME}/
                </span>
                <FormControl>
                  <Input placeholder="my-blog-slug" {...field} />
                </FormControl>
              </div>
              <FormDescription>{SLUG_STRING_REGEX_MESSAGE}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>설명</FormLabel>
              <FormControl>
                <Textarea className="resize-none" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이미지</FormLabel>
              <FormControl>
                <SingleImageUploader
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (!file) {
                      return;
                    }

                    field.onChange({
                      target: { value: file },
                    });
                  }}
                />
              </FormControl>
              <FormDescription>
                최대 {MAX_IMAGE_SIZE_IN_MEGA_BYTES}MB인 이미지를 업로드해
                주세요.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2 ml-auto">
          <Link
            className={buttonVariants({ variant: "outline" })}
            href="/dashboard"
          >
            취소
          </Link>
          <FormSubmitButton formState={form.formState}>생성</FormSubmitButton>
        </div>
      </form>
    </Form>
  );
}
