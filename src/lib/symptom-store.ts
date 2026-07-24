// src/lib/symptom-store.ts
import { supabase } from "./supabase";

export interface HpoPhenotype {
  hpoCode: string; // e.g., "HP:0001658"
  hpoName: string; // e.g., "Chest Pain"
  snomedCode?: string; // e.g., "29857009"
  definition?: string;
}

export interface SymptomEvent {
  id: string;
  userId: string;
  bodyRegion: "head" | "chest" | "lungs" | "abdomen" | "joints";
  regionName: string;
  system: "nervous" | "cardiovascular" | "pulmonary" | "digestive" | "musculoskeletal";
  symptomName: string;
  severity: number; // 1 - 10
  hpo: HpoPhenotype;
  notes?: string;
  timestamp: string; // ISO String
}

export interface PatternCluster {
  id: string;
  system: string;
  regionName: string;
  eventCount: number;
  avgSeverity: number;
  timeWindowDays: number;
  clusterSeverity: "mild" | "moderate" | "critical";
  hpoCodes: string[];
  recommendation: string;
  flaggedToTwin: boolean;
}

// Local runtime store for fast access
const runtimeSymptomEvents: SymptomEvent[] = [];

/**
 * Log a new symptom event to Supabase
 */
export async function addSymptomEvent(event: Omit<SymptomEvent, "id">): Promise<SymptomEvent> {
  const eventId = `sym_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  const newEvent: SymptomEvent = {
    ...event,
    id: eventId,
  };

  runtimeSymptomEvents.unshift(newEvent);

  try {
    await supabase.from("symptom_events").insert([newEvent]);
  } catch (e) {
    console.warn("Supabase addSymptomEvent fallback:", e);
  }

  return newEvent;
}

/**
 * Get symptom events for user from Supabase
 */
export async function getSymptomEvents(userId?: string): Promise<SymptomEvent[]> {
  try {
    let query = supabase.from("symptom_events").select("*");
    if (userId) {
      query = query.eq("userId", userId);
    }
    const { data } = await query.order("timestamp", { ascending: false });

    if (data && data.length > 0) {
      return data as SymptomEvent[];
    }
  } catch (e) {
    console.warn("Supabase getSymptomEvents error:", e);
  }

  // Fallback to runtime store if user filtered or Supabase offline
  if (userId) {
    return runtimeSymptomEvents.filter((ev) => ev.userId === userId);
  }
  return runtimeSymptomEvents;
}

/**
 * Detect longitudinal symptom clusters for pattern spotting
 */
export async function detectSymptomClusters(userId?: string): Promise<PatternCluster[]> {
  const events = await getSymptomEvents(userId);

  // Group events by body system
  const systemMap = new Map<string, SymptomEvent[]>();
  events.forEach((ev) => {
    const list = systemMap.get(ev.system) || [];
    list.push(ev);
    systemMap.set(ev.system, list);
  });

  const clusters: PatternCluster[] = [];

  systemMap.forEach((sysEvents, system) => {
    if (sysEvents.length >= 2) {
      const avgSeverity = Math.round(
        sysEvents.reduce((acc, curr) => acc + curr.severity, 0) / sysEvents.length
      );
      const hpoCodes = Array.from(new Set(sysEvents.map((ev) => ev.hpo.hpoCode)));
      const isCritical = sysEvents.length >= 2 && avgSeverity >= 7;

      const clusterObj: PatternCluster = {
        id: `clust_${system}_${Date.now()}`,
        system,
        regionName: sysEvents[0].regionName,
        eventCount: sysEvents.length,
        avgSeverity,
        timeWindowDays: 7,
        clusterSeverity: isCritical ? "critical" : avgSeverity >= 5 ? "moderate" : "mild",
        hpoCodes,
        recommendation: isCritical
          ? `High-priority ${system} cluster detected (${sysEvents.length} events, avg severity ${avgSeverity}/10). Recommended immediate clinical evaluation.`
          : `Recurring ${system} symptom activity observed over past 7 days.`,
        flaggedToTwin: isCritical,
      };

      clusters.push(clusterObj);

      // Save cluster to Supabase
      try {
        supabase.from("symptom_clusters").insert([clusterObj]).then(() => {});
      } catch (e) {
        // Silent fallback
      }
    }
  });

  return clusters;
}
