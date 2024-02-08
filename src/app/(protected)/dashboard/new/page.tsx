import React from "react";
import CreateBlogForm from "./create-blog-form";

export default async function NewBlogPage() {
  return (
    <div className="grid place-items-center min-h-screen p-4">
      <CreateBlogForm />
    </div>
  );
}
