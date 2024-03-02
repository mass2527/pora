import React from "react";
import { rehype } from "rehype";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { fromHtmlIsomorphic } from "hast-util-from-html-isomorphic";
import "./extended-prose.css";
import Prose from ".";

export default async function ExtendedProse({ html }: { html: string }) {
  const file = await rehype()
    .data("settings", { fragment: true })
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      behavior: "append",
      content: fromHtmlIsomorphic(
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-link"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
        { fragment: true }
      ).children,
    })
    .process(html);

  return <Prose html={file.value as string} />;
}
