"use client";

import { Blog } from "@prisma/client";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import SubmitButton from "~/components/submit-button";
import { Form } from "~/components/ui/form";

import { ResponseError, handleError } from "~/lib/errors";

export default function UpdateBlogForm<T extends FieldValues>({
  blog,
  children,
  form,
}: {
  blog: Blog;
  children: ReactNode;
  form: UseFormReturn<T>;
}) {
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
            toast.success("블로그 정보가 수정되었어요.");
          } catch (error) {
            handleError(error);
          }
        })}
      >
        {children}
        <SubmitButton formState={form.formState} className="mr-auto">
          수정
        </SubmitButton>
      </form>
    </Form>
  );
}
