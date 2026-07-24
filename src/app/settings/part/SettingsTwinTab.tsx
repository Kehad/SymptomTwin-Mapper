"use client";

import { Dna, ShieldCheck, Heart } from "lucide-react";

interface SettingsTwinTabProps {
  grantToken: string;
}

export function SettingsTwinTab({ grantToken }: SettingsTwinTabProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-6">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Dna className="w-5 h-5 text-cyan-600" /> Digital Twin Connection & Systems
        </h2>

        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <div>
              <p className="text-sm font-bold text-emerald-800">Twin Grant Active</p>
              <p className="text-xs text-emerald-700 font-mono mt-0.5">{grantToken}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {["cardiovascular", "nervous", "pulmonary", "digestive", "musculoskeletal"].map((sys) => (
              <div key={sys} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-cyan-600" />
                  <div>
                    <span className="text-sm font-bold text-slate-900 capitalize">{sys}</span>
                    <p className="text-[11px] text-slate-500 font-mono">twin.systems.get("{sys}")</p>
                  </div>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            ))}
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">SDK Usage Pattern</h3>
            <pre className="text-[11px] font-mono text-slate-600 bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto">{`import { DTP } from "@ontomorph/dtp-sdk";

const dtp = new DTP({ apiKey: DTP_API_KEY, holonApiKey: HOLON_KEY });
const twin = await dtp.twins.connect(grantToken);

// Stream live events from any body system
twin.events.stream({ system: "cardiovascular" }, (e) => {
  if (Number(e.data.value) > 130) twin.flag("cardiovascular", e);
});

// Query system events
const system = await twin.systems.get("nervous");
console.log(system.events);`}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
