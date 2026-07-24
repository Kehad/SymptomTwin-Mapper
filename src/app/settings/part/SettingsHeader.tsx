"use client";

import { Settings } from "lucide-react";

export function SettingsHeader() {
  return (
    <div>
      <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
        <Settings className="w-7 h-7 text-cyan-600" /> Settings
      </h1>
      <p className="text-slate-500 text-sm mt-1">
        Manage your health profile, digital twin grant, medications, and API access.
      </p>
    </div>
  );
}
