import React from "react";
import GoogleLoginButton from "./google-login-button";

export default function LoginPage() {
  return (
    <div className="min-h-screen grid place-items-center">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Pora</h1>
        <GoogleLoginButton />
      </div>
    </div>
  );
}
