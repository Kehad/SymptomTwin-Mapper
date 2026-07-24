"use client";

import { useState, useEffect } from "react";
import { useRequireAuth } from "@/lib/use-auth";
import { getSymptomHistoryAction } from "@/app/actions/symptoms";
import { PatternCluster } from "@/lib/symptom-store";
import { TrendingUp, Activity } from "lucide-react";
import { PatternSummaryCards } from "./PatternSummaryCards";
import { PatternClusterList } from "./PatternClusterList";

export function PatternsComponent() {
  const { user, loading } = useRequireAuth();
  const [clusters, setClusters] = useState<PatternCluster[]>([]);

  useEffect(() => {
    async function loadData() {
      if (user) {
        const res = await getSymptomHistoryAction();
        setClusters(res.clusters);
      }
    }
    loadData();
  }, [user]);

  if (loading || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-500 gap-3">
        <Activity className="w-8 h-8 text-cyan-600 animate-spin" />
        <p className="text-xs font-mono font-semibold">Verifying Clinical Security Guard...</p>
      </div>
    );
  }

  const criticalClusters = clusters.filter((c) => c.clusterSeverity === "critical");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
          <TrendingUp className="w-8 h-8 text-cyan-600" /> Longitudinal Pattern Spotting & Alerts
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Stream past twin events over time to reveal recurring symptom clusters and trigger automated <code className="bg-slate-100 px-1.5 py-0.5 rounded text-cyan-700 font-mono">twin.flag()</code> alerts.
        </p>
      </div>

      <PatternSummaryCards clusters={clusters} criticalCount={criticalClusters.length} />

      <PatternClusterList clusters={clusters} />
    </div>
  );
}
