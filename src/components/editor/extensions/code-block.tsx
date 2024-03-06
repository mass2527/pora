"use client";

import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import React from "react";
import "@wooorm/starry-night/style/light";
import { StarryNight } from "./code-block-starry-night";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Button } from "~/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { assert, cn } from "~/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/components/ui/command";

interface CodeBlockProps {
  node: {
    attrs: {
      language: string;
    };
  };
  // eslint-disable-next-line unused-imports/no-unused-vars
  updateAttributes: ({ language }: { language: string | null }) => void;
  extension: {
    options: {
      starryNight: StarryNight;
      defaultLanguage: string;
    };
  };
}

export default function CodeBlock({
  node: {
    attrs: { language },
  },
  updateAttributes,
  extension,
}: CodeBlockProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const grammarScopes = extension.options.starryNight.scopes();
  const currentLanguageName = language ?? extension.options.defaultLanguage;
  const currentLanguage = LANGUAGES.find(
    (language) => language.name === currentLanguageName
  );

  return (
    <NodeViewWrapper className="relative">
      <div className="absolute top-3 left-4">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-[200px] justify-between"
              onClick={(event) => event.stopPropagation()}
            >
              {currentLanguage?.label}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="언어를 검색하세요" />
              <CommandEmpty>결과 없음</CommandEmpty>
              <CommandGroup className="overflow-scroll max-h-80">
                {grammarScopes.map((grammarScope) => {
                  const isSupportedLanguage = LANGUAGES.some(
                    (language) => language.scope === grammarScope
                  );
                  if (!isSupportedLanguage) {
                    return null;
                  }

                  const language = LANGUAGES.find(
                    (language) => language.scope === grammarScope
                  );
                  assert(language);
                  const { label, name } = language;

                  return (
                    <CommandItem
                      key={grammarScope}
                      value={label}
                      onSelect={() => {
                        updateAttributes({
                          language: name,
                        });
                        setIsOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          currentLanguageName === name
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <pre className="pt-16">
        <NodeViewContent as="code" />
      </pre>
    </NodeViewWrapper>
  );
}

// https://github.com/wooorm/starry-night?tab=readme-ov-file#languages
// https://github.com/wooorm/starry-night?tab=readme-ov-file#common
// https://github.com/wooorm/starry-night?tab=readme-ov-file#starrynightflagtoscopeflag
const LANGUAGES = [
  {
    scope: "source.c",
    name: "c",
    label: "C",
  },
  {
    scope: "source.c++",
    name: "c++",
    label: "C++",
  },
  // {
  //   scope:"source.c.platform",
  //   name: undefined,
  //   label: undefined,
  // },
  {
    scope: "source.cs",
    name: "c#",
    label: "C#",
  },
  {
    scope: "source.css",
    name: "css",
    label: "CSS",
  },
  {
    scope: "source.css.less",
    name: "less",
    label: "Less",
  },
  {
    scope: "source.css.scss",
    name: "scss",
    label: "Scss",
  },
  {
    scope: "source.diff",
    name: "diff",
    label: "Diff",
  },
  {
    scope: "source.go",
    name: "go",
    label: "Go",
  },
  {
    scope: "source.graphql",
    name: "graphql",
    label: "GraphQL",
  },
  {
    scope: "source.ini",
    name: "ini",
    label: "INI",
  },
  {
    scope: "source.java",
    name: "java",
    label: "Java",
  },
  {
    scope: "source.js",
    name: "javascript",
    label: "JavaScript",
  },
  {
    scope: "source.json",
    name: "json",
    label: "JSON",
  },
  {
    scope: "source.kotlin",
    name: "kotlin",
    label: "Kotlin",
  },
  {
    scope: "source.lua",
    name: "lua",
    label: "Lua",
  },
  {
    scope: "source.makefile",
    name: "makefile",
    label: "Makefile",
  },
  {
    scope: "source.objc",
    name: "objective-c",
    label: "Objective-C",
  },
  // {
  //   scope: "source.objc.platform",
  //   name: undefined,
  //   label: undefined,
  // },
  {
    scope: "source.perl",
    name: "perl",
    label: "Perl",
  },
  {
    scope: "source.python",
    name: "python",
    label: "Python",
  },
  {
    scope: "source.r",
    name: "r",
    label: "R",
  },
  {
    scope: "source.ruby",
    name: "ruby",
    label: "Ruby",
  },
  {
    scope: "source.rust",
    name: "rust",
    label: "Rust",
  },
  {
    scope: "source.shell",
    name: "shell",
    label: "Shell",
  },
  {
    scope: "source.sql",
    name: "sql",
    label: "SQL",
  },
  {
    scope: "source.swift",
    name: "swift",
    label: "Swift",
  },
  {
    scope: "source.ts",
    name: "typescript",
    label: "TypeScript",
  },
  {
    scope: "source.vbnet",
    name: "vb.net",
    label: "VB.Net",
  },
  {
    scope: "source.yaml",
    name: "yaml",
    label: "YAML",
  },
  {
    scope: "text.html.basic",
    name: "html",
    label: "HTML",
  },
  {
    scope: "text.html.php",
    name: "php",
    label: "PHP",
  },
  {
    scope: "text.md",
    name: "markdown",
    label: "Markdown",
  },
  {
    scope: "text.xml",
    name: "xml",
    label: "XML",
  },
  {
    scope: "text.xml.svg",
    name: "svg",
    label: "SVG",
  },
];
