// src/lib/health-profile-store.ts
import { supabase } from "./supabase";

export interface HealthProfile {
  id: string;
  userId: string;
  age: number;
  sex: "male" | "female" | "other";
  heightCm: number;
  weightKg: number;
  bmi: number;
  conditions: string[];
  medications: string[];
  smokingStatus: "never" | "former" | "current";
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "very_active";
  riskScore: number;
  riskLevel: "low" | "moderate" | "high" | "critical";
  createdAt: string;
}

export interface DashboardMetrics {
  bmi: number;
  bmiCategory: string;
  estimatedHeartRate: number;
  organStrainPct: number;
  riskScore: number;
  riskLevel: "low" | "moderate" | "high" | "critical";
  riskColor: string;
}

/**
 * Calculate BMI from height and weight
 */
export function calculateBMI(heightCm: number, weightKg: number): number {
  const heightM = heightCm / 100;
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
}

/**
 * Get BMI category label
 */
export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal Weight";
  if (bmi < 30) return "Overweight";
  return "Obese";
}

/**
 * Calculate clinical risk score from profile data (0-100)
 */
export function calculateRiskScore(data: {
  age: number;
  bmi: number;
  conditions: string[];
  smokingStatus: string;
  activityLevel: string;
}): { score: number; level: "low" | "moderate" | "high" | "critical" } {
  let score = 0;

  // Age contribution
  if (data.age >= 65) score += 25;
  else if (data.age >= 50) score += 15;
  else if (data.age >= 40) score += 8;

  // BMI contribution
  if (data.bmi >= 35) score += 20;
  else if (data.bmi >= 30) score += 12;
  else if (data.bmi >= 25) score += 5;
  else if (data.bmi < 18.5) score += 8;

  // Conditions contribution
  const highRiskConditions = ["heart_disease", "diabetes", "hypertension", "copd", "chronic_kidney_disease"];
  const moderateRiskConditions = ["asthma", "depression", "anxiety", "arthritis", "thyroid_disorder"];
  data.conditions.forEach((c) => {
    if (highRiskConditions.includes(c)) score += 15;
    else if (moderateRiskConditions.includes(c)) score += 6;
    else score += 3;
  });

  // Smoking contribution
  if (data.smokingStatus === "current") score += 15;
  else if (data.smokingStatus === "former") score += 5;

  // Activity contribution (lower activity = higher risk)
  if (data.activityLevel === "sedentary") score += 10;
  else if (data.activityLevel === "light") score += 5;
  else if (data.activityLevel === "active") score -= 3;
  else if (data.activityLevel === "very_active") score -= 5;

  const finalScore = Math.min(100, Math.max(0, score));

  let level: "low" | "moderate" | "high" | "critical";
  if (finalScore < 20) level = "low";
  else if (finalScore < 45) level = "moderate";
  else if (finalScore < 70) level = "high";
  else level = "critical";

  return { score: finalScore, level };
}

/**
 * Derive dashboard display metrics from health profile + symptom data
 */
export function computeDashboardMetrics(
  profile: HealthProfile,
  symptomCount: number,
  avgSymptomSeverity: number
): DashboardMetrics {
  const bmiCategory = getBMICategory(profile.bmi);

  // Estimate resting heart rate from age + activity + BMI
  let baseHR = 70;
  if (profile.age > 60) baseHR += 5;
  if (profile.bmi > 30) baseHR += 8;
  if (profile.activityLevel === "active" || profile.activityLevel === "very_active") baseHR -= 8;
  if (profile.smokingStatus === "current") baseHR += 5;
  const estimatedHeartRate = Math.max(55, Math.min(100, baseHR));

  // Organ strain = risk score weighted by recent symptom severity
  const symptomContribution = symptomCount > 0 ? (avgSymptomSeverity / 10) * 25 : 0;
  const organStrainPct = Math.min(
    99,
    Math.round((profile.riskScore / 3) + symptomContribution)
  );

  const riskColorMap: Record<string, string> = {
    low: "emerald",
    moderate: "amber",
    high: "orange",
    critical: "rose",
  };

  return {
    bmi: profile.bmi,
    bmiCategory,
    estimatedHeartRate,
    organStrainPct,
    riskScore: profile.riskScore,
    riskLevel: profile.riskLevel,
    riskColor: riskColorMap[profile.riskLevel] ?? "slate",
  };
}

/**
 * Save or update user health profile in Supabase
 */
export async function saveHealthProfile(
  userId: string,
  data: {
    age: number;
    sex: "male" | "female" | "other";
    heightCm: number;
    weightKg: number;
    conditions: string[];
    medications: string[];
    smokingStatus: "never" | "former" | "current";
    activityLevel: "sedentary" | "light" | "moderate" | "active" | "very_active";
  }
): Promise<HealthProfile> {
  const bmi = calculateBMI(data.heightCm, data.weightKg);
  const { score, level } = calculateRiskScore({
    age: data.age,
    bmi,
    conditions: data.conditions,
    smokingStatus: data.smokingStatus,
    activityLevel: data.activityLevel,
  });

  const profileId = `hp_${userId}_${Date.now()}`;
  const profile: HealthProfile = {
    id: profileId,
    userId,
    ...data,
    bmi,
    riskScore: score,
    riskLevel: level,
    createdAt: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("user_health_profiles")
    .upsert([{ ...profile, userId }], { onConflict: "userId" });

  if (error) {
    console.error("Supabase saveHealthProfile error:", error);
  }

  return profile;
}

/**
 * Get user health profile from Supabase by userId
 */
export async function getHealthProfile(userId: string): Promise<HealthProfile | null> {
  const { data, error } = await supabase
    .from("user_health_profiles")
    .select("*")
    .eq("userId", userId)
    .maybeSingle();

  if (error) {
    console.warn("Supabase getHealthProfile error:", error);
    return null;
  }

  return data as HealthProfile | null;
}
