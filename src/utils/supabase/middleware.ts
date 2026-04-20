import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

interface MyQuraniUser {
  id: number;
  email: string;
  name?: string;
  role?: string;
}

function getMyQuraniUser(request: NextRequest): MyQuraniUser | null {
  try {
    const accessToken = request.cookies.get("myqurani_access_token")?.value;
    const userCookie = request.cookies.get("myqurani_user")?.value;

    if (!accessToken) return null;
    if (userCookie) {
      return JSON.parse(userCookie) as MyQuraniUser;
    }
    return { id: 0, email: "", role: "member" };
  } catch {
    return null;
  }
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const pathname = request.nextUrl.pathname;

  const isAuthCallback = pathname.startsWith("/auth/callback") || pathname.startsWith("/oauth/callback");
  const isLoginPage = pathname.startsWith("/login");
  const isRegisterPage = pathname.startsWith("/register");
  const isHomePage = pathname === "/";
  const isDashboard = pathname.startsWith("/dashboard");
  const isProtectedRoute = isDashboard;

  const myquraniUser = getMyQuraniUser(request);

  if (myquraniUser) {
    if (isLoginPage || isRegisterPage || isHomePage) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
    return response;
  }

  const isAuthenticated = myquraniUser !== null;

  if (isAuthenticated && (isLoginPage || isRegisterPage || isHomePage)) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  if (!isAuthenticated && !isAuthCallback && !isLoginPage && !isRegisterPage && !isHomePage && isProtectedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return response;
}
