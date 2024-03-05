import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import React from "react";
import "@wooorm/starry-night/style/both";
import { StarryNight } from "./code-block-starry-night";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

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
  const grammars = extension.options.starryNight.scopes();

  return (
    <NodeViewWrapper className="relative">
      <div className="absolute top-3 left-4">
        <Select
          onValueChange={(value) => updateAttributes({ language: value })}
          defaultValue={language ?? extension.options.defaultLanguage}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            {grammars.map((grammar) => {
              if (!(grammar in GRAMMARS)) {
                throw new Error(
                  `Unregistered grammar: ${grammar}. Please add grammar to \`GRAMMARS\``
                );
              }

              const { label, name } = GRAMMARS[grammar as CommonGrammar];
              if (!label) {
                return null;
              }

              return (
                <SelectItem key={grammar} value={name}>
                  {label}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
      <pre className="pt-16">
        <NodeViewContent as="code" />
      </pre>
    </NodeViewWrapper>
  );
}

type CommonGrammar = keyof typeof GRAMMARS;

// https://github.com/wooorm/starry-night?tab=readme-ov-file#languages
// https://github.com/wooorm/starry-night?tab=readme-ov-file#common
// https://github.com/wooorm/starry-night?tab=readme-ov-file#starrynightflagtoscopeflag
const COMMON_GRAMMARS = {
  "source.c": {
    name: "c",
    label: "C",
  },
  "source.c++": {
    name: "c++",
    label: "C++",
  },
  "source.c.platform": {
    name: undefined,
    label: undefined,
  },
  "source.cs": {
    name: "c#",
    label: "C#",
  },
  "source.css": {
    name: "css",
    label: "CSS",
  },
  "source.css.less": {
    name: "less",
    label: "Less",
  },
  "source.css.scss": {
    name: "scss",
    label: "Scss",
  },
  "source.diff": {
    name: "diff",
    label: "Diff",
  },
  "source.go": {
    name: "go",
    label: "Go",
  },
  "source.graphql": {
    name: "graphql",
    label: "GraphQL",
  },
  "source.ini": {
    name: "ini",
    label: "INI",
  },
  "source.java": {
    name: "java",
    label: "Java",
  },
  "source.js": {
    name: "js",
    label: "JavaScript",
  },
  "source.json": {
    name: "json",
    label: "JSON",
  },
  "source.kotlin": {
    name: "kotlin",
    label: "Kotlin",
  },
  "source.lua": {
    name: "lua",
    label: "Lua",
  },
  "source.makefile": {
    name: "makefile",
    label: "Makefile",
  },
  "source.objc": {
    name: "objc",
    label: "Objective-C",
  },
  "source.objc.platform": {
    name: undefined,
    label: undefined,
  },
  "source.perl": {
    name: "perl",
    label: "Perl",
  },
  "source.python": {
    name: "python",
    label: "Python",
  },
  "source.r": {
    name: "r",
    label: "R",
  },
  "source.ruby": {
    name: "ruby",
    label: "Ruby",
  },
  "source.rust": {
    name: "rust",
    label: "Rust",
  },
  "source.shell": {
    name: "shell",
    label: "Shell",
  },
  "source.sql": {
    name: "sql",
    label: "SQL",
  },
  "source.swift": {
    name: "swift",
    label: "Swift",
  },
  "source.ts": {
    name: "ts",
    label: "TypeScript",
  },
  "source.vbnet": {
    name: "vbnet",
    label: "VB.Net",
  },
  "source.yaml": {
    name: "yaml",
    label: "YAML",
  },
  "text.html.basic": {
    name: "html",
    label: "HTML",
  },
  "text.html.php": {
    name: "php",
    label: "PHP",
  },
  "text.md": {
    name: "md",
    label: "Markdown",
  },
  "text.xml": {
    name: "xml",
    label: "XML",
  },
  "text.xml.svg": {
    name: "svg",
    label: "SVG",
  },
};
const GRAMMARS = {
  ...COMMON_GRAMMARS,
};
