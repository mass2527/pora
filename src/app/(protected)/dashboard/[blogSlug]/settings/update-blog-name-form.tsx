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
import { Input } from "~/components/ui/input";
import { updateBlogCommonSchema } from "~/lib/validations/blog";
import { toast } from "sonner";
import FormSubmitButton from "~/components/form-submit-button";
import { handleError } from "~/lib/errors";
import { useRouter } from "next/navigation";
import { updateBlog } from "~/services/blog";

export default function UpdateBlogNameForm({ blog }: { blog: Blog }) {
  const form = useForm<z.infer<typeof updateBlogCommonSchema>>({
    resolver: zodResolver(updateBlogCommonSchema),
    defaultValues: {
      name: blog.name,
    },
  });
  const router = useRouter();

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-2"
        onSubmit={form.handleSubmit(async (values) => {
          try {
            await updateBlog(blog.id, values);
            router.refresh();
            toast.success("이름이 수정되었어요.");
          } catch (error) {
            handleError(error);
          }
        })}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} />
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
