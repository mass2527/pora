import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { user } from "./lib/auth";

export function middleware(request: NextRequest) {
  if (!user) {
    return NextResponse.redirect(
      new URL(`/login?from=${request.url}`, request.url)
    );
  }
}

export const config = {
  matcher: "/dashboard/:path*",
};
