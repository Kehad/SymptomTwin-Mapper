"use client";

import { Stethoscope, User, ShieldCheck } from "lucide-react";
import { UserProfile } from "@/lib/auth-store";
import { HealthProfile, DashboardMetrics } from "@/lib/health-profile-store";

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

interface DashboardHeroBannerProps {
  user: UserProfile;
  profile: HealthProfile | null;
  metrics: DashboardMetrics | null;
}

export function DashboardHeroBanner({ user, profile, metrics }: DashboardHeroBannerProps) {
  return (
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
  );
}
