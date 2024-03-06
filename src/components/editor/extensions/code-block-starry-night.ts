import CodeBlock, { CodeBlockOptions } from "@tiptap/extension-code-block";

import { StarryNightPlugin } from "../plugins/starry-night-plugin";
import { createStarryNight } from "@wooorm/starry-night";
import { textblockTypeInputRule } from "@tiptap/core";

export type StarryNight = Awaited<ReturnType<typeof createStarryNight>>;

interface CodeBlockStarryNightOptions extends CodeBlockOptions {
  // Since `configure` API use Partial type, all options are optional
  starryNight: StarryNight | undefined;
  defaultLanguage: string | undefined;
}

export const CodeBlockStarryNight =
  CodeBlock.extend<CodeBlockStarryNightOptions>({
    addInputRules() {
      return [
        textblockTypeInputRule({
          find: /^```$/,
          type: this.type,
          getAttributes: () => ({
            language: "markdown",
          }),
        }),
      ];
    },

    addProseMirrorPlugins() {
      const { starryNight, defaultLanguage } = this.options;
      if (typeof starryNight === "undefined") {
        throw new Error(
          "To use `CodeBlockStarryNight` extension, `starryNight` option must be configured"
        );
      } else if (typeof defaultLanguage === "undefined") {
        throw new Error(
          "To use `CodeBlockStarryNight` extension, `defaultLanguage` option must be configured"
        );
      }

      return [
        ...(this.parent?.() || []),
        StarryNightPlugin({
          name: this.name,
          starryNight,
          defaultLanguage,
        }),
      ];
    },
  });
