"use client";

import { BookOpen } from "lucide-react";
import { HpoPhenotype } from "@/lib/symptom-store";

interface PhenotypeLibraryGridProps {
  samplePhenotypes: HpoPhenotype[];
}

export function PhenotypeLibraryGrid({ samplePhenotypes }: PhenotypeLibraryGridProps) {
  return (
    <div className="card-clean p-6 rounded-2xl space-y-4 bg-white border border-slate-200">
      <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-cyan-600" /> HPO Phenotype & SNOMED CT Reference Library
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {samplePhenotypes.map((item) => (
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
  );
}
