"use client";

import { Key, ChevronRight } from "lucide-react";

interface SettingsApiTabProps {
  grantToken: string;
}

export function SettingsApiTab({ grantToken }: SettingsApiTabProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-5">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Key className="w-5 h-5 text-cyan-600" /> API Keys & Ontomorph Platform
        </h2>

        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <p className="text-xs font-bold text-slate-700">DTP API Key</p>
            <p className="text-xs font-mono text-slate-500">
              {process.env.NEXT_PUBLIC_DTP_API_KEY
                ? `${process.env.NEXT_PUBLIC_DTP_API_KEY.slice(0, 16)}...`
                : "dtp_test_persona...****  (from .env)"}
            </p>
            <p className="text-[11px] text-slate-400">Server-to-server DTP platform authentication</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <p className="text-xs font-bold text-slate-700">HOLON Clinical Knowledge API Key</p>
            <p className="text-xs font-mono text-slate-500">holon_117ff6e390f0...****  (from .env)</p>
            <p className="text-[11px] text-slate-400">
              19 vocabularies — SNOMED CT, HPO, RxNorm, LOINC, DrugBank, HGNC, ClinVar and more
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <p className="text-xs font-bold text-slate-700">Digital Twin Grant Token</p>
            <p className="text-xs font-mono text-slate-500">{grantToken.slice(0, 24)}...</p>
            <p className="text-[11px] text-slate-400">Patient-issued scoped access token for twin operations</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <p className="text-xs font-bold text-slate-700">Supabase Project</p>
            <p className="text-xs font-mono text-slate-500">
              {process.env.NEXT_PUBLIC_SUPABASE_URL || "https://demo-symptomtwin.supabase.co"}
            </p>
            <p className="text-[11px] text-slate-400">User data, symptom events, health profiles, and pattern clusters</p>
          </div>
        </div>

        <a
          href="https://developer.ontomorph.com/docs"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs font-semibold text-cyan-600 hover:text-cyan-800 transition"
        >
          <ChevronRight className="w-4 h-4" /> View full Ontomorph Developer Documentation
        </a>
      </div>
    </div>
  );
}
