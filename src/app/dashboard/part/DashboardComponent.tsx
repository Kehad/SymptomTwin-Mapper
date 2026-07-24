"use client";

import { useState, useEffect } from "react";
import { useRequireAuth } from "@/lib/use-auth";
import { getDashboardDataAction } from "@/app/actions/health-profile";
import { getSymptomHistoryAction } from "@/app/actions/symptoms";
import { HealthProfile, DashboardMetrics } from "@/lib/health-profile-store";
import { SymptomEvent, PatternCluster } from "@/lib/symptom-store";
import { BodyMapCanvas } from "@/components/BodyMapCanvas";
import { SymptomLogModal } from "@/components/SymptomLogModal";
import { useRouter } from "next/navigation";
import { MapPin, TrendingUp, Activity, Dna, AlertCircle } from "lucide-react";
import { DashboardHeroBanner } from "./DashboardHeroBanner";
import { DashboardMetricsGrid } from "./DashboardMetricsGrid";
import { DashboardRecentEvents } from "./DashboardRecentEvents";

export function DashboardComponent() {
  const { user, loading: authLoading } = useRequireAuth();
  const router = useRouter();

  const [profile, setProfile] = useState<HealthProfile | null>(null);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [events, setEvents] = useState<SymptomEvent[]>([]);
  const [clusters, setClusters] = useState<PatternCluster[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  const [selectedRegion, setSelectedRegion] = useState<{
    id: "head" | "chest" | "lungs" | "abdomen" | "joints";
    name: string;
    system: "nervous" | "cardiovascular" | "pulmonary" | "digestive" | "musculoskeletal";
  } | null>(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  const loadData = async () => {
    const [dashResult, symptomResult] = await Promise.all([
      getDashboardDataAction(),
      getSymptomHistoryAction(),
    ]);

    if (dashResult.needsOnboarding) {
      router.push("/onboarding");
      return;
    }

    setProfile(dashResult.profile ?? null);
    setMetrics(dashResult.metrics ?? null);
    setEvents(symptomResult.events);
    setClusters(symptomResult.clusters);
    setDataLoading(false);
  };

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const handleSelectRegion = (region: {
    id: "head" | "chest" | "lungs" | "abdomen" | "joints";
    name: string;
    system: "nervous" | "cardiovascular" | "pulmonary" | "digestive" | "musculoskeletal";
  }) => {
    setSelectedRegion(region);
    setIsLogModalOpen(true);
  };

  if (authLoading || dataLoading || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-500 gap-3">
        <Activity className="w-8 h-8 text-cyan-600 animate-spin" />
        <p className="text-xs font-mono font-semibold">Loading your health dashboard from database...</p>
      </div>
    );
  }

  const criticalClusters = clusters.filter((c) => c.clusterSeverity === "critical");

  return (
    <div className="space-y-8 p-4 md:p-6">
      <SymptomLogModal
        isOpen={isLogModalOpen}
        region={selectedRegion}
        onClose={() => setIsLogModalOpen(false)}
        onSuccess={loadData}
      />

      {/* Patient Profile Hero Banner */}
      <DashboardHeroBanner user={user} profile={profile} metrics={metrics} />

      {/* Real Metric Cards Grid */}
      <DashboardMetricsGrid metrics={metrics} />

      {/* Alert for Active Critical Clusters */}
      {criticalClusters.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-rose-800 text-sm">
              {criticalClusters.length} Critical Symptom Cluster{criticalClusters.length > 1 ? "s" : ""} Detected
            </h3>
            <p className="text-rose-700 text-xs mt-0.5">
              Your Digital Twin has flagged recurring high-severity symptom patterns in{" "}
              {criticalClusters.map((c) => c.system).join(", ")} systems. Consider consulting a clinician.
            </p>
          </div>
        </div>
      )}

      {/* Stat Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-cyan-50 flex items-center justify-center text-cyan-600">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Symptoms Logged</span>
            <span className="text-lg font-bold text-slate-900">{events.length} Events</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Pattern Clusters</span>
            <span className="text-lg font-bold text-amber-600">{clusters.length} Detected</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Dna className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">HPO Phenotypes Resolved</span>
            <span className="text-lg font-bold text-emerald-600">{events.length} Concepts</span>
          </div>
        </div>
      </div>

      {/* Interactive Body Map Canvas */}
      <BodyMapCanvas events={events} onSelectRegion={handleSelectRegion} />

      {/* Recent Events Log */}
      <DashboardRecentEvents events={events} />
    </div>
  );
}
