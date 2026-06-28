import { NextResponse } from "next/server";
import { backendJson } from "@/lib/backend-client.js";

export async function GET() {
  const result = await backendJson("/dashboard/todos");
  return NextResponse.json(result.json, { status: result.status });
}
