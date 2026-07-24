"use server";

import { verifyCredentials, createUser, UserProfile, UserMedication, updateUserMedications } from "@/lib/auth-store";
import { createSessionCookie, destroySessionCookie, getCurrentUserSession } from "@/lib/session";

export interface AuthActionResult {
  success: boolean;
  user?: UserProfile | null;
  error?: string;
}

/**
 * Sign In Server Action with username and password
 */
export async function signInAction(formData: {
  username: string;
  password: string;
}): Promise<AuthActionResult> {
  const { username, password } = formData;

  if (!username || !password) {
    return { success: false, error: "Please enter both username and password." };
  }

  try {
    const user = await verifyCredentials(username, password);
    if (!user) {
      return { success: false, error: "Invalid username or password." };
    }

    await createSessionCookie(user);
    return { success: true, user };
  } catch (err: any) {
    return { success: false, error: err.message || "Sign in failed." };
  }
}

/**
 * Sign Up Server Action with username, password, full name, and role
 */
export async function signUpAction(formData: {
  username: string;
  password: string;
  fullName: string;
  role?: "doctor" | "patient" | "researcher";
  grantToken?: string;
}): Promise<AuthActionResult> {
  const { username, password, fullName, role, grantToken } = formData;

  if (!username || !password) {
    return { success: false, error: "Username and password are required." };
  }

  try {
    const newUser = await createUser({
      username,
      password,
      fullName: fullName || username,
      role: role || "patient",
      grantToken,
    });

    await createSessionCookie(newUser);
    return { success: true, user: newUser };
  } catch (err: any) {
    return { success: false, error: err.message || "Registration failed." };
  }
}

/**
 * Sign Out Server Action
 */
export async function signOutAction(): Promise<{ success: boolean }> {
  try {
    await destroySessionCookie();
    return { success: true };
  } catch (err) {
    console.error("Sign out error:", err);
    return { success: false };
  }
}

/**
 * Get current authenticated user session
 */
export async function getCurrentUserAction(): Promise<AuthActionResult> {
  try {
    const user = await getCurrentUserSession();
    return { success: true, user };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Update user prescription list in database
 */
export async function updateUserPrescriptionsAction(
  medications: UserMedication[]
): Promise<AuthActionResult> {
  try {
    const currentUser = await getCurrentUserSession();
    if (!currentUser) {
      return { success: false, error: "Not authenticated." };
    }

    const updatedUser = await updateUserMedications(currentUser.id, medications);
    return { success: true, user: updatedUser };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update prescriptions." };
  }
}
