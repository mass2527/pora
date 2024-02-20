"use client";

import { Prisma } from "@prisma/client";
import { handleError, throwServerError } from "~/lib/errors";
import { Input } from "~/components/ui/input";
import Editor from "~/components/editor";
import { ReactNode, useEffect, useRef, useState } from "react";
import { useDebounce } from "~/hooks/use-debounce";
import { Badge } from "~/components/ui/badge";
import UpdateBlogArticleForm from "./update-blog-article-form";
import { Button } from "~/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import Switch from "~/components/switch";
import { updateArticle } from "./actions";

export default function EditBlogArticle({
  blogArticle,
}: {
  blogArticle: Prisma.ArticleGetPayload<{
    include: { blog: { include: { categories: true } } };
  }>;
}) {
  const [values, setValues] = useState({
    title: blogArticle.draftTitle,
    htmlContent: blogArticle.htmlContent,
    jsonContent: blogArticle.draftJsonContent,
  });
  const latestValuesRef = useRef(values);
  const debouncedValues = useDebounce(values, 3000);
  const [saveStatus, setSaveStatus] = useState<
    "임시 저장중..." | "임시 저장됨" | "임시 저장 실패" | ""
  >("");
  const [step, setStep] = useState<"제목 및 내용 입력" | "메타 정보 입력">(
    "제목 및 내용 입력"
  );

  useEffect(() => {
    const isLatest =
      latestValuesRef.current.title === debouncedValues.title &&
      latestValuesRef.current.jsonContent === debouncedValues.jsonContent;
    if (isLatest) {
      return;
    }

    async function saveDraft() {
      try {
        setSaveStatus("임시 저장중...");
        const response = await updateArticle(blogArticle.id, {
          draftTitle: debouncedValues.title,
          draftJsonContent: debouncedValues.jsonContent,
        });
        if (response.status === "failure") {
          throwServerError(response);
        }

        setSaveStatus("임시 저장됨");
        latestValuesRef.current = debouncedValues;
      } catch (error) {
        setSaveStatus("임시 저장 실패");
        handleError(error);
      }
    }
    saveDraft();
  }, [blogArticle.id, debouncedValues]);

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
                  value={values.title}
                  placeholder="핵심 내용을 요약해 보세요."
                  onChange={(event) => {
                    setSaveStatus("");
                    setValues({
                      ...values,
                      title: event.target.value,
                    });
                  }}
                />

                <Editor
                  content={JSON.parse(values.jsonContent)}
                  onUpdate={({ editor }) => {
                    setSaveStatus("");
                    setValues({
                      ...values,
                      htmlContent: editor.getHTML(),
                      jsonContent: JSON.stringify(editor.getJSON()),
                    });
                  }}
                />

                <Button
                  onClick={() => setStep("메타 정보 입력")}
                  className="ml-auto"
                >
                  {blogArticle.status === "WRITING" ? "발행" : "저장 및 발행"}
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

                <UpdateBlogArticleForm
                  article={{
                    ...blogArticle,
                    ...values,
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
