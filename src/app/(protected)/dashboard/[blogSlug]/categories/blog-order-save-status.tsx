"use client";

import { useAtomValue } from "jotai";
import React from "react";
import { blogOrderSaveStatusAtom } from "./blog-order-save-status-atom";

export default function BlogOrderSaveStatus() {
  const saveStatus = useAtomValue(blogOrderSaveStatusAtom);

  return <span className="text-sm text-zinc-500">{saveStatus}</span>;
}
