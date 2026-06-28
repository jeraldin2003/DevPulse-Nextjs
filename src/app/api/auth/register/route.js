import { NextResponse } from "next/server";
import { backendJson } from "@/lib/backend-client.js";

export async function POST(request) {
  const body = await request.json();
  const result = await backendJson("/auth/register", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return NextResponse.json(result.json, { status: result.status });
}
