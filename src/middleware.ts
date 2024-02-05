import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  async function middleware(req) {
    const token = await getToken({ req });
    const isLoggedIn = !!token;

    const { pathname, search } = req.nextUrl;
    const isDashboardPage = pathname.startsWith("/dashboard");
    const isAccountPage = pathname.startsWith("/account");
    const isProtectedPage = isDashboardPage || isAccountPage;

    const isLoginPage = pathname.startsWith("/login");

    if (isProtectedPage) {
      if (!isLoggedIn) {
        let from = pathname;
        if (search) {
          from += search;
        }

        return NextResponse.redirect(
          new URL(`/login?from=${encodeURIComponent(from)}`, req.url)
        );
      }
    } else if (isLoginPage) {
      if (isLoggedIn) {
        return NextResponse.redirect(new URL(`/dashboard`, req.url));
      }
    }
  },
  {
    callbacks: {
      async authorized() {
        // This is a work-around for handling redirect on auth pages.
        // We return true here so that the middleware function above
        // is always called.
        return true;
      },
    },
  }
);

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
