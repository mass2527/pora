import { notFound } from "next/navigation";
import React from "react";
import { EmptyPlaceholder } from "~/components/empty-placeholder";
import { Button } from "~/components/ui/button";
import UserAvatar from "~/components/user-avatar";
import { getUser } from "~/lib/auth";
import prisma from "~/lib/prisma";

export default async function CollaboratorsSettingsPage({
  params,
}: {
  params: { blogSlug: string };
}) {
  const user = await getUser();
  if (!user) {
    notFound();
  }

  const blog = await prisma.blog.findUnique({
    where: {
      slug: params.blogSlug,
      userId: user.id,
    },
    include: {
      collaborators: {
        include: {
          user: true,
        },
      },
    },
  });
  if (!blog) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-4 p-4 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-tight">팀원</h1>
        <Button>팀원 추가</Button>
      </div>

      {blog.collaborators.length == 0 ? (
        <ul>
          {[{ user: user, id: user.id }].map((collaborator) => {
            return (
              <li key={collaborator.id}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {user.name && user.image && (
                      <UserAvatar
                        user={{ name: user.name, image: user.image }}
                        className="w-8 h-8"
                      />
                    )}

                    <div className="flex flex-col font-normal">
                      <span className="text-sm">{user.name}</span>
                      <span className="text-sm text-zinc-500">
                        {user?.email}
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <EmptyPlaceholder
          title="추가된 팀원이 없어요."
          description="새로운 팀원을 추가하고 블로그를 관리해 보세요."
          action={<Button>팀원 추가</Button>}
        />
      )}
    </div>
  );
}
