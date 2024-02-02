"use client";

import { signIn } from "next-auth/react";
import React from "react";
import { Button } from "~/components/ui/button";

export default function GoogleLoginButton() {
  return (
    <Button
      type="button"
      onClick={() => {
        signIn("google");
      }}
    >
      구글로 로그인
    </Button>
  );
}
