import React from "react";
import GoogleLoginButton from "./google-login-button";
import PoraLogo from "~/components/pora-logo";

export default function LoginPage() {
  return (
    <div className="min-h-screen grid place-items-center">
      <div className="flex flex-col items-center gap-4">
        <PoraLogo />
        <p className="text-sm text-zinc-500">
          계속하려면 소셜 계정으로 로그인하세요.
        </p>
        <GoogleLoginButton />
      </div>
    </div>
  );
}
