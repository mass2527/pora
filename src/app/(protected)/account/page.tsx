import React from "react";
import UpdateUserNameForm from "./update-user-name-form";
import UpdateUserJobPositionForm from "./update-user-job-position-form";
import UpdateUserImage from "./update-user-image";

export default async function AccountPage() {
  return (
    <div className="p-4 flex flex-col gap-4 min-h-screen">
      <h1 className="text-2xl font-semibold tracking-tight">계정</h1>
      <UpdateUserImage />
      <UpdateUserNameForm />
      <UpdateUserJobPositionForm />
    </div>
  );
}
