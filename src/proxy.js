import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "./lib/auth-cookies.js";

const PROTECTED_ROUTES = ["/dashboard", "/quiz"];
const AUTH_ROUTES = ["/login", "/register", "/forgot-password"];

function startsWithAny(pathname, routes) {
  return routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE)?.value);

  if (startsWithAny(pathname, PROTECTED_ROUTES) && !hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (startsWithAny(pathname, AUTH_ROUTES) && hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth|.*\\..*).*)"],
};
