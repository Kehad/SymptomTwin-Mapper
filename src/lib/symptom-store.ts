// src/lib/symptom-store.ts

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

// Pre-seeded historical symptom events for pattern spotting demo
const symptomDb: SymptomEvent[] = [
  {
    id: "sym_001",
    userId: "usr_smith_01",
    bodyRegion: "chest",
    regionName: "Chest / Heart Region",
    system: "cardiovascular",
    symptomName: "Chest tightness during exertion",
    severity: 8,
    hpo: {
      hpoCode: "HP:0001658",
      hpoName: "Angina Pectoris / Chest Pain",
      snomedCode: "29857009",
      definition: "Discomfort or painful pressure in the substernal chest region.",
    },
    notes: "Felt acute tightness after walking up stairs.",
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "sym_002",
    userId: "usr_smith_01",
    bodyRegion: "chest",
    regionName: "Chest / Heart Region",
    system: "cardiovascular",
    symptomName: "Heart palpitations & rapid beat",
    severity: 7,
    hpo: {
      hpoCode: "HP:0001962",
      hpoName: "Palpitations",
      snomedCode: "80313002",
      definition: "Unpleasant awareness of forceful, rapid, or irregular beating of the heart.",
    },
    notes: "Occurred during evening rest.",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "sym_003",
    userId: "usr_smith_01",
    bodyRegion: "head",
    regionName: "Head / Brain Region",
    system: "nervous",
    symptomName: "Frontal throbbing headache",
    severity: 5,
    hpo: {
      hpoCode: "HP:0002315",
      hpoName: "Headache",
      snomedCode: "25064002",
      definition: "Cephalea discomfort localized to the cranial vault.",
    },
    notes: "Mild sensitivity to light.",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "sym_004",
    userId: "usr_smith_01",
    bodyRegion: "joints",
    regionName: "Joints / Knee & Wrist",
    system: "musculoskeletal",
    symptomName: "Morning joint stiffness",
    severity: 4,
    hpo: {
      hpoCode: "HP:0002829",
      hpoName: "Arthralgia",
      snomedCode: "57676002",
      definition: "Joint pain or periarticular stiffness.",
    },
    notes: "Eased after warm shower.",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

/**
 * Log a new symptom event
 */
export async function addSymptomEvent(event: Omit<SymptomEvent, "id">): Promise<SymptomEvent> {
  const newEvent: SymptomEvent = {
    ...event,
    id: `sym_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
  };

  symptomDb.unshift(newEvent);
  return newEvent;
}

/**
 * Get all symptom events for user
 */
export async function getSymptomEvents(userId?: string): Promise<SymptomEvent[]> {
  if (!userId) return symptomDb;
  return symptomDb.filter((ev) => ev.userId === userId || ev.userId === "usr_smith_01");
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

      clusters.push({
        id: `clust_${system}_${Date.now()}`,
        system,
        regionName: sysEvents[0].regionName,
        eventCount: sysEvents.length,
        avgSeverity,
        timeWindowDays: 7,
        clusterSeverity: isCritical ? "critical" : avgSeverity >= 5 ? "moderate" : "mild",
        hpoCodes,
        recommendation: isCritical
          ? `High-priority ${system} cluster detected (${sysEvents.length} events, avg severity ${avgSeverity}/10). Recommended immediate cardiology/clinical evaluation.`
          : `Recurring ${system} symptom activity observed over past 7 days.`,
        flaggedToTwin: isCritical,
      });
    }
  });

  return clusters;
}
