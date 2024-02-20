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
import { ReactNode, useState } from "react";
import { z } from "zod";
import { Input } from "~/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCategorySchema } from "~/lib/validations/category";
import FormSubmitButton from "~/components/form-submit-button";
import { createBlogCategory } from "./actions";
import { toast } from "sonner";
import { ServerError, handleError, throwServerError } from "~/lib/errors";
import { usePathname } from "next/navigation";

export default function CreateBlogCategoryButton({
  blogId,
  trigger = <Button type="button">새 카테고리</Button>,
}: {
  blogId: string;
  trigger?: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<z.infer<typeof createCategorySchema>>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });
  const pathname = usePathname();

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
                const response = await createBlogCategory(
                  blogId,
                  values,
                  pathname
                );
                if (response.status === "failure") {
                  throwServerError(response);
                }

                form.reset();
                setIsOpen(false);
              } catch (error) {
                if (error instanceof ServerError) {
                  if (error.status === 409) {
                    toast.error("이름 또는 슬러그가 이미 존재해요.");
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
                    <Input {...field} />
                  </FormControl>
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

            <DialogFooter>
              <FormSubmitButton formState={form.formState}>
                생성
              </FormSubmitButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
