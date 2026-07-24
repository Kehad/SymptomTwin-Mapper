"use client";

import { HeartPulse, Activity, TrendingUp, ShieldAlert } from "lucide-react";
import { DashboardMetrics } from "@/lib/health-profile-store";

interface DashboardMetricsGridProps {
  metrics: DashboardMetrics | null;
}

export function DashboardMetricsGrid({ metrics }: DashboardMetricsGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
        <span className="text-xs font-bold capitalize block mt-0.5 text-rose-600">
          {metrics ? `${metrics.riskLevel} risk` : "Not set"}
        </span>
      </div>
    </div>
  );
}
