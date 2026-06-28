export const ACCESS_COOKIE = "dp_access_token";
export const REFRESH_COOKIE = "dp_refresh_token";
export const SESSION_COOKIE = "dp_session";

export const ACCESS_MAX_AGE = 15 * 60;
export const REFRESH_MAX_AGE = 7 * 24 * 60 * 60;

export function authCookieOptions(maxAge) {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}

export function expiredCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  };
}
