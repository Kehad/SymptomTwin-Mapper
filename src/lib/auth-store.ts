// src/lib/auth-store.ts
import { supabase } from "./supabase";
import crypto from "crypto";

export interface UserMedication {
  name: string;
  rxNormId: number;
  system: string;
}

export interface UserProfile {
  id: string;
  username: string;
  fullName: string;
  role: "doctor" | "patient" | "researcher";
  grantToken: string;
  medications: UserMedication[];
  createdAt: string;
}

interface StoredUserDoc extends UserProfile {
  passwordHash: string;
  salt: string;
}

/**
 * Hash password securely using Node.js PBKDF2
 */
function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
}

function generateSalt(): string {
  return crypto.randomBytes(16).toString("hex");
}

// In-memory runtime cache for server-side fast retrieval
const localUserCache: Map<string, StoredUserDoc> = new Map();

function toUserKey(username: string): string {
  return username.trim().toLowerCase();
}

/**
 * Register a new user in Supabase
 */
export async function createUser(data: {
  username: string;
  password: string;
  fullName: string;
  role?: "doctor" | "patient" | "researcher";
  grantToken?: string;
}): Promise<UserProfile> {
  const cleanUsername = toUserKey(data.username);

  if (cleanUsername.length < 3) {
    throw new Error("Username must be at least 3 characters long.");
  }

  if (data.password.length < 4) {
    throw new Error("Password must be at least 4 characters long.");
  }

  // Check if username exists in local cache or Supabase table
  if (localUserCache.has(cleanUsername)) {
    throw new Error("Username already registered. Please sign in or choose another username.");
  }

  try {
    const { data: existingUser } = await supabase
      .from("users")
      .select("username")
      .eq("username", cleanUsername)
      .maybeSingle();

    if (existingUser) {
      throw new Error("Username already registered. Please sign in or choose another username.");
    }
  } catch (err: any) {
    if (err.message?.includes("already registered")) throw err;
    console.warn("Supabase query fallback mode:", err);
  }

  const salt = generateSalt();
  const passwordHash = hashPassword(data.password, salt);
  const userId = `usr_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

  const newStoredUser: StoredUserDoc = {
    id: userId,
    username: data.username.trim(),
    fullName: data.fullName.trim() || data.username.trim(),
    role: data.role || "patient",
    passwordHash,
    salt,
    grantToken: data.grantToken?.trim() || `dtp_grant_${cleanUsername}_${Date.now()}`,
    medications: [
      { name: "Atorvastatin", rxNormId: 83367, system: "cardiovascular" },
    ],
    createdAt: new Date().toISOString(),
  };

  // Save to local cache
  localUserCache.set(cleanUsername, newStoredUser);

  // Save to Supabase 'users' table
  try {
    await supabase.from("users").insert([newStoredUser]);
  } catch (e) {
    console.warn("Saved to auth store (Supabase offline mode):", e);
  }

  const { passwordHash: _, salt: __, ...userProfile } = newStoredUser;
  return userProfile;
}

/**
 * Validate credentials for sign in from Supabase
 */
export async function verifyCredentials(username: string, password: string): Promise<UserProfile | null> {
  const cleanUsername = toUserKey(username);
  let storedUser: StoredUserDoc | null = localUserCache.get(cleanUsername) || null;

  // Attempt to fetch from Supabase if not in local cache
  if (!storedUser) {
    try {
      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("username", cleanUsername)
        .maybeSingle();

      if (data) {
        storedUser = data as StoredUserDoc;
        localUserCache.set(cleanUsername, storedUser);
      }
    } catch (e) {
      console.warn("Supabase fetch error:", e);
    }
  }

  if (!storedUser) {
    return null;
  }

  const hash = hashPassword(password, storedUser.salt);
  if (hash !== storedUser.passwordHash) {
    return null;
  }

  const { passwordHash: _, salt: __, ...userProfile } = storedUser;
  return userProfile;
}

/**
 * Get user profile by ID from Supabase
 */
export async function getUserById(userId: string): Promise<UserProfile | null> {
  // Check local cache
  for (const user of localUserCache.values()) {
    if (user.id === userId) {
      const { passwordHash: _, salt: __, ...userProfile } = user;
      return userProfile;
    }
  }

  // Query Supabase
  try {
    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (data) {
      const storedUser = data as StoredUserDoc;
      localUserCache.set(toUserKey(storedUser.username), storedUser);
      const { passwordHash: _, salt: __, ...userProfile } = storedUser;
      return userProfile;
    }
  } catch (e) {
    console.warn("Supabase query error:", e);
  }

  return null;
}

/**
 * Update active medications for a user in Supabase
 */
export async function updateUserMedications(
  userId: string,
  medications: UserMedication[]
): Promise<UserProfile | null> {
  for (const [key, user] of localUserCache.entries()) {
    if (user.id === userId) {
      user.medications = medications;
      localUserCache.set(key, user);

      try {
        await supabase
          .from("users")
          .update({ medications })
          .eq("id", userId);
      } catch (e) {
        console.warn("Supabase update error:", e);
      }

      const { passwordHash: _, salt: __, ...userProfile } = user;
      return userProfile;
    }
  }
  return null;
}
