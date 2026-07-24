// src/lib/session.ts
import { cookies } from "next/headers";
import { getUserById, UserProfile } from "./auth-store";

const SESSION_COOKIE_NAME = "pharmatwin_session";
const SESSION_EXPIRY_DAYS = 7;

export interface SessionData {
  userId: string;
  username: string;
  role: string;
  createdAt: number;
}

/**
 * Encode session object into a base64 session token
 */
function encodeSession(data: SessionData): string {
  const jsonStr = JSON.stringify(data);
  return Buffer.from(jsonStr, "utf-8").toString("base64url");
}

/**
 * Decode session token into SessionData
 */
function decodeSession(token: string): SessionData | null {
  try {
    const jsonStr = Buffer.from(token, "base64url").toString("utf-8");
    return JSON.parse(jsonStr) as SessionData;
  } catch (e) {
    return null;
  }
}

/**
 * Create a session cookie for the authenticated user
 */
export async function createSessionCookie(user: UserProfile) {
  const cookieStore = await cookies();
  const sessionData: SessionData = {
    userId: user.id,
    username: user.username,
    role: user.role,
    createdAt: Date.now(),
  };

  const token = encodeSession(sessionData);

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60,
  });
}

/**
 * Clear the current session cookie (Sign Out)
 */
export async function destroySessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Get current session user profile
 */
export async function getCurrentUserSession(): Promise<UserProfile | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;

    const sessionData = decodeSession(token);
    if (!sessionData || !sessionData.userId) return null;

    const user = await getUserById(sessionData.userId);
    return user;
  } catch (e) {
    return null;
  }
}
