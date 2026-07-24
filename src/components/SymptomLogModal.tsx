"use client";

import { useState, useEffect } from "react";
import { logSymptomAction, resolvePhenotypeAction } from "@/app/actions/symptoms";
import { HpoPhenotype } from "@/lib/symptom-store";
import {
  X,
  Plus,
  ShieldCheck,
  AlertTriangle,
  Loader2,
  Sliders,
  Sparkles,
} from "lucide-react";

interface SymptomLogModalProps {
  isOpen: boolean;
  region: {
    id: "head" | "chest" | "lungs" | "abdomen" | "joints";
    name: string;
    system: "nervous" | "cardiovascular" | "pulmonary" | "digestive" | "musculoskeletal";
  } | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function SymptomLogModal({ isOpen, region, onClose, onSuccess }: SymptomLogModalProps) {
  const [symptomName, setSymptomName] = useState("");
  const [severity, setSeverity] = useState(6);
  const [notes, setNotes] = useState("");
  const [hpoPreview, setHpoPreview] = useState<HpoPhenotype | null>(null);
  const [isResolving, setIsResolving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounced live HOLON Phenotype Resolution preview
  useEffect(() => {
    if (!symptomName || symptomName.length < 2) {
      setHpoPreview(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsResolving(true);
      try {
        const resolved = await resolvePhenotypeAction(symptomName);
        setHpoPreview(resolved);
      } catch (e) {
        console.error("Resolution preview error:", e);
      } finally {
        setIsResolving(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [symptomName]);

  if (!isOpen || !region) return null;

  const getSeverityLabel = (sev: number) => {
    if (sev >= 8) return { text: "Critical / Severe", color: "text-rose-600 font-extrabold" };
    if (sev >= 5) return { text: "Moderate Strain", color: "text-amber-600 font-bold" };
    return { text: "Mild Discomfort", color: "text-emerald-600 font-semibold" };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptomName.trim()) return;

    setError(null);
    setIsSubmitting(true);

    try {
      const res = await logSymptomAction({
        bodyRegion: region.id,
        regionName: region.name,
        system: region.system,
        symptomName: symptomName.trim(),
        severity: Number(severity),
        notes: notes.trim(),
      });

      if (res.success) {
        onSuccess();
        onClose();
        setSymptomName("");
        setSeverity(6);
        setNotes("");
      } else {
        setError(res.error || "Failed to log symptom event.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const severityInfo = getSeverityLabel(severity);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition p-2 rounded-full hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Banner */}
        <div className="bg-slate-50 p-6 border-b border-slate-200/80">
          <div className="flex items-center gap-2 text-cyan-700 font-bold text-base mb-1">
            <ShieldCheck className="w-5 h-5 text-cyan-600" />
            <span>Pin Symptom to Twin System</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">{region.name}</h2>
          <p className="text-slate-500 text-xs mt-1">
            Target System: <strong className="capitalize font-mono text-cyan-700">{region.system} System</strong>
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Symptom Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Symptom Description (Free-text)
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Chest tightness during exertion or Sharp headache..."
              value={symptomName}
              onChange={(e) => setSymptomName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition shadow-sm"
            />
          </div>

          {/* Live HOLON Phenotype Resolution Preview */}
          {symptomName.length >= 2 && (
            <div className="p-3.5 rounded-xl bg-cyan-50/60 border border-cyan-200/80 space-y-1 text-xs">
              <div className="flex items-center justify-between font-mono text-cyan-800 font-bold">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-600" /> HOLON Phenotype Match:
                </span>
                {isResolving && <Loader2 className="w-3.5 h-3.5 text-cyan-600 animate-spin" />}
              </div>

              {hpoPreview && (
                <div>
                  <div className="flex justify-between font-mono text-xs font-bold text-slate-900 mt-1">
                    <span>{hpoPreview.hpoName}</span>
                    <span className="text-cyan-700 bg-cyan-100 px-2 py-0.5 rounded font-mono">
                      {hpoPreview.hpoCode}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    SNOMED CT: <span className="font-mono">{hpoPreview.snomedCode}</span> — {hpoPreview.definition}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Severity Slider (1 to 10) */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-700 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-cyan-600" /> Severity Rating (1 - 10):
              </label>
              <span className={`font-mono text-sm ${severityInfo.color}`}>
                {severity}/10 ({severityInfo.text})
              </span>
            </div>

            <input
              type="range"
              min="1"
              max="10"
              value={severity}
              onChange={(e) => setSeverity(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
            />
          </div>

          {/* Clinical Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Clinical Notes / Trigger Context (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Occurred after exertion, duration 15 mins..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition shadow-sm"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !symptomName.trim()}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-xl text-xs transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Pinning Event to Digital Twin...</span>
            ) : (
              <>
                <Plus className="w-4 h-4" /> Resolve Phenotype & Pin Twin Event
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
