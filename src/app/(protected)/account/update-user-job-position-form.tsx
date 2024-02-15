"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
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
import { handleError } from "~/lib/errors";
import { updateUserSchema } from "~/lib/validations/user";
import { updateUser } from "~/services/user";

export default function UpdateUserJobPositionForm({
  user,
}: {
  user: Pick<User, "jobPosition" | "id">;
}) {
  const form = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      jobPosition: user.jobPosition ?? "",
    },
  });
  const router = useRouter();

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-2"
        onSubmit={form.handleSubmit(async (values) => {
          try {
            const updatedUser = await updateUser(user.id, values);
            router.refresh();
            toast.success("사용자 직책이 수정되었어요.");
            form.reset({
              jobPosition: updatedUser.jobPosition ?? undefined,
            });
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
  );
}
