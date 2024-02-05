"use client";

import { useEditor, EditorContent, EditorOptions } from "@tiptap/react";
import { defaultExtensions } from "./extensions";
import { EditorBubbleMenu } from "./bubble-menu";
import { ImageResizer } from "./extensions/image-resizer";

import "./styles/index.css";
import "./styles/prosemirror.css";

// https://github.com/steven-tey/novel
export default function Editor(options: Partial<EditorOptions>) {
  const editor = useEditor({
    ...options,
    extensions: defaultExtensions,
    editorProps: {
      attributes: {
        class:
          "prose prose-zinc w-full max-w-none border border-input rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
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
    autofocus: "end",
  });

  return (
    <div
      onClick={() => {
        editor?.chain().focus().run();
      }}
    >
      {editor && <EditorBubbleMenu editor={editor} />}
      {editor?.isActive("image") && <ImageResizer editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  );
}
