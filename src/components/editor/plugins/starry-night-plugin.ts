import { findChildren } from "@tiptap/core";
import { Node as ProsemirrorNode } from "@tiptap/pm/model";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";

import { assert } from "~/lib/utils";
import { StarryNight } from "../extensions/code-block-starry-night";

function parseNodes(
  nodes: any[],
  className: string[] = []
): { text: string; classes: string[] }[] {
  return nodes
    .map((node) => {
      const classes = [
        ...className,
        ...(node.properties ? node.properties.className : []),
      ];

      if (node.children) {
        return parseNodes(node.children, classes);
      }

      return {
        text: node.value,
        classes,
      };
    })
    .flat();
}

function getDecorations({
  doc,
  name,
  starryNight,
  defaultLanguage,
}: {
  doc: ProsemirrorNode;
  name: string;
  starryNight: StarryNight;
  defaultLanguage: string;
}) {
  const decorations: Decoration[] = [];
  findChildren(doc, (node) => node.type.name === name).forEach((codeBlock) => {
    let from = codeBlock.pos + 1;
    const language = codeBlock.node.attrs.language || defaultLanguage;

    const scope = starryNight.flagToScope?.(language);
    assert(scope);
    const root = starryNight.highlight?.(codeBlock.node.textContent, scope);
    const nodes = root?.children ?? [];

    parseNodes(nodes).forEach((node) => {
      const to = from + node.text.length;

      if (node.classes.length) {
        const decoration = Decoration.inline(from, to, {
          class: node.classes.join(" "),
        });

        decorations.push(decoration);
      }

      from = to;
    });
  });

  return DecorationSet.create(doc, decorations);
}

export function StarryNightPlugin({
  name,
  starryNight,
  defaultLanguage,
}: {
  name: string;
  starryNight: StarryNight;
  defaultLanguage: string;
}) {
  const starryNightPlugin: Plugin<any> = new Plugin({
    key: new PluginKey("starry-night"),

    state: {
      init: (_, { doc }) =>
        getDecorations({
          doc,
          name,
          starryNight,
          defaultLanguage,
        }),
      apply: (transaction, decorationSet, oldState, newState) => {
        const oldNodeName = oldState.selection.$head.parent.type.name;
        const newNodeName = newState.selection.$head.parent.type.name;
        const oldNodes = findChildren(
          oldState.doc,
          (node) => node.type.name === name
        );
        const newNodes = findChildren(
          newState.doc,
          (node) => node.type.name === name
        );

        if (
          transaction.docChanged &&
          // Apply decorations if:
          // selection includes named node,
          ([oldNodeName, newNodeName].includes(name) ||
            // OR transaction adds/removes named node,
            newNodes.length !== oldNodes.length ||
            // OR transaction has changes that completely encapsulte a node
            // (for example, a transaction that affects the entire document).
            // Such transactions can happen during collab syncing via y-prosemirror, for example.
            transaction.steps.some((step) => {
              return (
                // @ts-ignore
                step.from !== undefined &&
                // @ts-ignore
                step.to !== undefined &&
                oldNodes.some((node) => {
                  // @ts-ignore
                  return (
                    // @ts-ignore
                    node.pos >= step.from &&
                    // @ts-ignore
                    node.pos + node.node.nodeSize <= step.to
                  );
                })
              );
            }))
        ) {
          return getDecorations({
            doc: transaction.doc,
            name,
            starryNight,
            defaultLanguage,
          });
        }

        return decorationSet.map(transaction.mapping, transaction.doc);
      },
    },

    props: {
      decorations(state) {
        return starryNightPlugin.getState(state);
      },
    },
  });

  return starryNightPlugin;
}
