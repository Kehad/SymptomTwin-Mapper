// src/lib/session.ts
import { cookies } from "next/headers";
import { getUserById, UserProfile } from "./auth-store";

const SESSION_COOKIE_NAME = "pharmatwin_session";
const SESSION_EXPIRY_DAYS = 7;

export interface SessionData {
  userId: string;
  username: string;
  fullName: string;
  role: string;
  grantToken: string;
  medications: any[];
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
 * Create a session cookie for the authenticated user.
 * Stores the full UserProfile in the cookie so auth state is available
 * instantly without requiring a Supabase database lookup.
 */
export async function createSessionCookie(user: UserProfile) {
  const cookieStore = await cookies();
  const sessionData: SessionData = {
    userId: user.id,
    username: user.username,
    fullName: user.fullName,
    role: user.role,
    grantToken: user.grantToken,
    medications: user.medications,
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
 * Get current session user profile.
 * First decodes the full profile from the cookie (works without Supabase).
 * Falls back to database lookup if session only has userId.
 */
export async function getCurrentUserSession(): Promise<UserProfile | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;

    const sessionData = decodeSession(token);
    if (!sessionData || !sessionData.userId) return null;

    // If the cookie contains the full profile (new format), return it directly
    if (sessionData.fullName && sessionData.grantToken) {
      return {
        id: sessionData.userId,
        username: sessionData.username,
        fullName: sessionData.fullName,
        role: sessionData.role as "doctor" | "patient" | "researcher",
        grantToken: sessionData.grantToken,
        medications: sessionData.medications || [],
        createdAt: new Date(sessionData.createdAt).toISOString(),
      };
    }

    // Fallback: old format cookie — try database lookup
    const user = await getUserById(sessionData.userId);
    return user;
  } catch (e) {
    return null;
  }
}
