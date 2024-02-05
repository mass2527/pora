"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Blog } from "@prisma/client";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "~/components/ui/button";
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
import { Loading } from "~/components/ui/loading";
import { ResponseError, handleError } from "~/lib/errors";
import { slugString } from "~/lib/validations/common";

const schema = z.object({
  name: z.string(),
  slug: slugString,
});

export default function UpdateBlogForm({ blog }: { blog: Blog }) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: blog.name,
      slug: blog.slug,
    },
  });
  const router = useRouter();

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-2"
        onSubmit={form.handleSubmit(async (values) => {
          try {
            const response = await fetch(`/api/blogs/${blog.id}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(values),
            });
            if (!response.ok) {
              throw new ResponseError("Bad fetch response", response);
            }

            if (blog.slug !== values.slug) {
              router.replace(`/dashboard/${values.slug}/settings`);
            } else {
              router.refresh();
            }
            toast.success("블로그 정보가 수정되었어요.");
          } catch (error) {
            if (error instanceof ResponseError) {
              if (error.response.status === 409) {
                form.setError("slug", {
                  message: "이미 존재하는 슬러그입니다.",
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이름</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>슬러그</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="mr-auto"
        >
          {form.formState.isSubmitting ? <Loading /> : "수정"}
        </Button>
      </form>
    </Form>
  );
}
