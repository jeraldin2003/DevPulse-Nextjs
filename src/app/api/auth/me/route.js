import { NextResponse } from "next/server";
import { verifySession } from "@/lib/session.js";

export async function GET() {
  const user = await verifySession();
  return NextResponse.json({
    authenticated: Boolean(user),
    user,
  });
}
