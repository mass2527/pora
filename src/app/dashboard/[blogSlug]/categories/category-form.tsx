import React, { ReactNode } from "react";
import { UseFormProps, useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "~/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Loading } from "~/components/ui/loading";
import { Button } from "~/components/ui/button";

const schema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
});

export default function CategoryForm({
  onSubmit,
  defaultValues,
  action,
}: {
  onSubmit: (values: z.infer<typeof schema>) => void;
  defaultValues?: UseFormProps<z.infer<typeof schema>>["defaultValues"];
  action: ReactNode;
}) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-2"
        onSubmit={form.handleSubmit(onSubmit)}
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

        <Button
          type="submit"
          disabled={form.formState.isLoading || form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? <Loading /> : "생성"}
        </Button>
      </form>
    </Form>
  );
}
