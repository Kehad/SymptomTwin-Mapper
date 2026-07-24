"use client";

import { useState } from "react";
import { searchDrugs } from "@/app/actions/pharma";
import { ShieldCheck } from "lucide-react";
import { InsightsSearch } from "./InsightsSearch";
import { InsightsPathwayGrid } from "./InsightsPathwayGrid";

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

      <InsightsSearch
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isSearching={isSearching}
        onSearch={handleSearch}
        searchResults={searchResults}
      />

      <InsightsPathwayGrid />
    </div>
  );
}
