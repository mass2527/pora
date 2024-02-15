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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { ResponseError, handleError } from "~/lib/errors";

const MAX_LENGTH = 32;
const invalidMessage = `최대 ${MAX_LENGTH}글자 이하 입력해 주세요.`;

const schema = z.object({
  jobPosition: z
    .string()
    .min(1, { message: "최소 1글자 이상 입력해 주세요." })
    .max(MAX_LENGTH, { message: invalidMessage }),
});

export default function UpdateUserJobPositionForm({
  user,
}: {
  user: Pick<User, "jobPosition" | "id">;
}) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      jobPosition: user.jobPosition ?? undefined,
    },
  });
  const router = useRouter();

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-2"
        onSubmit={form.handleSubmit(async (values) => {
          try {
            const response = await fetch(`/api/users/${user.id}`, {
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
            toast.success("사용자 직책이 수정되었어요.");
            const updatedUser = (await response.json()) as User;
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
                <Input {...field} maxLength={MAX_LENGTH} />
              </FormControl>
              <FormDescription>{invalidMessage}</FormDescription>
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
