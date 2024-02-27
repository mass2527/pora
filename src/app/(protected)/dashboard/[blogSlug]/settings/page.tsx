import React, { Suspense } from "react";
import { getUser } from "~/lib/auth";
import { assertAuthenticated } from "~/lib/asserts";
import BlogForms, { BlogFormsPlaceholder } from "./blog-forms";

export default async function BlogSettingsPage({
  params,
}: {
  params: { blogSlug: string };
}) {
  const user = await getUser();
  assertAuthenticated(user);

  return (
    <div className="flex flex-col gap-4 p-4 min-h-screen">
      <h1 className="text-2xl font-semibold tracking-tight">설정</h1>

      <Suspense fallback={<BlogFormsPlaceholder />}>
        <BlogForms userId={user.id} blogSlug={params.blogSlug} />
      </Suspense>
    </div>
  );
}
