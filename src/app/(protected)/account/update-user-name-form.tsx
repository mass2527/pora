"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import SubmitButton from "~/components/submit-button";
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

const USER_NAME_MAX_LENGTH = 32;
const userNameInvalidMessage = `최대 ${USER_NAME_MAX_LENGTH}글자 이하 입력해 주세요.`;

const updateUserSchema = z.object({
  name: z
    .string()
    .min(1, { message: "최소 1글자 이상 입력해 주세요." })
    .max(USER_NAME_MAX_LENGTH, { message: userNameInvalidMessage }),
});

export default function UpdateUserNameForm({
  user,
}: {
  user: Pick<User, "name" | "id">;
}) {
  const form = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: user.name ?? undefined,
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
            toast.success("사용자 이름이 수정되었어요.");
            const updatedUser = (await response.json()) as User;
            form.reset({
              name: updatedUser.name ?? undefined,
            });
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
              <FormLabel>이름</FormLabel>
              <FormControl>
                <Input {...field} maxLength={USER_NAME_MAX_LENGTH} />
              </FormControl>
              <FormDescription>{userNameInvalidMessage}</FormDescription>
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
