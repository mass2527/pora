"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Prisma } from "@prisma/client";
import { useRouter } from "next/navigation";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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
import { Textarea } from "~/components/ui/textarea";
import { ResponseError, handleError } from "~/lib/errors";
import { articleSchema } from "~/lib/validations/article";

export default function CreateArticleForm({
  blog,
}: {
  blog: Prisma.BlogGetPayload<{ include: { categories: true } }>;
}) {
  const form = useForm<z.infer<typeof articleSchema>>({
    resolver: zodResolver(articleSchema),
  });
  const router = useRouter();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (values) => {
          try {
            const response = await fetch(`/api/blogs/${blog.id}/articles`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(values),
            });
            if (!response.ok) {
              throw new ResponseError("Bad fetch response", response);
            }

            router.replace(`/dashboard/${blog.slug}`);
          } catch (error) {
            if (error instanceof ResponseError) {
              if (error.response.status === 409) {
                const json = (await error.response.json()) as {
                  target: [string, keyof z.infer<typeof articleSchema>];
                };
                const [, name] = json.target;

                form.setError(name, {
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
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="카테고리를 선택해 주세요." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {blog.categories.map((category) => {
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

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>내용*</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2 ml-auto">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? <Loading /> : "생성"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
