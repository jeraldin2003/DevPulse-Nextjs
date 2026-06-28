import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { REFRESH_COOKIE } from "@/lib/auth-cookies.js";
import { backendJson } from "@/lib/backend-client.js";
import { setAuthCookies, verifySession } from "@/lib/session.js";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;
  const user = await verifySession();

  if (!refreshToken || !user) {
    return NextResponse.json({ success: false, error: "No active session" }, { status: 401 });
  }

  const result = await backendJson("/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });

  const data = result.json?.data;
  if (!result.ok || !data?.accessToken || !data?.refreshToken) {
    return NextResponse.json(result.json, { status: result.status });
  }

  const response = NextResponse.json({ success: true, data: { user } });
  await setAuthCookies(response, { ...data, user });
  return response;
}
