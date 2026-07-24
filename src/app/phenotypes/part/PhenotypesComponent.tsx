"use client";

import { useState } from "react";
import { resolvePhenotypeAction } from "@/app/actions/symptoms";
import { HpoPhenotype } from "@/lib/symptom-store";
import {
  Dna,
  Search,
  RefreshCw,
  BookOpen,
  Sparkles,
} from "lucide-react";

const SAMPLE_PHENOTYPES: HpoPhenotype[] = [
  {
    hpoCode: "HP:0001658",
    hpoName: "Angina Pectoris / Chest Pain",
    snomedCode: "29857009",
    definition: "Discomfort or painful pressure in the substernal chest region caused by ischemia.",
  },
  {
    hpoCode: "HP:0002315",
    hpoName: "Headache / Cephalea",
    snomedCode: "25064002",
    definition: "Cephalea discomfort localized to the cranial vault or frontal lobe.",
  },
  {
    hpoCode: "HP:0001962",
    hpoName: "Palpitations / Tachycardia",
    snomedCode: "80313002",
    definition: "Unpleasant awareness of forceful, rapid, or irregular cardiac rhythm.",
  },
  {
    hpoCode: "HP:0002829",
    hpoName: "Arthralgia / Joint Pain",
    snomedCode: "57676002",
    definition: "Joint stiffness or periarticular discomfort in musculoskeletal regions.",
  },
  {
    hpoCode: "HP:0002321",
    hpoName: "Vertigo / Dizziness",
    snomedCode: "386661006",
    definition: "Sensation of instability or environmental spinning motion.",
  },
  {
    hpoCode: "HP:0002019",
    hpoName: "Nausea / Epigastric Distress",
    snomedCode: "422587007",
    definition: "Unpleasant sensation in the epigastrium with urge to vomit.",
  },
];

export function PhenotypesComponent() {
  const [query, setQuery] = useState("");
  const [resolvedResult, setResolvedResult] = useState<HpoPhenotype | null>(null);
  const [isResolving, setIsResolving] = useState(false);

  const handleResolve = async (searchTerm: string) => {
    if (!searchTerm || searchTerm.length < 2) return;
    setIsResolving(true);
    try {
      const res = await resolvePhenotypeAction(searchTerm);
      setResolvedResult(res);
    } catch (e) {
      console.error("Phenotype resolution error:", e);
    } finally {
      setIsResolving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
          <Dna className="w-8 h-8 text-cyan-600" /> HOLON Phenotype Resolution Engine
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Resolve free-text symptoms to official Human Phenotype Ontology (HPO) codes and SNOMED CT clinical terms.
        </p>
      </div>

      {/* Interactive Resolver Search Engine Card */}
      <div className="card-clean p-6 rounded-2xl space-y-4">
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
                handleResolve(e.target.value);
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

      {/* Pre-built Clinical Phenotype Reference Library */}
      <div className="card-clean p-6 rounded-2xl space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-cyan-600" /> HPO Phenotype & SNOMED CT Reference Library
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SAMPLE_PHENOTYPES.map((item) => (
            <div key={item.hpoCode} className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-slate-900 text-sm">{item.hpoName}</h3>
                <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-cyan-100 text-cyan-800">
                  {item.hpoCode}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{item.definition}</p>
              <div className="pt-1 text-[11px] font-mono text-slate-400">
                SNOMED CT: {item.snomedCode}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
