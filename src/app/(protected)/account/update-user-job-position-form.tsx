"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import FormSubmitButton from "~/components/form-submit-button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { handleError, throwServerError } from "~/lib/errors";
import { updateUserSchema } from "~/lib/validations/user";
import { updateUser } from "./actions";
import { useUser } from "~/lib/auth";
import { Skeleton } from "~/components/ui/skeleton";
import Card from "~/components/card";

export default function UpdateUserJobPositionForm() {
  const user = useUser();
  const form = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      jobPosition: user?.jobPosition ?? "",
    },
  });
  const pathname = usePathname();

  if (!user) {
    return <Skeleton className="h-60" />;
  }

  return (
    <Card
      title="직책"
      description="어떤 일을 하고 있는지 입력해 주세요."
      content={
        <Form {...form}>
          <form
            className="flex flex-col gap-2"
            onSubmit={form.handleSubmit(async (values) => {
              try {
                const response = await updateUser(values, pathname);
                if (response.status === "failure") {
                  throwServerError(response);
                }

                toast.success("사용자 직책이 수정되었어요.");
              } catch (error) {
                handleError(error);
              }
            })}
          >
            <FormField
              control={form.control}
              name="jobPosition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>직책</FormLabel>
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
      }
    />
  );
}
