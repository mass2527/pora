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
import { useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Loading } from "~/components/ui/loading";

export default function CreateCategoryButton({ blogId }: { blogId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>새 카테고리</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>새 카테고리</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={async (event) => {
            event.preventDefault();

            const formData = new FormData(event.currentTarget);
            const schema = z.object({
              name: z.string().min(1),
              slug: z.string().min(1),
            });

            try {
              const { name, slug } = schema.parse({
                name: formData.get("name"),
                slug: formData.get("slug"),
              });
              setIsLoading(true);
              await fetch(`/api/blogs/${blogId}/categories`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, slug }),
              });
              setIsOpen(false);
              router.refresh();
            } catch (error) {
              console.error(error);
            } finally {
              setIsLoading(false);
            }
          }}
          className="flex flex-col gap-2"
          id="new_category"
        >
          <Label htmlFor="name">이름*</Label>
          <Input id="name" name="name" required />
          <Label htmlFor="slug">슬러그*</Label>
          <Input id="slug" name="slug" required />
        </form>

        <DialogFooter>
          <Button type="submit" form="new_category" disabled={isLoading}>
            {isLoading ? <Loading /> : "생성"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
