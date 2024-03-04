import React, { AnchorHTMLAttributes } from "react";

// https://www.jitbit.com/alexblog/256-targetblank---the-most-underestimated-vulnerability-ever/
export default function NewTabLink(
  props: Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "target" | "rel">
) {
  return <a target="_blank" rel="noopener noreferrer" {...props} />;
}
