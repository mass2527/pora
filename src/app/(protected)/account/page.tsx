import React from "react";
import Card from "~/components/card";
import { getUser } from "~/lib/auth";
import UpdateUserNameForm from "./update-user-name-form";
import UpdateUserJobPositionForm from "./update-user-job-position-form";
import UpdateUserImage from "./update-user-image";
import { assertAuthenticated } from "~/lib/asserts";

export default async function AccountPage() {
  const user = await getUser();
  assertAuthenticated(user);

  return (
    <div className="p-4 flex flex-col gap-4 min-h-screen">
      <h1 className="text-2xl font-semibold tracking-tight">계정</h1>

      <Card
        title="이미지"
        description="아바타를 클릭해 변경할 이미지 파일을 선택해 주세요."
        content={
          <UpdateUserImage
            user={{
              id: user.id,
              name: user.name ?? null,
              image: user.image ?? null,
            }}
          />
        }
      />

      <Card
        title="이름"
        description="전체 이름을 입력해주세요."
        content={
          <UpdateUserNameForm user={{ id: user.id, name: user.name || null }} />
        }
      />

      <Card
        title="직책"
        description="어떤 일을 하고 있는지 입력해 주세요."
        content={
          <UpdateUserJobPositionForm
            user={{ id: user.id, jobPosition: user.jobPosition || null }}
          />
        }
      />
    </div>
  );
}
