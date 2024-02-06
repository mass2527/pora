import { notFound } from "next/navigation";
import React from "react";
import Card from "~/components/card";
import { getUser } from "~/lib/auth";
import UpdateUserNameForm from "./update-user-name-form";
import UpdateUserJobPositionForm from "./update-user-job-position-form";

export default async function AccountPage() {
  const user = await getUser();
  if (!user) {
    notFound();
  }

  return (
    <div className="p-4 flex flex-col gap-4">
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
