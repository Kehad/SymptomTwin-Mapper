"use server";

import { getCurrentUserSession } from "@/lib/session";
import {
  saveHealthProfile,
  getHealthProfile,
  computeDashboardMetrics,
  HealthProfile,
  DashboardMetrics,
} from "@/lib/health-profile-store";
import { getSymptomEvents } from "@/lib/symptom-store";

export interface HealthProfileActionResult {
  success: boolean;
  profile?: HealthProfile | null;
  error?: string;
}

export interface DashboardDataResult {
  success: boolean;
  profile?: HealthProfile | null;
  metrics?: DashboardMetrics | null;
  needsOnboarding: boolean;
  error?: string;
}

/**
 * Save health profile from onboarding form
 */
export async function saveHealthProfileAction(formData: {
  age: number;
  sex: "male" | "female" | "other";
  heightCm: number;
  weightKg: number;
  conditions: string[];
  medications: string[];
  smokingStatus: "never" | "former" | "current";
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "very_active";
}): Promise<HealthProfileActionResult> {
  try {
    const session = await getCurrentUserSession();
    if (!session) {
      return { success: false, error: "Not authenticated." };
    }

    const profile = await saveHealthProfile(session.id, formData);
    return { success: true, profile };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to save health profile." };
  }
}

/**
 * Get all dashboard data: health profile + computed metrics + symptom summary
 */
export async function getDashboardDataAction(): Promise<DashboardDataResult> {
  try {
    const session = await getCurrentUserSession();
    if (!session) {
      return { success: false, needsOnboarding: false, error: "Not authenticated." };
    }

    // Check if user has a health profile
    const profile = await getHealthProfile(session.id);

    if (!profile) {
      return { success: true, needsOnboarding: true, profile: null, metrics: null };
    }

    // Fetch symptom history for this user to compute derived metrics
    const events = await getSymptomEvents(session.id);
    const avgSeverity =
      events.length > 0
        ? events.reduce((sum, e) => sum + e.severity, 0) / events.length
        : 0;

    const metrics = computeDashboardMetrics(profile, events.length, avgSeverity);

    return { success: true, needsOnboarding: false, profile, metrics };
  } catch (err: any) {
    return { success: false, needsOnboarding: false, error: err.message };
  }
}

/**
 * Get the current user's health profile (for Settings page)
 */
export async function getHealthProfileAction(): Promise<HealthProfileActionResult> {
  try {
    const session = await getCurrentUserSession();
    if (!session) {
      return { success: false, error: "Not authenticated." };
    }
    const profile = await getHealthProfile(session.id);
    return { success: true, profile };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
