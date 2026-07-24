"use client";

import { TrendingUp, ShieldAlert, Clock } from "lucide-react";
import { PatternCluster } from "@/lib/symptom-store";

interface PatternSummaryCardsProps {
  clusters: PatternCluster[];
  criticalCount: number;
}

export function PatternSummaryCards({ clusters, criticalCount }: PatternSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="card-clean p-5 rounded-2xl flex items-center gap-4 bg-white border border-slate-200">
        <div className="w-12 h-12 rounded-full bg-cyan-50 flex items-center justify-center text-cyan-600 shrink-0">
          <TrendingUp className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs text-slate-500 font-medium block">Total Symptom Clusters</span>
          <span className="text-base font-bold text-slate-900">{clusters.length} Pattern Clusters</span>
        </div>
      </div>

      <div className="card-clean p-5 rounded-2xl flex items-center gap-4 bg-white border border-slate-200">
        <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs text-slate-500 font-medium block">Critical Twin Flags</span>
          <span className="text-base font-bold text-rose-600">{criticalCount} Active Alerts</span>
        </div>
      </div>

      <div className="card-clean p-5 rounded-2xl flex items-center gap-4 bg-white border border-slate-200">
        <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
          <Clock className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs text-slate-500 font-medium block">Analysis Window</span>
          <span className="text-base font-bold text-emerald-600">Past 7 Days Rolling</span>
        </div>
      </div>
    </div>
  );
}
