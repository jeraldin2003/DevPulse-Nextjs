import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { REFRESH_COOKIE } from "@/lib/auth-cookies.js";
import { backendJson } from "@/lib/backend-client.js";
import { clearAuthCookies } from "@/lib/session.js";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;

  if (refreshToken) {
    await backendJson("/auth/logout", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    }).catch(() => null);
  }

  const response = NextResponse.json({ success: true });
  clearAuthCookies(response);
  return response;
}
