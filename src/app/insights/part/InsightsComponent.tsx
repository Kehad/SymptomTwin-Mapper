"use client";

import { useState } from "react";
import { searchDrugs } from "@/app/actions/pharma";
import {
  ShieldCheck,
  Search,
  RefreshCw,
  Flame,
  Activity,
  CheckCircle2,
} from "lucide-react";

export function InsightsComponent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (query: string) => {
    if (!query || query.length < 2) return;
    setIsSearching(true);
    try {
      const res = await searchDrugs(query);
      setSearchResults(res);
    } catch (e) {
      console.error("Search error:", e);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
          <ShieldCheck className="w-7 h-7 text-cyan-600" /> HOLON Clinical Safety Report & Insights
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Review full clinical reports, query CYP450 metabolic pathways, and resolve drug concepts in HOLON.
        </p>
      </div>

      {/* Drug Concept Search Engine */}
      <div className="card-clean p-6 rounded-2xl space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Search className="w-5 h-5 text-cyan-600" /> HOLON Drug Concept & RxNorm Search
        </h2>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search RxNorm concepts, SMILES, or clinical synonyms (e.g. Clopidogrel)..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleSearch(e.target.value);
              }}
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition shadow-sm"
            />
          </div>
          {isSearching && <RefreshCw className="w-5 h-5 text-cyan-600 animate-spin self-center" />}
        </div>

        {/* Search Results Display */}
        {searchResults && (
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs font-mono">
            <span className="text-slate-500 block font-bold">Concept Search Hits:</span>
            <pre className="text-slate-800 overflow-x-auto p-3 bg-white rounded-lg border border-slate-200">
              {JSON.stringify(searchResults, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Pathway Breakdown Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-clean p-6 rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Flame className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">CYP2C19 Metabolic Pathway</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Clopidogrel requires biotransformation by CYP2C19 into its active thiol metabolite. Co-administration of CYP2C19 inhibitors (e.g. Omeprazole) reduces antiplatelet efficacy.
          </p>
        </div>

        <div className="card-clean p-6 rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600">
            <Activity className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Hemodynamic Strain Index</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Beta-blockers (e.g. Metoprolol) attenuate sympathetic cardiac strain. Monitoring baseline heart rate prevents bradycardia when combining with digoxin or non-dihydropyridine CCBs.
          </p>
        </div>

        <div className="card-clean p-6 rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Renal Clearance & eGFR</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Renal organ digital twins monitor glomerular filtration rate (eGFR) and drug elimination kinetics to prevent nephrotoxicity in polypharmacy regimens.
          </p>
        </div>
      </div>
    </div>
  );
}
