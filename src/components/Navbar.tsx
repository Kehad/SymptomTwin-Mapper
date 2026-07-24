"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { getCurrentUserAction, signOutAction } from "@/app/actions/auth";
import { UserProfile } from "@/lib/auth-store";
import { AuthModal } from "@/components/AuthModal";
import {
  HeartPulse,
  MapPin,
  Dna,
  Pin,
  TrendingUp,
  LogOut,
  LogIn,
  ShieldCheck,
  Stethoscope,
  UserCheck,
  LayoutDashboard,
  UserPlus,
} from "lucide-react";

function NavbarContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [initialTab, setInitialTab] = useState<"signin" | "signup">("signin");

  useEffect(() => {
    async function loadUserSession() {
      const res = await getCurrentUserAction();
      if (res.success && res.user) {
        setUser(res.user);
      }
    }
    loadUserSession();
  }, [pathname]);

  // Trigger auth modal if URL query has ?auth=required
  useEffect(() => {
    if (searchParams.get("auth") === "required" && !user) {
      setIsAuthModalOpen(true);
    }
  }, [searchParams, user]);

  const handleSignOut = async () => {
    await signOutAction();
    setUser(null);
    window.location.href = "/";
  };

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/", label: "Body Mapping", icon: MapPin },
    { href: "/phenotypes", label: "HPO Phenotypes", icon: Dna },
    { href: "/events", label: "Twin Events", icon: Pin },
    { href: "/patterns", label: "Pattern Spotting", icon: TrendingUp },
  ];

  return (
    <>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(authenticatedUser) => {
          setUser(authenticatedUser);
          window.location.href = "/dashboard";
        }}
      />

      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 md:px-8 py-3.5 flex flex-col md:flex-row justify-between md:items-center gap-4 shadow-sm">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 text-slate-900 font-extrabold text-xl tracking-tight group">
            <div className="w-10 h-10 rounded-xl bg-cyan-600 flex items-center justify-center text-white shadow-md shadow-cyan-600/20 group-hover:scale-105 transition">
              <HeartPulse className="w-6 h-6 text-white animate-heartbeat" />
            </div>
            <span>
              Symptom<span className="text-cyan-600">Twin</span> Mapper
            </span>
          </Link>
          <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-700 text-[10px] font-mono border border-cyan-100 font-semibold">
            DTP v0.1.2
          </span>
        </div>

        {/* Dynamic Navigation: Dashboard Tabs when logged in */}
        {user ? (
          <nav className="flex items-center gap-1 bg-slate-100/70 p-1.5 rounded-2xl border border-slate-200/80 overflow-x-auto">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition whitespace-nowrap ${
                    isActive
                      ? "bg-white text-cyan-700 shadow-sm"
                      : "text-slate-500 hover:text-slate-900 hover:bg-white/60"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-cyan-600" : "text-slate-400"}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        ) : (
          <div className="hidden md:flex items-center gap-2 text-xs font-medium text-slate-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-cyan-600" /> Secure Clinical Authentication Guard
            </span>
          </div>
        )}

        {/* User Auth Controls */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3 bg-white p-1.5 pl-3 pr-2 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600 font-bold text-xs">
                  {user.role === "doctor" ? <Stethoscope className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block leading-tight">{user.fullName}</span>
                  <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" /> @{user.username}
                  </span>
                </div>
              </div>

              <button
                onClick={handleSignOut}
                className="ml-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition flex items-center gap-1"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setInitialTab("signin");
                  setIsAuthModalOpen(true);
                }}
                className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm"
              >
                <LogIn className="w-4 h-4 text-cyan-600" /> Sign In
              </button>
              <button
                onClick={() => {
                  setInitialTab("signup");
                  setIsAuthModalOpen(true);
                }}
                className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm"
              >
                <UserPlus className="w-4 h-4" /> Get Started
              </button>
            </div>
          )}
        </div>
      </header>
    </>
  );
}

export function Navbar() {
  return (
    <Suspense fallback={<header className="sticky top-0 z-40 bg-white/90 border-b border-slate-200/80 px-4 md:px-8 py-3.5 h-16" />}>
      <NavbarContent />
    </Suspense>
  );
}
