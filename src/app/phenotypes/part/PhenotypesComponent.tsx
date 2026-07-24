"use client";

import { useState } from "react";
import { resolvePhenotypeAction } from "@/app/actions/symptoms";
import { HpoPhenotype } from "@/lib/symptom-store";
import { Dna } from "lucide-react";
import { PhenotypeSearchBox } from "./PhenotypeSearchBox";
import { PhenotypeLibraryGrid } from "./PhenotypeLibraryGrid";

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

      <PhenotypeSearchBox
        query={query}
        setQuery={setQuery}
        isResolving={isResolving}
        onResolve={handleResolve}
        resolvedResult={resolvedResult}
      />

      <PhenotypeLibraryGrid samplePhenotypes={SAMPLE_PHENOTYPES} />
    </div>
  );
}
