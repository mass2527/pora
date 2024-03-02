import React from "react";

export default async function Prose({ html }: { html: string }) {
  return (
    <div className="pora-prose" dangerouslySetInnerHTML={{ __html: html }} />
  );
}
