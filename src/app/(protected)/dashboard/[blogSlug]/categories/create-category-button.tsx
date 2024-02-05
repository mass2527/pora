"use client";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogHeader,
  DialogFooter,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "~/components/ui/dialog";
import { ReactNode, useEffect, useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Input } from "~/components/ui/input";
import { Loading } from "~/components/ui/loading";
import { ResponseError, handleError } from "~/lib/errors";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema } from "~/lib/validations/category";

export default function CreateCategoryButton({
  blogId,
  trigger = <Button type="button">새 카테고리</Button>,
}: {
  blogId: string;
  trigger?: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
  });

  const {
    reset,
    formState: { isSubmitSuccessful },
  } = form;
  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>새 카테고리</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            className="flex flex-col gap-2"
            onSubmit={form.handleSubmit(async (values) => {
              try {
                const response = await fetch(
                  `/api/blogs/${blogId}/categories`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(values),
                  }
                );
                if (!response.ok) {
                  throw new ResponseError("Bad fetch response", response);
                }

                setIsOpen(false);
                router.refresh();
              } catch (error) {
                if (error instanceof ResponseError) {
                  if (error.response.status === 409) {
                    const json = (await error.response.json()) as {
                      target: [string, keyof z.infer<typeof categorySchema>];
                    };
                    const [, name] = json.target;

                    form.setError(name, {
                      message: `이미 존재하는 ${
                        {
                          name: "이름",
                          slug: "슬러그",
                        }[name]
                      }입니다.`,
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
                  <FormLabel>이름*</FormLabel>
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
                  <FormLabel>슬러그*</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? <Loading /> : "생성"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
