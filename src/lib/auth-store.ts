// src/lib/auth-store.ts
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

interface StoredUser extends UserProfile {
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

// In-memory persistent database store (pre-seeded with demo accounts)
const userDb: Map<string, StoredUser> = new Map();

function seedInitialUsers() {
  if (userDb.size > 0) return;

  // Demo User 1: Dr. Sarah Smith
  const salt1 = generateSalt();
  const drSmith: StoredUser = {
    id: "usr_smith_01",
    username: "dr_smith",
    fullName: "Dr. Sarah Smith",
    role: "doctor",
    passwordHash: hashPassword("password123", salt1),
    salt: salt1,
    grantToken: "dtp_grant_dr_smith_cardio_twin_9921",
    medications: [
      { name: "Atorvastatin", rxNormId: 83367, system: "cardiovascular" },
      { name: "Clopidogrel", rxNormId: 32968, system: "cardiovascular" },
    ],
    createdAt: new Date().toISOString(),
  };

  // Demo User 2: Jane Doe (Patient)
  const salt2 = generateSalt();
  const patientJane: StoredUser = {
    id: "usr_jane_02",
    username: "patient_jane",
    fullName: "Jane Doe (Twin #7842)",
    role: "patient",
    passwordHash: hashPassword("password123", salt2),
    salt: salt2,
    grantToken: "dtp_grant_patient_jane_twin_7842",
    medications: [
      { name: "Metoprolol", rxNormId: 918, system: "cardiovascular" },
      { name: "Aspirin", rxNormId: 1191, system: "cardiovascular" },
    ],
    createdAt: new Date().toISOString(),
  };

  userDb.set(drSmith.username.toLowerCase(), drSmith);
  userDb.set(patientJane.username.toLowerCase(), patientJane);
}

// Initialize seed
seedInitialUsers();

/**
 * Register a new user with username, password, full name, role, and optional grant token
 */
export async function createUser(data: {
  username: string;
  password: string;
  fullName: string;
  role?: "doctor" | "patient" | "researcher";
  grantToken?: string;
}): Promise<UserProfile> {
  seedInitialUsers();

  const cleanUsername = data.username.trim().toLowerCase();
  if (userDb.has(cleanUsername)) {
    throw new Error("Username already exists. Please choose another username.");
  }

  if (data.password.length < 4) {
    throw new Error("Password must be at least 4 characters long.");
  }

  const salt = generateSalt();
  const passwordHash = hashPassword(data.password, salt);
  const userId = `usr_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

  const newUser: StoredUser = {
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

  userDb.set(cleanUsername, newUser);

  // Return public profile (strip password and salt)
  const { passwordHash: _, salt: __, ...userProfile } = newUser;
  return userProfile;
}

/**
 * Validate credentials for sign in
 */
export async function verifyCredentials(username: string, password: string): Promise<UserProfile | null> {
  seedInitialUsers();

  const cleanUsername = username.trim().toLowerCase();
  const storedUser = userDb.get(cleanUsername);

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
 * Get user profile by ID
 */
export async function getUserById(userId: string): Promise<UserProfile | null> {
  seedInitialUsers();

  for (const user of userDb.values()) {
    if (user.id === userId) {
      const { passwordHash: _, salt: __, ...userProfile } = user;
      return userProfile;
    }
  }
  return null;
}

/**
 * Update active medications for a user
 */
export async function updateUserMedications(
  userId: string,
  medications: UserMedication[]
): Promise<UserProfile | null> {
  seedInitialUsers();

  for (const [key, user] of userDb.entries()) {
    if (user.id === userId) {
      user.medications = medications;
      userDb.set(key, user);

      const { passwordHash: _, salt: __, ...userProfile } = user;
      return userProfile;
    }
  }
  return null;
}
