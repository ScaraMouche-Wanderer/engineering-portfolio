"use client";

import { useState } from "react";
import { Shield, ShieldAlert, Camera, Lock, ArrowRight, Eye, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FaceGateMiniConsole() {
  const [targetApp, setTargetApp] = useState<string>("firefox");
  const [authState, setAuthState] = useState<"locked" | "scanning" | "authenticated" | "intruder">("locked");
  const [livenessScore, setLivenessScore] = useState<number>(98.6);
  const router = useRouter();

  const handleSimulateUnlock = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (authState === "scanning") return;
    setAuthState("scanning");
    setTimeout(() => {
      setLivenessScore(99.4);
      setAuthState("authenticated");
    }, 550);
  };

  const handleSimulateIntruder = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (authState === "scanning") return;
    setAuthState("scanning");
    setTimeout(() => {
      setLivenessScore(14.2);
      setAuthState("intruder");
    }, 550);
  };

  const handleResetLock = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAuthState("locked");
    setLivenessScore(98.6);
  };

  return (
    <div 
      className="flex flex-col justify-between h-full font-mono select-none"
      onClick={(e) => e.stopPropagation()}
    >
      <div>
        {/* Linux Application Window Header */}
        <div className="flex justify-between items-center pb-2.5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5 mr-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <span className="text-xs text-white/90 font-bold tracking-wide flex items-center gap-1.5">
              <Shield size={14} className="text-purple-400" />
              FaceGate-Linux Security Daemon
            </span>
          </div>

          <span className={`text-xs px-2.5 py-1 rounded-md font-bold transition-all ${
            authState === "authenticated"
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50"
              : authState === "intruder"
              ? "bg-rose-500/20 text-rose-300 border border-rose-500/50 animate-pulse"
              : authState === "scanning"
              ? "bg-purple-500/20 text-purple-300 border border-purple-500/50 animate-pulse"
              : "bg-amber-500/15 text-amber-300 border border-amber-500/40"
          }`}>
            {authState === "authenticated"
              ? "● AUTHENTICATED (SIGCONT)"
              : authState === "intruder"
              ? "● ALERT: SPOOF BLOCKED"
              : authState === "scanning"
              ? "● SCANNING BIOMETRICS..."
              : "● PROCESS SUSPENDED (SIGSTOP)"}
          </span>
        </div>

        {/* Target App Switcher Tabs */}
        <div className="flex gap-2 my-3">
          {[
            { id: "firefox", label: "firefox (Browser)" },
            { id: "alacritty", label: "alacritty (Terminal)" },
            { id: "keepassxc", label: "keepassxc (Vault)" }
          ].map((app) => (
            <button
              key={app.id}
              onClick={(e) => {
                e.stopPropagation();
                setTargetApp(app.id);
              }}
              className={`text-xs px-2.5 py-1.5 rounded-md transition-all cursor-pointer border font-semibold ${
                targetApp === app.id
                  ? "bg-purple-500/20 border-purple-400 text-white shadow-sm"
                  : "bg-white/5 border-white/10 text-white/60 hover:text-white"
              }`}
            >
              {app.label}
            </button>
          ))}
        </div>

        {/* Real Engineering Telemetry Panel */}
        <div className="grid grid-cols-3 gap-2.5 mb-3.5">
          <div className="bg-white/5 p-2.5 rounded-lg border border-white/10 text-center">
            <span className="text-xs text-white/50 block font-semibold mb-0.5">TARGET WINDOW</span>
            <span className="text-sm font-bold text-white block truncate">
              {targetApp}
            </span>
            <span className={`text-xs font-bold block mt-0.5 ${
              authState === "authenticated" ? "text-emerald-400" : "text-amber-400"
            }`}>
              {authState === "authenticated" ? "Active (SIGCONT)" : "Suspended (SIGSTOP)"}
            </span>
          </div>

          <div className="bg-white/5 p-2.5 rounded-lg border border-white/10 text-center">
            <span className="text-xs text-white/50 block font-semibold mb-0.5">LIVENESS CHECK</span>
            <span className={`text-sm font-bold block ${
              authState === "intruder" ? "text-rose-400" : "text-emerald-400"
            }`}>
              {authState === "scanning" ? "--" : `${livenessScore.toFixed(1)}%`}
            </span>
            <span className="text-xs text-white/50 block mt-0.5">Centroid Δ Motion</span>
          </div>

          <div className="bg-white/5 p-2.5 rounded-lg border border-white/10 text-center">
            <span className="text-xs text-white/50 block font-semibold mb-0.5">KEY VAULT</span>
            <span className="text-sm font-bold text-purple-300 block">AES-256-GCM</span>
            <span className="text-xs text-white/50 block mt-0.5">RAM tmpfs cached</span>
          </div>
        </div>

        {/* Interactive Action Controls */}
        <div className="flex gap-2.5">
          {authState !== "authenticated" ? (
            <button
              onClick={handleSimulateUnlock}
              disabled={authState === "scanning"}
              className="flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all border bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.2)]"
            >
              <Camera size={14} />
              <span>{authState === "scanning" ? "Verifying Face..." : "Simulate Biometric Auth"}</span>
            </button>
          ) : (
            <button
              onClick={handleResetLock}
              className="flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all border bg-white/10 hover:bg-white/15 text-white border-white/20"
            >
              <Lock size={14} />
              <span>Re-Arm Security Gate</span>
            </button>
          )}

          <button
            onClick={handleSimulateIntruder}
            disabled={authState === "scanning"}
            className="py-2 px-3 rounded-lg text-xs font-bold bg-rose-500/15 text-rose-300 border border-rose-500/40 hover:bg-rose-500/25 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
            title="Simulate Photo Spoof / Intruder Attack"
          >
            <ShieldAlert size={14} />
            <span>Test Intruder Spoof</span>
          </button>
        </div>
      </div>

      <div className="pt-3 border-t border-white/10 flex justify-between items-center text-xs">
        <span className="text-white/60">InsightFace (buffalo_l) &bull; 100% Offline Biometrics</span>
        <button
          onClick={() => router.push('/project/proj-facegate')}
          className="text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1 cursor-pointer transition-colors"
        >
          <span>Security Deep Dive</span>
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}
