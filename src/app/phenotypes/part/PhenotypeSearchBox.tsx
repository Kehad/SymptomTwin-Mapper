"use client";

import { Search, RefreshCw, Sparkles } from "lucide-react";
import { HpoPhenotype } from "@/lib/symptom-store";

interface PhenotypeSearchBoxProps {
  query: string;
  setQuery: (val: string) => void;
  isResolving: boolean;
  onResolve: (term: string) => void;
  resolvedResult: HpoPhenotype | null;
}

export function PhenotypeSearchBox({
  query,
  setQuery,
  isResolving,
  onResolve,
  resolvedResult,
}: PhenotypeSearchBoxProps) {
  return (
    <div className="card-clean p-6 rounded-2xl space-y-4 bg-white border border-slate-200">
      <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
        <Search className="w-5 h-5 text-cyan-600" /> Resolve Free-Text Symptom to HPO Concept
      </h2>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Enter symptom (e.g. Sharp chest pain during exertion, dizziness, morning joint stiffness)..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              onResolve(e.target.value);
            }}
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition shadow-sm"
          />
        </div>
        {isResolving && <RefreshCw className="w-5 h-5 text-cyan-600 animate-spin self-center" />}
      </div>

      {/* Resolved Phenotype Result Card */}
      {resolvedResult && (
        <div className="p-5 bg-cyan-50/70 rounded-2xl border border-cyan-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-800 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-600" /> Resolved Phenotype Concept:
            </span>
            <span className="px-3 py-1 bg-cyan-600 text-white font-mono text-xs font-bold rounded-lg shadow-sm">
              {resolvedResult.hpoCode}
            </span>
          </div>

          <h3 className="text-lg font-bold text-slate-900">{resolvedResult.hpoName}</h3>

          <div className="pt-2 text-xs text-slate-700 space-y-1 font-mono">
            <p>
              <strong>SNOMED CT Code:</strong> {resolvedResult.snomedCode}
            </p>
            <p className="font-sans leading-relaxed text-slate-600 mt-1">
              <strong>Clinical Definition:</strong> {resolvedResult.definition}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
