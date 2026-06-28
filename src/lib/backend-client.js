import "server-only";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "./auth-cookies.js";
import { setAuthCookies } from "./session.js";

export function getBackendBaseUrl() {
  const configured = process.env.BACKEND_API_URL || "http://localhost:3001/api";
  const trimmed = configured.replace(/\/$/, "");
  return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
}

export function backendUrl(path) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${getBackendBaseUrl()}${normalized}`;
}

export async function backendFetch(path, options = {}) {
  const url = backendUrl(path);
  const headers = new Headers(options.headers || {});
  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  try {
    return await fetch(url, {
      ...options,
      headers,
      cache: "no-store",
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: `Unable to reach backend at ${getBackendBaseUrl()}`,
        detail: error?.message,
      }),
      {
        status: 502,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function backendJson(path, options = {}) {
  const response = await backendFetch(path, options);
  return parseBackendResponse(response);
}

export async function parseBackendResponse(response) {
  let json = null;
  try {
    json = await response.json();
  } catch {
    json = { success: false, error: `Backend returned non-JSON response (${response.status})` };
  }

  return {
    ok: response.ok,
    status: response.status,
    json,
  };
}

export function jsonResponse(payload, status = 200) {
  return NextResponse.json(payload, { status });
}

export async function authenticatedBackendJson(path, options = {}) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_COOKIE)?.value;
  const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;

  const first = await requestWithToken(path, options, accessToken);
  if (first.status !== 401 && first.status !== 403) return { ...first, rotated: null };
  if (!refreshToken) return { ...first, rotated: null };

  const refresh = await backendJson("/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });

  const data = refresh.json?.data;
  if (!refresh.ok || !data?.accessToken || !data?.refreshToken) {
    return { ...first, rotated: null };
  }

  const retry = await requestWithToken(path, options, data.accessToken);
  return {
    ...retry,
    rotated: {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    },
  };
}

async function requestWithToken(path, options, token) {
  const headers = new Headers(options.headers || {});
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (!headers.has("Content-Type") && options.body) headers.set("Content-Type", "application/json");

  const response = await backendFetch(path, { ...options, headers });
  return parseBackendResponse(response);
}

export async function proxyAuthenticatedResponse(path, options = {}, user) {
  const result = await authenticatedBackendJson(path, options);
  const response = NextResponse.json(result.json, { status: result.status });
  if (result.rotated && user) {
    await setAuthCookies(response, { ...result.rotated, user });
  }
  return response;
}
