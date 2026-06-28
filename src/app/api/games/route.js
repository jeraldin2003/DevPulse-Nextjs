import { NextResponse } from "next/server";
import { authenticatedBackendJson } from "@/lib/backend-client.js";
import { setAuthCookies, verifySession } from "@/lib/session.js";

export async function POST(request) {
  const user = await verifySession();
  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const result = await authenticatedBackendJson("/games", {
    method: "POST",
    body: JSON.stringify({ ...body, user }),
  });

  const response = NextResponse.json(result.json, { status: result.status });
  if (result.rotated) await setAuthCookies(response, { ...result.rotated, user });
  return response;
}

export async function GET() {
  const user = await verifySession();
  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const params = new URLSearchParams({ username: user.username ?? "" });
  const result = await authenticatedBackendJson(`/games?${params.toString()}`);
  const response = NextResponse.json(result.json, { status: result.status });
  if (result.rotated) await setAuthCookies(response, { ...result.rotated, user });
  return response;
}
