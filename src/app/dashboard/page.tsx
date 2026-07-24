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
import {
  LayoutDashboard,
  MapPin,
  TrendingUp,
  ShieldAlert,
  Activity,
  HeartPulse,
  Stethoscope,
  User,
  ShieldCheck,
  Clock,
  Dna,
  AlertCircle,
} from "lucide-react";

const RISK_COLORS: Record<string, string> = {
  low: "emerald",
  moderate: "amber",
  high: "orange",
  critical: "rose",
};

function RiskBadge({ level }: { level: string }) {
  const color = RISK_COLORS[level] ?? "slate";
  const colorMap: Record<string, string> = {
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    orange: "bg-orange-50 text-orange-700 border-orange-200",
    rose: "bg-rose-50 text-rose-700 border-rose-200",
    slate: "bg-slate-50 text-slate-700 border-slate-200",
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize ${colorMap[color]}`}>
      {level} risk
    </span>
  );
}

export default function DashboardPage() {
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
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-cyan-600 text-white flex items-center justify-center shadow-md">
              {user.role === "doctor" ? <Stethoscope className="w-7 h-7" /> : <User className="w-7 h-7" />}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl md:text-2xl font-extrabold text-slate-900">{user.fullName}</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-700 text-xs font-mono border border-cyan-100 capitalize">{user.role}</span>
                {metrics && <RiskBadge level={metrics.riskLevel} />}
              </div>
              <p className="text-slate-500 text-xs mt-0.5">
                @{user.username} •{" "}
                {profile && `Age ${profile.age} • ${profile.sex} • BMI ${profile.bmi}`}
              </p>
            </div>
          </div>

          <div className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs font-mono flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>DTP Grant Active</span>
          </div>
        </div>

        {/* Real Metric Cards from Database */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
          {/* Heart Rate */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2 text-slate-500 text-[11px] font-mono mb-1.5">
              <HeartPulse className="w-4 h-4 text-rose-500 animate-pulse" />
              <span>EST. RESTING HR</span>
            </div>
            <span className="text-2xl font-bold text-slate-900">
              {metrics ? `${metrics.estimatedHeartRate}` : "—"}
            </span>
            <span className="text-xs text-slate-500 block mt-0.5">beats per min</span>
          </div>

          {/* BMI */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2 text-slate-500 text-[11px] font-mono mb-1.5">
              <Activity className="w-4 h-4 text-cyan-600" />
              <span>BODY MASS INDEX</span>
            </div>
            <span className="text-2xl font-bold text-cyan-700">
              {metrics ? metrics.bmi : "—"}
            </span>
            <span className="text-xs text-slate-500 block mt-0.5">{metrics?.bmiCategory ?? "Not set"}</span>
          </div>

          {/* Organ Strain */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2 text-slate-500 text-[11px] font-mono mb-1.5">
              <TrendingUp className="w-4 h-4 text-amber-500" />
              <span>ORGAN STRAIN</span>
            </div>
            <span className="text-2xl font-bold text-amber-600">
              {metrics ? `${metrics.organStrainPct}%` : "—"}
            </span>
            <span className="text-xs text-slate-500 block mt-0.5">from risk + symptoms</span>
          </div>

          {/* Risk Score */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2 text-slate-500 text-[11px] font-mono mb-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-500" />
              <span>CLINICAL RISK SCORE</span>
            </div>
            <span className="text-2xl font-bold text-slate-900">
              {metrics ? `${metrics.riskScore}/100` : "—"}
            </span>
            <span className="text-xs block mt-0.5">
              {metrics ? <RiskBadge level={metrics.riskLevel} /> : "Not set"}
            </span>
          </div>
        </div>

        {/* Conditions & Medications Summary */}
        {profile && (profile.conditions.length > 0 || profile.medications.length > 0) && (
          <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-4">
            {profile.conditions.length > 0 && (
              <div>
                <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block mb-1.5">Conditions</span>
                <div className="flex flex-wrap gap-1.5">
                  {profile.conditions.map((c) => (
                    <span key={c} className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-100 text-xs font-medium capitalize">
                      {c.replace(/_/g, " ")}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {profile.medications.length > 0 && (
              <div>
                <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block mb-1.5">Medications</span>
                <div className="flex flex-wrap gap-1.5">
                  {profile.medications.map((m) => (
                    <span key={m} className="px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-100 text-xs font-medium">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

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
      {events.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-600" /> Recent Health Events from Database
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {events.slice(0, 4).map((ev) => (
              <div key={ev.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-slate-900 text-sm">{ev.symptomName}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-100 text-cyan-800">
                    Sev {ev.severity}/10
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  <strong>{ev.regionName}</strong> • <span className="capitalize">{ev.system}</span>
                </p>
                <p className="text-xs font-mono text-cyan-700 font-bold">{ev.hpo.hpoCode} — {ev.hpo.hpoName}</p>
                <p className="text-[11px] text-slate-400">{new Date(ev.timestamp).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
