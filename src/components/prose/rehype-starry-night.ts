/**
 * @typedef {import('@wooorm/starry-night').Grammar} Grammar
 * @typedef {import('hast').ElementContent} ElementContent
 * @typedef {import('hast').Root} Root
 */

/**
 * @typedef Options
 *   Configuration (optional)
 * @property {Array<Grammar> | null | undefined} [grammars]
 *   Grammars to support (default: `common`).
 */

import { common, createStarryNight } from "@wooorm/starry-night";
import { toString } from "hast-util-to-string";
import { visit } from "unist-util-visit";

// https://github.com/wooorm/starry-night?tab=readme-ov-file#example-integrate-with-unified-remark-and-rehype
/**
 * Highlight code with `starry-night`.
 *
 * @param {Options | null | undefined} [options]
 *   Configuration (optional).
 * @returns
 *   Transform.
 */
export default function rehypeStarryNight(options?: any) {
  const settings = options || {};
  const grammars = settings.grammars || common;
  const starryNightPromise = createStarryNight(grammars, {
    getOnigurumaUrlFs: () => {
      return new URL(
        "./vendor/vscode-oniguruma/onig.wasm",
        `file://${process.cwd()}/`
      );
    },
  });
  const prefix = "language-";

  /**
   * Transform.
   *
   * @param {Root} tree
   *   Tree.
   * @returns {Promise<undefined>}
   *   Nothing.
   */
  return async function (tree: any) {
    const starryNight = await starryNightPromise;

    visit(tree, "element", function (node, index, parent) {
      if (!parent || index === undefined || node.tagName !== "pre") {
        return;
      }

      const head = node.children[0];

      if (!head || head.type !== "element" || head.tagName !== "code") {
        return;
      }

      const classes = head.properties.className;

      if (!Array.isArray(classes)) return;

      const language = classes.find(function (d) {
        return typeof d === "string" && d.startsWith(prefix);
      });

      if (typeof language !== "string") return;

      const scope = starryNight.flagToScope(language.slice(prefix.length));

      // Maybe warn?
      if (!scope) return;

      const fragment = starryNight.highlight(toString(head), scope);
      const children = /** @type {Array<ElementContent>} */ fragment.children;

      parent.children.splice(index, 1, {
        type: "element",
        tagName: "div",
        properties: {
          className: [
            "highlight",
            "highlight-" + scope.replace(/^source\./, "").replace(/\./g, "-"),
          ],
        },
        children: [
          { type: "element", tagName: "pre", properties: {}, children },
        ],
      });
    });
  };
}
