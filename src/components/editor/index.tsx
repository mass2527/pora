"use client";

import { useEditor, EditorContent, EditorOptions } from "@tiptap/react";
import { defaultExtensions } from "./extensions";
import "./styles.css";

// https://github.com/steven-tey/novel
export default function Editor(options: Partial<EditorOptions>) {
  const editor = useEditor({
    ...options,
    extensions: defaultExtensions,
    editorProps: {
      attributes: {
        class: "p-4 prose prose-zinc w-full max-w-none",
      },
      handleDOMEvents: {
        keydown: (_view, event) => {
          // prevent default event listeners from firing when slash command is active
          if (["ArrowUp", "ArrowDown", "Enter"].includes(event.key)) {
            const slashCommand = document.querySelector("#slash-command");
            if (slashCommand) {
              return true;
            }
          }
        },
      },
    },
  });

  return <EditorContent editor={editor} />;
}
