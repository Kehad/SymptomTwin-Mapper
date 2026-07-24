"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HeartPulse,
  MapPin,
  Dna,
  Pin,
  TrendingUp,
  Settings,
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  // Don't render sidebar on the public landing page
  if (pathname === "/") return null;


  const navItems = [
    { href: "/", label: "Body Mapping", icon: MapPin },
    { href: "/phenotypes", label: "HPO Phenotypes", icon: Dna },
    { href: "/events", label: "Twin Health Events", icon: Pin },
    { href: "/patterns", label: "Pattern Spotting", icon: TrendingUp },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 min-h-screen flex flex-col justify-between p-6 shrink-0 hidden md:flex">
      <div className="space-y-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-cyan-600 flex items-center justify-center text-white shadow-md shadow-cyan-600/20 group-hover:scale-105 transition">
            <HeartPulse className="w-6 h-6 text-white animate-heartbeat" />
          </div>
          <span className="font-bold text-slate-900 text-lg tracking-tight">
            Symptom<span className="text-cyan-600">Twin</span> Mapper
          </span>
        </Link>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-medium transition ${
                  isActive
                    ? "bg-cyan-50 text-cyan-600 font-semibold shadow-sm"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/80"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-cyan-600" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Branding */}
      <div className="pt-6 border-t border-slate-100">
        <span className="text-xs font-medium text-slate-400 block">SymptomTwin Mapper</span>
        <span className="text-[11px] font-mono text-slate-400">Powered by Ontomorph DTP</span>
      </div>
    </aside>
  );
}
