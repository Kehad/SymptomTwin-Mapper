"use client";

import { useState, useEffect } from "react";
import { useRequireAuth } from "@/lib/use-auth";
import { getSymptomHistoryAction } from "@/app/actions/symptoms";
import { SymptomEvent } from "@/lib/symptom-store";
import { Pin, Activity } from "lucide-react";
import { EventsFilterBar } from "./EventsFilterBar";
import { EventsStreamList } from "./EventsStreamList";

export function EventsComponent() {
  const { user, loading } = useRequireAuth();
  const [events, setEvents] = useState<SymptomEvent[]>([]);
  const [selectedSystem, setSelectedSystem] = useState<string>("all");

  useEffect(() => {
    async function loadData() {
      if (user) {
        const res = await getSymptomHistoryAction();
        setEvents(res.events);
      }
    }
    loadData();
  }, [user]);

  if (loading || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-500 gap-3">
        <Activity className="w-8 h-8 text-cyan-600 animate-spin" />
        <p className="text-xs font-mono font-semibold">Verifying Clinical Security Guard...</p>
      </div>
    );
  }

  const filteredEvents =
    selectedSystem === "all" ? events : events.filter((ev) => ev.system === selectedSystem);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
          <Pin className="w-8 h-8 text-cyan-600" /> Twin System Pinned Health Events
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Timestamped symptom events pinned directly to patient body systems via the Ontomorph DTP SDK.
        </p>
      </div>

      <EventsFilterBar selectedSystem={selectedSystem} onSelectSystem={setSelectedSystem} />

      <EventsStreamList filteredEvents={filteredEvents} />
    </div>
  );
}
