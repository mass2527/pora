import { Editor } from "@tiptap/core";
import { Check, ChevronDown } from "lucide-react";
import { Dispatch, FC, SetStateAction } from "react";
import * as Popover from "@radix-ui/react-popover";

export interface BubbleColorMenuItem {
  name: string;
  color: string;
}

interface ColorSelectorProps {
  editor: Editor;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const TEXT_COLORS: BubbleColorMenuItem[] = [
  {
    name: "기본",
    color: "#000",
  },
  {
    name: "회색",
    color: "#A8A29E",
  },
  {
    name: "주황색",
    color: "#FFA500",
  },
  {
    name: "노란색",
    color: "#EAB308",
  },
  {
    name: "초록색",
    color: "#008A00",
  },
  {
    name: "파란색",
    color: "#2563EB",
  },
  {
    name: "보라색",
    color: "#9333EA",
  },
  {
    name: "분홍색",
    color: "#BA4081",
  },
  {
    name: "빨간색",
    color: "#E00000",
  },
];

const HIGHLIGHT_COLORS: BubbleColorMenuItem[] = [
  {
    name: "기본 배경",
    color: "#ffffff",
  },
  {
    name: "회색 배경",
    color: "#f1f1ef",
  },
  {
    name: "주황색 배경",
    color: "#faebdd",
  },
  {
    name: "노란색 배경",
    color: "#fbf4a2",
  },
  {
    name: "초록색 배경",
    color: "#acf79f",
  },
  {
    name: "파란색 배경",
    color: "#c1ecf9",
  },
  {
    name: "보라색 배경",
    color: "#f6f3f8",
  },
  {
    name: "분홍색 배경",
    color: "#faf1f5",
  },
  {
    name: "빨간색 배경",
    color: "#fdebeb",
  },
];

export const ColorSelector: FC<ColorSelectorProps> = ({
  editor,
  isOpen,
  setIsOpen,
}) => {
  const activeColorItem = TEXT_COLORS.find(({ color }) =>
    editor.isActive("textStyle", { color })
  );

  const activeHighlightItem = HIGHLIGHT_COLORS.find(({ color }) =>
    editor.isActive("highlight", { color })
  );

  return (
    <Popover.Root open={isOpen}>
      <div className="relative h-full">
        <Popover.Trigger
          className="flex h-full items-center gap-1 p-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 active:bg-zinc-200"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span
            className="rounded-sm px-1"
            style={{
              color: activeColorItem?.color,
              backgroundColor: activeHighlightItem?.color,
            }}
          >
            A
          </span>

          <ChevronDown className="h-4 w-4" />
        </Popover.Trigger>

        <Popover.Content
          align="start"
          className="z-[99999] my-1 flex max-h-80 w-48 flex-col overflow-hidden overflow-y-auto rounded border border-zinc-200 bg-white p-1 shadow-xl animate-in fade-in slide-in-from-top-1"
        >
          <div className="my-1 px-2 text-sm text-zinc-500">색</div>
          {TEXT_COLORS.map(({ name, color }, index) => (
            <button
              key={index}
              onClick={() => {
                editor.commands.unsetColor();
                name !== "Default" &&
                  editor
                    .chain()
                    .focus()
                    .setColor(color || "")
                    .run();
                setIsOpen(false);
              }}
              className="flex items-center justify-between rounded-sm px-2 py-1 text-sm text-zinc-600 hover:bg-zinc-100"
              type="button"
            >
              <div className="flex items-center space-x-2">
                <div
                  className="rounded-sm border border-zinc-200 px-1 py-px font-medium"
                  style={{ color }}
                >
                  A
                </div>
                <span>{name}</span>
              </div>
              {editor.isActive("textStyle", { color }) && (
                <Check className="h-4 w-4" />
              )}
            </button>
          ))}

          <div className="mb-1 mt-2 px-2 text-sm text-zinc-500">배경</div>

          {HIGHLIGHT_COLORS.map(({ name, color }, index) => (
            <button
              key={index}
              onClick={() => {
                editor.commands.unsetHighlight();
                name !== "Default" && editor.commands.setHighlight({ color });
                setIsOpen(false);
              }}
              className="flex items-center justify-between rounded-sm px-2 py-1 text-sm text-zinc-600 hover:bg-zinc-100"
              type="button"
            >
              <div className="flex items-center space-x-2">
                <div
                  className="rounded-sm border px-1 py-px font-medium"
                  style={{ backgroundColor: color, borderColor: color }}
                >
                  A
                </div>
                <span>{name}</span>
              </div>
              {editor.isActive("highlight", { color }) && (
                <Check className="h-4 w-4" />
              )}
            </button>
          ))}
        </Popover.Content>
      </div>
    </Popover.Root>
  );
};
