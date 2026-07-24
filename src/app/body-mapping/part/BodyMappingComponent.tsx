"use client";

import { useState, useEffect } from "react";
import { useRequireAuth } from "@/lib/use-auth";
import {
  logSymptomAction,
  getSymptomHistoryAction,
  checkSymptomCrossReactAction,
} from "@/app/actions/symptoms";
import { getDashboardDataAction } from "@/app/actions/health-profile";
import { SymptomEvent } from "@/lib/symptom-store";
import {
  MapPin,
  Plus,
  AlertTriangle,
  X,
  Send,
  ShieldCheck,
  Clock,
  Loader2,
  Zap,
  Activity,
} from "lucide-react";
import { BodyMapSilhouette, REGIONS } from "./BodyMapSilhouette";

function getSevColor(sev: number) {
  if (sev >= 7) return "bg-rose-500";
  if (sev >= 4) return "bg-amber-500";
  return "bg-emerald-500";
}

export function BodyMappingComponent() {
  const { user, loading: authLoading } = useRequireAuth();
  const [events, setEvents] = useState<SymptomEvent[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<(typeof REGIONS)[0] | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [userMedications, setUserMedications] = useState<string[]>([]);

  // Form state
  const [symptomName, setSymptomName] = useState("");
  const [severity, setSeverity] = useState(5);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [crossReactWarning, setCrossReactWarning] = useState<string | null>(null);
  const [flagged, setFlagged] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      getSymptomHistoryAction().then((r) => setEvents(r.events));
      getDashboardDataAction().then((r) => {
        if (r.profile) setUserMedications(r.profile.medications);
      });
    }
  }, [user]);

  useEffect(() => {
    if (!symptomName || symptomName.length < 4 || userMedications.length === 0) {
      setCrossReactWarning(null);
      return;
    }
    const timer = setTimeout(async () => {
      const res = await checkSymptomCrossReactAction(symptomName, userMedications);
      setCrossReactWarning(res.warning);
    }, 600);
    return () => clearTimeout(timer);
  }, [symptomName, userMedications]);

  const handleSubmit = async () => {
    if (!selectedRegion || !symptomName) return;
    setSubmitting(true);
    setError(null);
    setSuccessMessage(null);
    setFlagged(false);

    const result = await logSymptomAction({
      bodyRegion: selectedRegion.id,
      regionName: selectedRegion.name,
      system: selectedRegion.system,
      symptomName,
      severity,
      notes,
    });

    if (result.success) {
      setFlagged(result.flagged ?? false);
      setSuccessMessage(`Symptom logged & pinned to your Digital Twin in the ${selectedRegion.system} system.`);
      setSymptomName("");
      setSeverity(5);
      setNotes("");
      const updated = await getSymptomHistoryAction();
      setEvents(updated.events);
      setTimeout(() => setSuccessMessage(null), 4000);
    } else {
      setError(result.error ?? "Failed to log symptom.");
    }
    setSubmitting(false);
  };

  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Activity className="w-7 h-7 text-cyan-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
          <MapPin className="w-7 h-7 text-cyan-600" /> Interactive Body Mapping
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Click any anatomical region to log symptoms. Each entry is resolved to{" "}
          <strong>HPO phenotype codes</strong> via HOLON and pinned to your Digital Twin.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* LEFT: Body Silhouette Canvas & Region List */}
        <div className="xl:col-span-5 space-y-4">
          <BodyMapSilhouette
            events={events}
            selectedRegion={selectedRegion}
            hoveredRegion={hoveredRegion}
            onSelectRegion={setSelectedRegion}
            onHoverRegion={setHoveredRegion}
          />
        </div>

        {/* RIGHT: Symptom Log Form + Recent Events */}
        <div className="xl:col-span-7 space-y-4">
          {/* Symptom Log Form */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-5">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Plus className="w-5 h-5 text-cyan-600" />
              {selectedRegion ? `Log Symptom: ${selectedRegion.name}` : "Select a Region to Log"}
            </h2>

            {!selectedRegion && (
              <div className="text-center py-8 text-slate-400 text-sm">
                <MapPin className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                Click an anatomical region on the body map to start logging a symptom.
              </div>
            )}

            {selectedRegion && (
              <div className="space-y-4">
                {/* Quick Symptom Tags */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-2">Common Symptoms for {selectedRegion.name}</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedRegion.symptoms.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSymptomName(s)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                          symptomName === s
                            ? `${selectedRegion.bgColor} ${selectedRegion.borderColor} ${selectedRegion.textColor}`
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Symptom Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">
                    Symptom Description <span className="text-cyan-600">(HOLON resolves HPO automatically)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Type or select a symptom above..."
                    value={symptomName}
                    onChange={(e) => setSymptomName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-cyan-500 transition"
                  />
                </div>

                {/* Drug Cross-React Warning */}
                {crossReactWarning && (
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                    <span>{crossReactWarning}</span>
                  </div>
                )}

                {/* Severity Slider */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-2">
                    Severity: <span className={severity >= 7 ? "text-rose-600" : severity >= 4 ? "text-amber-600" : "text-emerald-600"}>{severity}/10 — {severity >= 7 ? "Severe" : severity >= 4 ? "Moderate" : "Mild"}</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={severity}
                      onChange={(e) => setSeverity(Number(e.target.value))}
                      className="flex-1 accent-cyan-600"
                    />
                    <span className={`text-lg font-bold min-w-[2rem] text-center ${severity >= 7 ? "text-rose-600" : severity >= 4 ? "text-amber-600" : "text-emerald-600"}`}>
                      {severity}
                    </span>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Notes (optional)</label>
                  <textarea
                    rows={2}
                    placeholder="When did it start? Any triggers? Duration?"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-cyan-500 resize-none transition"
                  />
                </div>

                {error && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                    <X className="w-4 h-4" /> {error}
                  </div>
                )}

                {successMessage && (
                  <div className={`p-3.5 rounded-xl border text-xs font-medium flex items-center gap-2 ${flagged ? "bg-rose-50 border-rose-200 text-rose-700" : "bg-emerald-50 border-emerald-200 text-emerald-700"}`}>
                    {flagged ? <Zap className="w-4 h-4 shrink-0" /> : <ShieldCheck className="w-4 h-4 shrink-0" />}
                    {successMessage}
                    {flagged && " — Twin alert flag triggered (twin.flag())."}
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={submitting || !symptomName}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm rounded-xl transition disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {submitting ? "Resolving HPO & Logging to Twin..." : "Log Symptom & Pin to Digital Twin"}
                </button>

                <p className="text-[11px] text-slate-400 text-center font-mono">
                  Powered by HOLON · dtp.holon.concepts.search() · twin.flag()
                </p>
              </div>
            )}
          </div>

          {/* Recent Symptom Events */}
          {events.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-cyan-600" /> All Logged Symptoms
                <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{events.length} events</span>
              </h2>

              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {events.map((ev) => {
                  const reg = REGIONS.find((r) => r.id === ev.bodyRegion);
                  return (
                    <div key={ev.id} className={`p-4 rounded-xl border ${reg?.bgColor ?? "bg-slate-50"} ${reg?.borderColor ?? "border-slate-200"} space-y-1`}>
                      <div className="flex justify-between items-start gap-2">
                        <span className="font-bold text-slate-900 text-sm">{ev.symptomName}</span>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full text-white ${getSevColor(ev.severity)}`}>
                          {ev.severity}/10
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium">{ev.regionName} · <span className="capitalize">{ev.system}</span></p>
                      <p className={`text-xs font-mono font-bold ${reg?.textColor ?? "text-slate-600"}`}>
                        {ev.hpo.hpoCode} — {ev.hpo.hpoName}
                      </p>
                      {ev.notes && <p className="text-xs text-slate-500 italic">"{ev.notes}"</p>}
                      <p className="text-[11px] text-slate-400">{new Date(ev.timestamp).toLocaleString()}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
