"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Blog } from "@prisma/client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import UpdateBlogForm from "./update-blog-form";
import { updateBlogSchema } from "~/lib/validations/blog";

export default function UpdateBlogDescriptionForm({ blog }: { blog: Blog }) {
  const form = useForm<z.infer<typeof updateBlogSchema>>({
    resolver: zodResolver(updateBlogSchema),
    defaultValues: {
      description: blog.description ?? "",
    },
  });

  return (
    <UpdateBlogForm form={form} blog={blog}>
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </UpdateBlogForm>
  );
}
