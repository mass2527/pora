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
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Loading } from "~/components/ui/loading";

const editCategoryFormId = "edit_category";

export default function CategoryRowAction({
  category,
}: {
  category: Category;
}) {
  const router = useRouter();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

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
                await fetch(
                  `/api/blogs/${category.blogId}/categories/${category.id}`,
                  {
                    method: "DELETE",
                  }
                );
                router.refresh();
              } catch (error) {
                console.error(error);
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

          <form
            onSubmit={async (event) => {
              event.preventDefault();

              try {
                const formData = new FormData(event.currentTarget);
                const schema = z.object({
                  name: z.string().min(1),
                  slug: z.string().min(1),
                });
                const { name, slug } = schema.parse({
                  name: formData.get("name"),
                  slug: formData.get("slug"),
                });
                setIsEditing(true);
                await fetch(
                  `/api/blogs/${category.blogId}/categories/${category.id}`,
                  {
                    method: "PATCH",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      name,
                      slug,
                    }),
                  }
                );
                setIsEditDialogOpen(false);
                router.refresh();
              } catch (error) {
                console.error(error);
              } finally {
                setIsEditing(false);
              }
            }}
            className="flex flex-col gap-2"
            id={editCategoryFormId}
          >
            <Label htmlFor="name">이름*</Label>
            <Input
              id="name"
              name="name"
              defaultValue={category.name}
              required
            />
            <Label htmlFor="slug">슬러그*</Label>
            <Input
              id="slug"
              name="slug"
              defaultValue={category.slug}
              required
            />
          </form>

          <DialogFooter>
            <Button
              type="submit"
              form={editCategoryFormId}
              disabled={isEditing}
            >
              {isEditing ? <Loading /> : "수정"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
