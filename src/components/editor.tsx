"use client";

import { useEditor, EditorContent, EditorOptions } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function Editor(options: Partial<EditorOptions>) {
  const editor = useEditor({
    ...options,
    extensions: [StarterKit, ...(options.extensions ?? [])],
  });

  return <EditorContent editor={editor} />;
}
