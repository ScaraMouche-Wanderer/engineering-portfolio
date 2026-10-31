"use client";

import { useState } from "react";
import { Shield, Lock, Terminal, Cpu, HardDrive, Key, GitFork, Star, Copy, Check, ExternalLink, ArrowRight, CheckCircle2 } from "lucide-react";
import GithubIcon from "@/components/GithubIcon";
import { useRouter } from "next/navigation";

export default function FaceGateShowcase() {
  const router = useRouter();
  const [copiedClone, setCopiedClone] = useState(false);
  const [activeTab, setActiveTab] = useState<"architecture" | "daemon_logs" | "config">("architecture");

  const handleCopyClone = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText("git clone https://github.com/ScaraMouche-Wanderer/FaceGATE-Linux.git");
    setCopiedClone(true);
    setTimeout(() => setCopiedClone(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6 select-none font-sans" onClick={(e) => e.stopPropagation()}>
      {/* Top Meta Bar: Repository Link, Star Count, Badges */}
      <div className="flex flex-wrap justify-between items-center gap-3 p-3.5 bg-black/40 rounded-xl border border-white/10">
        <div className="flex items-center gap-2.5 flex-wrap">
          <a
            href="https://github.com/ScaraMouche-Wanderer/FaceGATE-Linux"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white font-mono text-sm font-bold hover:text-cyan-400 transition-colors"
          >
            <GithubIcon size={18} />
            <span>ScaraMouche-Wanderer / FaceGATE-Linux</span>
            <ExternalLink size={13} className="opacity-60" />
          </a>
          <span className="text-xs px-2.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 font-mono font-semibold">
            v1.2.0
          </span>
          <span className="text-xs px-2 py-0.5 rounded bg-white/5 text-white/70 border border-white/10 font-mono">
            GPL-3.0
          </span>
        </div>

        {/* Quick Clone Snippet */}
        <div className="flex items-center gap-2">
          <div className="bg-black/60 px-3 py-1.5 rounded-lg border border-white/10 font-mono text-xs text-cyan-300 flex items-center gap-2">
            <span className="text-white/40">$</span>
            <span>git clone .../FaceGATE-Linux.git</span>
            <button
              onClick={handleCopyClone}
              className="text-white/60 hover:text-white transition-colors cursor-pointer p-0.5"
              title="Copy Clone Command"
            >
              {copiedClone ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Engineering Showcase Grid (Split 2-Column on Desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Subsystem Architecture & Verified Capabilities (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-5">
          <div>
            <div className="mb-4">
              <h4 className="text-lg font-bold text-white mb-1.5 flex items-center gap-2">
                <Shield size={20} className="text-purple-400" />
                Local Biometric Security Daemon & PAM Process Locker
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed font-normal">
                A native Linux background daemon engineered to prevent unauthorized access to sensitive application processes (web browsers, password vaults, root terminals) using local neural facial embeddings without cloud dependencies.
              </p>
            </div>

            {/* Architecture Subsystem Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <Cpu size={15} className="text-purple-400" />
                  <span className="text-xs font-bold font-mono text-white">InsightFace 512D ONNX</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed m-0">
                  Runs local buffalo_l face model with ONNX Runtime producing normalized 512-dim cosine distance match vectors in &lt;15ms.
                </p>
              </div>

              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <Key size={15} className="text-cyan-400" />
                  <span className="text-xs font-bold font-mono text-white">AES-256-GCM RAM Vault</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed m-0">
                  Biometric reference embeddings stored exclusively in volatile <code className="text-cyan-300 text-[11px]">/run/user/1000/tmpfs</code> RAM with zero plaintext disk caching.
                </p>
              </div>

              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <Lock size={15} className="text-amber-400" />
                  <span className="text-xs font-bold font-mono text-white">SIGSTOP Process Interceptor</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed m-0">
                  Instantly sends kernel <code className="text-amber-300 text-[11px]">SIGSTOP</code> to freeze target window threads upon focus switch, resuming with <code className="text-emerald-300 text-[11px]">SIGCONT</code> only after authentication.
                </p>
              </div>

              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <HardDrive size={15} className="text-emerald-400" />
                  <span className="text-xs font-bold font-mono text-white">Cryptographic Audit Ledger</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed m-0">
                  SQLite-backed event trail logging timestamps, confidence scores, and spoof detection attempts with SHA-256 tamper-evident integrity hashes.
                </p>
              </div>
            </div>
          </div>

          {/* Key Verified Benchmarks */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold flex items-center gap-1.5">
              <CheckCircle2 size={13} /> 100% Offline / Zero Telemetry
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold flex items-center gap-1.5">
              <CheckCircle2 size={13} /> &lt;15ms Neural Inference
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 font-semibold flex items-center gap-1.5">
              <CheckCircle2 size={13} /> Anti-Spoof Centroid Motion Δ
            </span>
          </div>
        </div>

        {/* Right Column: Authentic Terminal & Daemon Viewport (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col bg-black/75 rounded-xl border border-white/15 overflow-hidden shadow-2xl">
          {/* Linux Terminal Header */}
          <div className="bg-slate-900 px-4 py-2.5 border-b border-white/10 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/90" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/90" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/90" />
              </div>
              <span className="text-xs font-mono text-slate-300 font-bold ml-1">
                facegate-daemon.service &bull; systemd
              </span>
            </div>

            {/* View Tabs */}
            <div className="flex gap-1">
              {(["architecture", "daemon_logs", "config"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-xs px-2.5 py-1 rounded font-mono uppercase transition-colors cursor-pointer ${
                    activeTab === tab ? "bg-purple-500/30 text-purple-300 font-bold" : "text-slate-300 hover:text-white"
                  }`}
                >
                  {tab === "daemon_logs" ? "Logs" : tab === "config" ? "Config" : "Status"}
                </button>
              ))}
            </div>
          </div>

          {/* Terminal Content Body */}
          <div className="p-4 font-mono text-xs leading-relaxed overflow-x-auto min-h-[260px] text-slate-200 flex-1">
            {activeTab === "architecture" && (
              <div className="space-y-1.5 text-xs">
                <p className="text-slate-300 font-bold m-0">$ systemctl --user status facegate.service</p>
                <p className="text-emerald-400 font-bold m-0">● facegate.service - Local Biometric Security Daemon</p>
                <p className="text-slate-200 m-0">&nbsp;&nbsp;&nbsp;Loaded: loaded (/usr/lib/systemd/user/facegate.service; enabled)</p>
                <p className="text-slate-200 m-0">&nbsp;&nbsp;&nbsp;Active: <span className="text-emerald-400 font-bold">active (running)</span> since Linux Boot</p>
                <p className="text-slate-200 m-0">&nbsp;&nbsp;&nbsp;Device: /dev/video0 (V4L2 1080p @ 30FPS)</p>
                <p className="text-slate-200 m-0">&nbsp;&nbsp;&nbsp;Inference: ONNX Runtime CPU EP (512-dim embedding)</p>
                <p className="text-purple-300 m-0 font-bold">&nbsp;&nbsp;&nbsp;Gated PIDs: [1420: firefox] [2104: keepassxc] [8812: alacritty]</p>
                <p className="text-slate-200 m-0">&nbsp;&nbsp;&nbsp;RAM Vault: /run/user/1000/facegate (AES-256-GCM armed)</p>
              </div>
            )}

            {activeTab === "daemon_logs" && (
              <div className="space-y-1.5 text-xs text-slate-200">
                <p className="text-slate-300 m-0">[22:15:02] DAEMON_INIT: Loaded 512D admin vector hash</p>
                <p className="text-slate-200 m-0">[22:15:10] FOCUS_CHANGE: Target window PID 1420 (firefox)</p>
                <p className="text-amber-400 font-bold m-0">[22:15:10] KERNEL_SIGNAL: SIGSTOP sent &rarr; PID 1420 frozen</p>
                <p className="text-cyan-300 font-semibold m-0">[22:15:11] V4L2_CAPTURE: Face detected (bbox: [120,80,340,320])</p>
                <p className="text-purple-300 font-semibold m-0">[22:15:11] ONNX_INFER: Cosine match 0.892 (threshold &gt; 0.65)</p>
                <p className="text-emerald-400 font-bold m-0">[22:15:12] AUTH_GRANTED: SIGCONT sent &rarr; PID 1420 resumed</p>
                <p className="text-slate-300 m-0">[22:15:12] SQLITE_LOG: Event committed with SHA-256 sig</p>
              </div>
            )}

            {activeTab === "config" && (
              <div className="space-y-1.5 text-xs text-cyan-200">
                <p className="text-slate-300 font-bold m-0"># /etc/facegate/facegate.conf</p>
                <p className="text-slate-200 font-bold m-0">[daemon]</p>
                <p className="m-0">device = &quot;/dev/video0&quot;</p>
                <p className="m-0">match_threshold = 0.65</p>
                <p className="m-0">liveness_centroid_delta = 1.25</p>
                <p className="m-0">vault_path = &quot;/run/user/1000/facegate/vault.bin&quot;</p>
                <p className="text-slate-200 font-bold mt-2 m-0">[monitored_apps]</p>
                <p className="m-0">targets = [&quot;firefox&quot;, &quot;keepassxc&quot;, &quot;alacritty&quot;, &quot;google-chrome&quot;]</p>
                <p className="m-0">signal_action = &quot;SIGSTOP&quot;</p>
              </div>
            )}
          </div>

          {/* Bottom Telemetry Strip */}
          <div className="bg-slate-950 px-4 py-2 border-t border-white/10 flex justify-between items-center text-xs text-slate-300 font-mono">
            <span>PySide6 / Qt6 &bull; systemd Daemon</span>
            <span className="text-emerald-400 font-semibold">● Daemon Armed & Active</span>
          </div>
        </div>
      </div>

      {/* Dual Action Bar */}
      <div className="flex flex-wrap gap-3 pt-2 items-center justify-between">
        <div className="flex items-center gap-3 flex-wrap">
          <a
            href="https://github.com/ScaraMouche-Wanderer/FaceGATE-Linux"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold text-sm transition-all"
          >
            <GithubIcon size={16} />
            <span>View Source on GitHub ↗</span>
          </a>

          <button
            onClick={() => router.push('/project/proj-facegate')}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/50 font-bold text-sm cursor-pointer transition-all shadow-[0_0_15px_rgba(192,132,252,0.18)]"
          >
            <span>Launch Security Architecture Deep Dive</span>
            <ArrowRight size={15} />
          </button>
        </div>

        <span className="text-xs text-slate-400 font-mono">
          Engineered for Linux (Arch / Debian / Fedora / Ubuntu)
        </span>
      </div>
    </div>
  );
}
