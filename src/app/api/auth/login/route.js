import { NextResponse } from "next/server";
import { backendJson } from "@/lib/backend-client.js";
import { setAuthCookies } from "@/lib/session.js";

export async function POST(request) {
  const body = await request.json();
  const result = await backendJson("/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });

  const data = result.json?.data;
  if (!result.ok || !data?.accessToken || !data?.refreshToken || !data?.user) {
    return NextResponse.json(result.json, { status: result.status });
  }

  const response = NextResponse.json({
    success: true,
    message: result.json?.message ?? "Login successful",
    data: { user: data.user },
  });
  await setAuthCookies(response, data);
  return response;
}
