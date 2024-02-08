"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArticleStatus, Prisma } from "@prisma/client";

import { PlusIcon } from "lucide-react";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Loading } from "~/components/ui/loading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { slugString } from "~/lib/validations/common";
import CreateCategoryButton from "../../categories/create-category-button";
import { ResponseError, handleError } from "~/lib/errors";
import { useRouter } from "next/navigation";
import SubmitButton from "~/components/submit-button";

const schema = z.object({
  categoryId: z.string(),
  slug: slugString,
  description: z.string(),
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
                  }),
                }
              );
              if (!response.ok) {
                throw new ResponseError("Bad fetch response", response);
              }

              router.replace(`/dashboard/${article.blog.slug}`);
            } catch (error) {
              if (error instanceof ResponseError) {
                if (error.response.status === 409) {
                  form.setError("slug", {
                    message: `이미 존재하는 슬러그입니다.`,
                  });
                }
                return;
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

          <SubmitButton
            formState={form.formState}
            allowNoChange
            className="ml-auto"
          >
            발행
          </SubmitButton>
        </form>
      </Form>
    </div>
  );
}
