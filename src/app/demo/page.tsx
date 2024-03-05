"use client";

import React, { lazy } from "react";

const Editor = lazy(() => import("~/components/editor"));

export default function DemoPage() {
  return (
    <div className="p-4">
      <Editor />
    </div>
  );
}
