"use client";

import { Category } from "@prisma/client";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "~/components/ui/dropdown-menu";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { ResponseError, handleError } from "~/lib/errors";
import { toast } from "sonner";
import FormSubmitButton from "~/components/form-submit-button";
import {
  deleteBlogCategory,
  updateBlogCategory,
} from "~/services/blog/category";
import { updateCategorySchema } from "~/lib/validations/category";

export default function BlogCategoryRowAction({
  category,
}: {
  category: Category;
}) {
  const router = useRouter();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const form = useForm<z.infer<typeof updateCategorySchema>>({
    resolver: zodResolver(updateCategorySchema),
    defaultValues: {
      name: category.name,
      slug: category.slug,
    },
  });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
            aria-label="메뉴 열기"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => {
              setIsEditDialogOpen(true);
            }}
          >
            수정
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={async () => {
              try {
                await deleteBlogCategory(category.blogId, category.id);
                router.refresh();
              } catch (error) {
                if (error instanceof ResponseError) {
                  if (error.response.status === 409) {
                    toast.error(
                      "해당 카테고리에 연관된 아티클이 있어 카테고리를 삭제할 수 없어요."
                    );
                    return;
                  }
                }

                handleError(error);
              }
            }}
          >
            삭제
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>카테고리</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              className="flex flex-col gap-2"
              onSubmit={form.handleSubmit(async (values) => {
                try {
                  updateBlogCategory(category.blogId, category.id, values);
                  setIsEditDialogOpen(false);
                  router.refresh();
                } catch (error) {
                  if (error instanceof ResponseError) {
                    if (error.response.status === 409) {
                      const json = (await error.response.json()) as {
                        target: [
                          string,
                          keyof z.infer<typeof updateCategorySchema>
                        ];
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
                  수정
                </FormSubmitButton>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}