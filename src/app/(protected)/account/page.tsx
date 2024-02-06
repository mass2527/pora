import { notFound } from "next/navigation";
import React from "react";
import Card from "~/components/card";
import { getUser } from "~/lib/auth";
import UpdateUserNameForm from "./update-user-name-form";

export default async function AccountPage() {
  const user = await getUser();
  if (!user) {
    notFound();
  }

  return (
    <div className="p-4">
      <Card
        title="이름"
        description="사용자의 이름을 나타내기 위해 사용됩니다."
        content={
          <UpdateUserNameForm user={{ id: user.id, name: user.name || null }} />
        }
      />
    </div>
  );
}
