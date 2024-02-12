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
import { updateBlogSchema } from "~/lib/validations/blog";
import { toast } from "sonner";
import SubmitButton from "~/components/submit-button";
import { ResponseError, handleError } from "~/lib/errors";
import { useRouter } from "next/navigation";

export default function UpdateBlogNameForm({ blog }: { blog: Blog }) {
  const form = useForm<z.infer<typeof updateBlogSchema>>({
    resolver: zodResolver(updateBlogSchema),
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
        <SubmitButton formState={form.formState} className="mr-auto">
          수정
        </SubmitButton>
      </form>
    </Form>
  );
}