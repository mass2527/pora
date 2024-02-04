"use client";

import { Button } from "~/components/ui/button";
import { Loading } from "~/components/ui/loading";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { ResponseError, handleError } from "~/lib/errors";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "~/components/ui/select";
import { Input } from "~/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ARTICLE_STATUS } from "~/lib/constants";
import Editor from "~/components/editor";
import { debounce } from "~/lib/debounce";
import { Editor as EditorType } from "@tiptap/react";
import { slugString } from "~/lib/validations/common";
import CreateCategoryButton from "../../categories/create-category-button";
import { useRef } from "react";
import { PlusIcon } from "lucide-react";

const schema = z.object({
  categoryId: z.string(),
  slug: slugString,
  title: z.string().min(1),
  description: z.string(),
  status: z.enum(Object.values(ARTICLE_STATUS) as [string, ...string[]]),
});

export default function EditArticleForm({
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
      title: article.title,
      description: article.description ?? undefined,
      status: ARTICLE_STATUS.published,
    },
  });
  const router = useRouter();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const updateArticle = debounce(async ({ editor }: { editor: EditorType }) => {
    const jsonContent = JSON.stringify(editor.getJSON());
    const htmlContent = editor.getHTML();

    try {
      const response = await fetch(
        `/api/blogs/${article.blogId}/articles/${article.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jsonContent,
            htmlContent,
          }),
        }
      );
      if (!response.ok) {
        throw new ResponseError("Bad fetch request", response);
      }
    } catch (error) {
      handleError(error);
    }
  }, 750);

  return (
    <Form {...form}>
      <CreateCategoryButton
        blogId={article.blogId}
        trigger={
          <button ref={buttonRef} type="button" className="hidden">
            새 카테고리
          </button>
        }
      />
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(async (values) => {
          try {
            const response = await fetch(
              `/api/blogs/${article.blog.id}/articles/${article.id}`,
              {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
              }
            );
            if (!response.ok) {
              throw new ResponseError("Bad fetch response", response);
            }

            router.refresh();
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
              <FormLabel>카테고리</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              <button
                className="text-blue-500 text-sm flex items-center gap-1"
                type="button"
                onClick={() => buttonRef.current?.click()}
              >
                <PlusIcon className="w-4 h-4" /> 새 카테고리
              </button>
            </FormItem>
          )}
        />

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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>제목*</FormLabel>
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

        <div className="border border-input rounded-md w-full">
          <Editor
            content={JSON.parse(article.jsonContent)}
            onUpdate={updateArticle}
            onBlur={updateArticle}
          />
        </div>

        <Button
          className="ml-auto"
          type="submit"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? <Loading /> : "저장"}
        </Button>
      </form>
    </Form>
  );
}
