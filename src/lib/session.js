import "server-only";

import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import {
  ACCESS_COOKIE,
  ACCESS_MAX_AGE,
  REFRESH_COOKIE,
  REFRESH_MAX_AGE,
  SESSION_COOKIE,
  authCookieOptions,
  expiredCookieOptions,
} from "./auth-cookies.js";

function getSecret() {
  const secret = process.env.SESSION_SECRET || process.env.JWT_SECRET || "devpulse-local-session-secret-change-me";
  return new TextEncoder().encode(secret);
}

export async function signSession(user) {
  return new SignJWT({ user: { id: user.id, username: user.username, email: user.email } })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifySessionToken(token) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload.user ?? null;
  } catch {
    return null;
  }
}

export async function verifySession() {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);
}

export async function setAuthCookies(response, { accessToken, refreshToken, user }) {
  const session = await signSession(user);
  response.cookies.set(ACCESS_COOKIE, accessToken, authCookieOptions(ACCESS_MAX_AGE));
  response.cookies.set(REFRESH_COOKIE, refreshToken, authCookieOptions(REFRESH_MAX_AGE));
  response.cookies.set(SESSION_COOKIE, session, authCookieOptions(REFRESH_MAX_AGE));
}

export function clearAuthCookies(response) {
  response.cookies.set(ACCESS_COOKIE, "", expiredCookieOptions());
  response.cookies.set(REFRESH_COOKIE, "", expiredCookieOptions());
  response.cookies.set(SESSION_COOKIE, "", expiredCookieOptions());
}
