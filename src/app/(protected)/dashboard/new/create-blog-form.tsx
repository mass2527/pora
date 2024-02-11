"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Blog } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import SubmitButton from "~/components/submit-button";
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
import { ResponseError, handleError } from "~/lib/errors";
import {
  BLOG_DESCRIPTION_MAX_LENGTH,
  BLOG_NAME_MAX_LENGTH,
  createBlogSchema,
} from "~/lib/validations/blog";
import {
  SLUG_STRING_REGEX_MESSAGE,
  getMaxLengthMessage,
} from "~/lib/validations/common";

export default function CreateBlogForm() {
  const form = useForm<z.infer<typeof createBlogSchema>>({
    resolver: zodResolver(createBlogSchema),
  });
  const router = useRouter();

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-2"
        onSubmit={form.handleSubmit(async (values) => {
          try {
            const response = await fetch("/api/blogs", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(values),
            });
            if (!response.ok) {
              throw new ResponseError("Bad fetch response", response);
            }

            const newBlog = (await response.json()) as Blog;
            router.replace(`/dashboard/${newBlog.slug}`);
          } catch (error) {
            if (error instanceof ResponseError) {
              if (error.response.status === 409) {
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
                <Input
                  placeholder="내 블로그"
                  maxLength={BLOG_NAME_MAX_LENGTH}
                  autoFocus
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {getMaxLengthMessage(BLOG_NAME_MAX_LENGTH)}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>주소*</FormLabel>
              <div className="flex items-center gap-1">
                <span className="text-sm text-zinc-500">
                  {process.env.NEXT_PUBLIC_DOMAIN_NAME}/
                </span>
                <FormControl>
                  <Input placeholder="my-blog" {...field} />
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
                <Textarea
                  placeholder="내 블로그"
                  maxLength={BLOG_DESCRIPTION_MAX_LENGTH}
                  autoFocus
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {getMaxLengthMessage(BLOG_DESCRIPTION_MAX_LENGTH)}
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
          <SubmitButton formState={form.formState}>생성</SubmitButton>
        </div>
      </form>
    </Form>
  );
}
