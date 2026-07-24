"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { getCurrentUserAction, signOutAction } from "@/app/actions/auth";
import { UserProfile } from "@/lib/auth-store";
import {
  HeartPulse,
  MapPin,
  Dna,
  Pin,
  TrendingUp,
  Settings,
  HomeIcon,
  Pill,
  ShieldCheck,
  Menu,
  X,
  ChevronRight,
  LogOut,
  LogIn,
  UserCheck,
  Stethoscope,
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  // Close mobile menu on route change & load user session
  useEffect(() => {
    setIsMobileMenuOpen(false);

    async function loadUserSession() {
      const res = await getCurrentUserAction();
      if (res.success && res.user) {
        setUser(res.user);
      } else {
        setUser(null);
      }
    }
    loadUserSession();
  }, [pathname]);

  const handleSignOut = async () => {
    await signOutAction();
    setUser(null);
    window.location.href = "/";
  };

  // Don't render sidebar on public pages: landing page and onboarding flow
  const PUBLIC_PATHS = ["/", "/onboarding"];
  if (PUBLIC_PATHS.includes(pathname)) return null;

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: HomeIcon },
    { href: "/body-mapping", label: "Body Mapping", icon: MapPin },
    { href: "/phenotypes", label: "HPO Phenotypes", icon: Dna },
    { href: "/events", label: "Twin Health Events", icon: Pin },
    { href: "/patterns", label: "Pattern Spotting", icon: TrendingUp },
    { href: "/prescriptions", label: "Prescriptions", icon: Pill },
    { href: "/insights", label: "Safety Insights", icon: ShieldCheck },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  // Quick items for mobile bottom navbar
  const mobileQuickItems = [
    { href: "/dashboard", label: "Home", icon: HomeIcon },
    { href: "/body-mapping", label: "Body Map", icon: MapPin },
    { href: "/phenotypes", label: "Phenotypes", icon: Dna },
    { href: "/events", label: "Events", icon: Pin },
  ];

  // Helper for initials
  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .filter(Boolean)
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "ST";

  return (
    <>
      {/* Desktop Sidebar */}
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

        {/* Footer & User Profile / Sign Out */}
        <div className="pt-6 border-t border-slate-100 space-y-4">
          {user && (
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 text-white font-bold text-xs flex items-center justify-center border-2 border-white shadow-xs shrink-0 relative">
                  {initials}
                  <span className="w-2 h-2 rounded-full bg-emerald-500 border border-white absolute bottom-0 right-0" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate leading-tight">{user.fullName}</p>
                  <p className="text-[10px] text-slate-500 font-mono truncate">@{user.username}</p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                title="Sign Out"
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition shrink-0"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

          <div>
            <span className="text-xs font-medium text-slate-400 block">SymptomTwin Mapper</span>
            <span className="text-[11px] font-mono text-slate-400">Powered by Ontomorph DTP</span>
          </div>
        </div>
      </aside>

      {/* Mobile Sticky Top Header / Menu Bar */}
      <div className="md:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-xs">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center text-white shadow-sm">
            <HeartPulse className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-slate-900 text-base tracking-tight">
            Symptom<span className="text-cyan-600">Twin</span> Mapper
          </span>
        </Link>

        {/* Profile Avatar & Mobile Hamburger Toggle */}
        <div className="flex items-center gap-3">
          {user && (
            <Link
              href="/settings"
              className="relative focus:outline-none"
              title={`${user.fullName} (@${user.username})`}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 text-white font-bold text-xs flex items-center justify-center border-2 border-white shadow-xs">
                {initials}
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white absolute bottom-0 right-0" />
            </Link>
          )}

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-none transition"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6 text-slate-900" /> : <Menu className="w-6 h-6 text-slate-700" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-h-[90vh] rounded-b-3xl p-5 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div className="space-y-5">
              {/* Header inside drawer */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
                <Link href="/" className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-cyan-600 flex items-center justify-center text-white shadow-sm">
                    <HeartPulse className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold text-slate-900 text-lg">
                    Symptom<span className="text-cyan-600">Twin</span> Mapper
                  </span>
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-xl text-slate-500 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation list */}
              <nav className="grid grid-cols-1 gap-1.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition ${
                        isActive
                          ? "bg-cyan-50 text-cyan-600 font-bold shadow-xs border border-cyan-100"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-5 h-5 ${isActive ? "text-cyan-600" : "text-slate-400"}`} />
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight className={`w-4 h-4 ${isActive ? "text-cyan-600" : "text-slate-300"}`} />
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Mobile Drawer User Profile & Sign Out Footer */}
            <div className="pt-5 mt-5 border-t border-slate-100 space-y-4">
              {user ? (
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 text-white font-bold text-sm flex items-center justify-center border-2 border-white shadow-xs shrink-0 relative">
                      {initials}
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white absolute bottom-0 right-0" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">{user.fullName}</p>
                      <p className="text-xs text-slate-500 font-mono flex items-center gap-1">
                        {user.role === "doctor" ? <Stethoscope className="w-3 h-3 text-cyan-600" /> : <UserCheck className="w-3 h-3 text-cyan-600" />}
                        @{user.username}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleSignOut}
                    className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs rounded-xl transition flex items-center gap-1.5 shrink-0"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  href="/?auth=required"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-2.5 bg-cyan-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs"
                >
                  <LogIn className="w-4 h-4" /> Sign In to SymptomTwin
                </Link>
              )}

              <div className="text-center">
                <span className="text-xs font-medium text-slate-400 block">SymptomTwin Mapper</span>
                <span className="text-[10px] font-mono text-slate-400">Powered by Ontomorph DTP</span>
              </div>
            </div>
          </div>
          {/* Clickable backdrop area below drawer */}
          <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
        </div>
      )}

      {/* Mobile Fixed Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 flex items-center justify-around py-2 px-2 shadow-lg">
        {mobileQuickItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl text-[11px] font-medium transition ${
                isActive ? "text-cyan-600 font-bold" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-cyan-600" : "text-slate-400"}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}

        {/* More Menu toggle on bottom bar */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl text-[11px] font-medium transition ${
            isMobileMenuOpen ? "text-cyan-600 font-bold" : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <Menu className="w-5 h-5 text-slate-500" />
          <span>Menu</span>
        </button>
      </div>
    </>
  );
}
