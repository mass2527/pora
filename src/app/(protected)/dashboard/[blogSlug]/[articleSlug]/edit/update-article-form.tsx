"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArticleStatus, Prisma } from "@prisma/client";

import { PlusIcon } from "lucide-react";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
  FormDescription,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { imageFileSchema, slugStringSchema } from "~/lib/validations/common";
import CreateCategoryButton from "../../categories/create-category-button";
import { ResponseError, handleError } from "~/lib/errors";
import { useRouter } from "next/navigation";
import SubmitButton from "~/components/submit-button";
import { MAX_IMAGE_SIZE_IN_MEGA_BYTES } from "~/lib/constants";
import { PutBlobResult } from "@vercel/blob";
import SingleImageUploader from "~/components/single-image-uploader";
import { uploadFile } from "~/services/file";

const schema = z.object({
  categoryId: z.string(),
  slug: slugStringSchema,
  description: z.string(),
  image: imageFileSchema.optional(),
});

export default function UpdateArticleForm({
  article,
}: {
  article: Prisma.ArticleGetPayload<{
    include: { blog: { include: { categories: true } } };
  }>;
}) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      categoryId: article.categoryId ?? undefined,
      slug: article.slug,
      description: article.description ?? undefined,
    },
  });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  return (
    <div>
      <CreateCategoryButton
        blogId={article.blogId}
        trigger={
          <button ref={buttonRef} type="button" className="hidden">
            새 카테고리
          </button>
        }
      />
      <Form {...form}>
        <form
          className="flex flex-col gap-2"
          onSubmit={form.handleSubmit(async (values) => {
            try {
              let newImageUrl: string | undefined;
              const imageFile = values.image;
              if (imageFile) {
                const { url } = await uploadFile(imageFile);
                newImageUrl = url;
              }

              const response = await fetch(
                `/api/blogs/${article.blogId}/articles/${article.id}`,
                {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    ...values,
                    title: article.title,
                    draftTitle: article.title,
                    htmlContent: article.htmlContent,
                    jsonContent: article.jsonContent,
                    draftJsonContent: article.jsonContent,
                    status: ArticleStatus.PUBLISHED,
                    image: newImageUrl ?? article.image ? null : undefined,
                  }),
                }
              );
              if (!response.ok) {
                throw new ResponseError("Bad fetch response", response);
              }

              const hasDeleted = !newImageUrl && article.image;
              const hasUpdated =
                newImageUrl && article.image && newImageUrl !== article.image;
              if (hasDeleted || hasUpdated) {
                fetch(`/api/upload?url=${article.image}`, {
                  method: "DELETE",
                });
              }
              router.replace(`/dashboard/${article.blog.slug}`);
            } catch (error) {
              if (error instanceof ResponseError) {
                if (error.response.status === 409) {
                  form.setError("slug", {
                    message: `이미 존재하는 슬러그입니다.`,
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
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>카테고리*</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="카테고리 선택" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {article.blog.categories.map((category) => {
                      return (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <button
            className="text-blue-500 text-sm flex items-center gap-1"
            type="button"
            onClick={() => buttonRef.current?.click()}
          >
            <PlusIcon className="w-4 h-4" /> 새 카테고리
          </button>

          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>슬러그*</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
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
                  <Input {...field} />
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
                    value={article.image}
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (!file) {
                        return;
                      }

                      field.onChange({ target: { value: file } });
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

          <SubmitButton formState={form.formState} className="ml-auto">
            발행
          </SubmitButton>
        </form>
      </Form>
    </div>
  );
}
