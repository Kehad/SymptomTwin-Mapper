"use client";

import { Search, RefreshCw } from "lucide-react";

interface InsightsSearchProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  isSearching: boolean;
  onSearch: (query: string) => void;
  searchResults: any;
}

export function InsightsSearch({
  searchQuery,
  setSearchQuery,
  isSearching,
  onSearch,
  searchResults,
}: InsightsSearchProps) {
  return (
    <div className="card-clean p-6 rounded-2xl space-y-4 bg-white border border-slate-200">
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
              onSearch(e.target.value);
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
  );
}
