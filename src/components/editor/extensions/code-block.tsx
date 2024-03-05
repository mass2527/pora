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
import { assert } from "~/lib/utils";

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
  const grammars =
    extension.options.starryNight.scopes() as (keyof typeof COMMON_GRAMMAR_LABELS)[];

  return (
    <NodeViewWrapper className="relative">
      <div className="absolute top-3 left-4">
        <Select
          onValueChange={(value) => updateAttributes({ language: value })}
          defaultValue={language ?? extension.options.defaultLanguage}
        >
          <SelectTrigger>
            <SelectValue placeholder="언어 선택" />
          </SelectTrigger>

          <SelectContent>
            {grammars.map((grammar) => {
              const label = COMMON_GRAMMAR_LABELS[grammar];
              if (!label) {
                return null;
              }

              return (
                <SelectItem key={grammar} value={getGrammarName(grammar)}>
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

// https://github.com/wooorm/starry-night?tab=readme-ov-file#languages
// https://github.com/wooorm/starry-night?tab=readme-ov-file#common
const COMMON_GRAMMAR_LABELS = {
  "source.c": "C",
  "source.c++": "C++",
  "source.c.platform": undefined,
  "source.cs": "C#",
  "source.css": "CSS",
  "source.css.less": "Less",
  "source.css.scss": "Scss",
  "source.diff": "Diff",
  "source.go": "Go",
  "source.graphql": "GraphQL",
  "source.ini": "INI",
  "source.java": "Java",
  "source.js": "JavaScript",
  "source.json": "JSON",
  "source.kotlin": "Kotlin",
  "source.lua": "Lua",
  "source.makefile": "Makefile",
  "source.objc": "Objective-C",
  "source.objc.platform": undefined,
  "source.perl": "Perl",
  "source.python": "Python",
  "source.r": "R",
  "source.ruby": "Ruby",
  "source.rust": "Rust",
  "source.shell": "Shell",
  "source.sql": "SQL",
  "source.swift": "Swift",
  "source.ts": "TypeScript",
  "source.vbnet": "VB.Net",
  "source.yaml": "YAML",
  "text.html.basic": "HTML",
  "text.html.php": "PHP",
  "text.md": "Markdown",
  "text.xml": "XML",
  "text.xml.svg": undefined,
} as const;

// https://github.com/wooorm/starry-night?tab=readme-ov-file#starrynightflagtoscopeflag
function getGrammarName(grammar: keyof typeof COMMON_GRAMMAR_LABELS) {
  const isSource = grammar.startsWith("source");
  if (isSource) {
    const words = grammar.split(".");
    const grammarName = words[words.length - 1];
    assert(grammarName);
    return grammarName;
  }

  const isText = grammar.startsWith("text");
  if (isText) {
    const [_, grammarName] = grammar.split(".");
    assert(grammarName);
    return grammarName;
  }

  throw new Error(`Invalid case`);
}
