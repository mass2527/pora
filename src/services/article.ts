import { ARTICLE_STATUS } from "~/lib/constants";
import { invariant } from "~/lib/utils";

function isValidArticleStatus(
  status: string
): status is keyof typeof ARTICLE_STATUS {
  return Object.keys(ARTICLE_STATUS).includes(status);
}

export function getArticleStatusLabel(status: string) {
  invariant(isValidArticleStatus(status));

  const LABELS = {
    writing: "작성중",
    published: "발행됨",
    hidden: "숨겨짐",
  } as const satisfies Record<keyof typeof ARTICLE_STATUS, string>;
  return LABELS[status];
}
