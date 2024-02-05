"use client";

import { Prisma } from "@prisma/client";
import { ResponseError, handleError } from "~/lib/errors";
import { Input } from "~/components/ui/input";
import Editor from "~/components/editor";
import { ReactNode, useEffect, useRef, useState } from "react";
import { useDebounce } from "~/hooks/use-debounce";
import { Badge } from "~/components/ui/badge";
import { sleep } from "~/lib/utils";
import UpdateArticleForm from "./update-article-form";
import { Button } from "~/components/ui/button";
import { ARTICLE_STATUS } from "~/lib/constants";
import { ArrowLeftIcon } from "lucide-react";
import Switch from "~/components/switch";
import { useRouter } from "next/navigation";

export default function EditArticle({
  article,
}: {
  article: Prisma.ArticleGetPayload<{
    include: { blog: { include: { categories: true } } };
  }>;
}) {
  const [articleForm, setArticleForm] = useState({
    title: article.title,
    htmlContent: article.htmlContent,
    jsonContent: article.jsonContent,
  });
  const latestArticleFormRef = useRef(articleForm);
  const debouncedArticleForm = useDebounce(articleForm, 750);
  const [saveStatus, setSaveStatus] = useState<
    "저장중..." | "저장됨" | "저장 실패" | ""
  >("");
  const [step, setStep] = useState<"제목 및 내용 입력" | "메타 정보 입력">(
    "제목 및 내용 입력"
  );
  const router = useRouter();

  useEffect(() => {
    const isLatest =
      latestArticleFormRef.current.title === debouncedArticleForm.title &&
      latestArticleFormRef.current.jsonContent ===
        debouncedArticleForm.jsonContent;
    if (isLatest) {
      return;
    }

    const controller = new AbortController();

    async function updateArticle() {
      try {
        setSaveStatus("저장중...");
        const response = await fetch(
          `/api/blogs/${article.blogId}/articles/${article.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(debouncedArticleForm),
            signal: controller.signal,
          }
        );
        await sleep(300);
        if (!response.ok) {
          throw new ResponseError("Bad fetch request", response);
        }

        setSaveStatus("저장됨");
        latestArticleFormRef.current = debouncedArticleForm;
        router.refresh();
      } catch (error) {
        setSaveStatus("저장 실패");
        handleError(error);
      }
    }
    updateArticle();

    return () => {
      controller.abort();
    };
  }, [article.blogId, article.id, debouncedArticleForm, router]);

  return (
    <div>
      <Switch
        value={step}
        cases={
          {
            "제목 및 내용 입력": (
              <div className="flex flex-col gap-4">
                <div className="min-h-6 flex justify-end items-center">
                  {saveStatus && <Badge>{saveStatus}</Badge>}
                </div>

                <Input
                  value={articleForm.title}
                  placeholder="핵심 내용을 요약해 보세요."
                  onChange={(event) => {
                    setSaveStatus("");
                    setArticleForm({
                      ...articleForm,
                      title: event.target.value,
                    });
                  }}
                />

                <Editor
                  content={JSON.parse(articleForm.jsonContent)}
                  onUpdate={({ editor }) => {
                    setSaveStatus("");
                    setArticleForm({
                      ...articleForm,
                      htmlContent: editor.getHTML(),
                      jsonContent: JSON.stringify(editor.getJSON()),
                    });
                  }}
                />

                <Button
                  onClick={() => setStep("메타 정보 입력")}
                  className="ml-auto"
                >
                  {article.status === ARTICLE_STATUS.writing
                    ? "발행"
                    : "저장 및 발행"}
                </Button>
              </div>
            ),
            "메타 정보 입력": (
              <>
                <Button
                  className="mb-4 p-0"
                  type="button"
                  onClick={() => setStep("제목 및 내용 입력")}
                  variant="link"
                >
                  <ArrowLeftIcon className="w-4 h-4 mr-2" /> 제목 및 내용 수정
                </Button>

                <UpdateArticleForm
                  article={{
                    ...article,
                    ...articleForm,
                  }}
                />
              </>
            ),
          } satisfies Record<typeof step, ReactNode>
        }
      />
    </div>
  );
}
