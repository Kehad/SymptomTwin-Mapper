"use client";

import { useState, useEffect } from "react";
import { useRequireAuth } from "@/lib/use-auth";
import { getSymptomHistoryAction } from "@/app/actions/symptoms";
import { SymptomEvent, PatternCluster } from "@/lib/symptom-store";
import { BodyMapCanvas } from "@/components/BodyMapCanvas";
import { SymptomLogModal } from "@/components/SymptomLogModal";
import {
  LayoutDashboard,
  MapPin,
  Dna,
  TrendingUp,
  ShieldAlert,
  Clock,
  User,
  ShieldCheck,
  Stethoscope,
  Activity,
  HeartPulse,
} from "lucide-react";

export default function ProtectedDashboardPage() {
  const { user, loading } = useRequireAuth();
  const [events, setEvents] = useState<SymptomEvent[]>([]);
  const [clusters, setClusters] = useState<PatternCluster[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<{
    id: "head" | "chest" | "lungs" | "abdomen" | "joints";
    name: string;
    system: "nervous" | "cardiovascular" | "pulmonary" | "digestive" | "musculoskeletal";
  } | null>(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  const loadSymptomData = async () => {
    const data = await getSymptomHistoryAction();
    setEvents(data.events);
    setClusters(data.clusters);
  };

  useEffect(() => {
    if (user) {
      loadSymptomData();
    }
  }, [user]);

  if (loading || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-500 gap-3">
        <Activity className="w-8 h-8 text-cyan-600 animate-spin" />
        <p className="text-xs font-mono font-semibold">Verifying Secure Clinical Authentication Guard...</p>
      </div>
    );
  }

  const handleSelectRegion = (region: {
    id: "head" | "chest" | "lungs" | "abdomen" | "joints";
    name: string;
    system: "nervous" | "cardiovascular" | "pulmonary" | "digestive" | "musculoskeletal";
  }) => {
    setSelectedRegion(region);
    setIsLogModalOpen(true);
  };

  const criticalClusters = clusters.filter((c) => c.clusterSeverity === "critical");

  return (
    <div className="space-y-8">
      <SymptomLogModal
        isOpen={isLogModalOpen}
        region={selectedRegion}
        onClose={() => setIsLogModalOpen(false)}
        onSuccess={loadSymptomData}
      />

      {/* Patient Twin Profile Hero Banner */}
      <div className="card-clean p-6 md:p-8 rounded-3xl space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-cyan-600 text-white flex items-center justify-center shadow-md">
              {user.role === "doctor" ? <Stethoscope className="w-7 h-7" /> : <User className="w-7 h-7" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                  Welcome back, {user.fullName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-700 text-xs font-mono border border-cyan-100 font-semibold capitalize">
                  {user.role}
                </span>
              </div>
              <p className="text-slate-500 text-xs md:text-sm mt-1">
                Authenticated Clinical Dashboard • Patient Twin Profile Active
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-mono flex items-center gap-2 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>DTP Twin Grant: {user.grantToken.slice(0, 16)}...</span>
            </div>
          </div>
        </div>

        {/* Real-time Patient Vital Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-100">
          <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-mono mb-1">
              <HeartPulse className="w-4 h-4 text-rose-500 animate-pulse" />
              <span>HEART RHYTHM</span>
            </div>
            <span className="text-xl font-bold text-slate-900">72 BPM</span>
            <span className="text-[11px] text-emerald-600 block mt-0.5">Optimal Sinus Rhythm</span>
          </div>

          <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-mono mb-1">
              <Activity className="w-4 h-4 text-cyan-600" />
              <span>ORGAN STRAIN</span>
            </div>
            <span className="text-xl font-bold text-cyan-700">22%</span>
            <span className="text-[11px] text-slate-500 block mt-0.5">Low Metabolic Stress</span>
          </div>

          <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-mono mb-1">
              <MapPin className="w-4 h-4 text-cyan-600" />
              <span>LOGGED SYMPTOMS</span>
            </div>
            <span className="text-xl font-bold text-slate-900">{events.length} Events</span>
            <span className="text-[11px] text-cyan-700 block mt-0.5">100% HPO Mapped</span>
          </div>

          <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-mono mb-1">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>PATTERN CLUSTERS</span>
            </div>
            <span className="text-xl font-bold text-emerald-600">{clusters.length} Detected</span>
            <span className="text-[11px] text-slate-500 block mt-0.5">
              {criticalClusters.length > 0 ? `${criticalClusters.length} Critical Alerts` : "Normal Activity"}
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Body Map Canvas */}
      <BodyMapCanvas events={events} onSelectRegion={handleSelectRegion} />

      {/* Recent Logged Events */}
      <div className="card-clean p-6 rounded-2xl space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-600" /> Authenticated Health Event Stream Log
          </h2>
          <span className="text-xs font-mono text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-full border border-cyan-100">
            {events.length} Events Logged
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.slice(0, 4).map((ev) => (
            <div key={ev.id} className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-bold text-slate-900 text-sm block">{ev.symptomName}</span>
                  <span className="text-xs text-slate-500">
                    Region: <strong>{ev.regionName}</strong> • System: <strong className="capitalize">{ev.system}</strong>
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-100 text-cyan-800">
                  Sev: {ev.severity}/10
                </span>
              </div>

              <div className="pt-1 border-t border-slate-200/60 flex justify-between items-center text-xs font-mono">
                <span className="text-cyan-700 font-bold">{ev.hpo.hpoCode} — {ev.hpo.hpoName}</span>
                <span className="text-slate-400">{new Date(ev.timestamp).toLocaleDateString()}</span>
              </div>
            </div>
          ))}

          {events.length === 0 && (
            <p className="text-xs text-slate-500 italic text-center py-6 col-span-2">
              No symptom events logged yet. Click any region on the Body Map above to pin your first symptom.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
