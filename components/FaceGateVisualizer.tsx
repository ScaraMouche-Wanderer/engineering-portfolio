"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  Camera, 
  Lock, 
  Unlock, 
  RefreshCw, 
  UserCheck, 
  AlertTriangle, 
  Key, 
  Terminal, 
  Cpu, 
  Activity, 
  FileText,
  Eye,
  CheckCircle2,
  XCircle,
  Zap
} from "lucide-react";

interface AuditLog {
  id: string;
  time: string;
  process: string;
  pid: number;
  result: "GRANTED" | "DENIED_SPOOF" | "DENIED_UNKNOWN";
  confidence: number;
  liveness: number;
  action: "SIGCONT" | "SIGSTOP" | "CAPTURE_INTRUDER";
}

interface MonitoredProcess {
  name: string;
  pid: number;
  state: "FROZEN (SIGSTOP)" | "ACTIVE (SIGCONT)";
  locked: boolean;
  category: string;
}

export default function FaceGateVisualizer() {
  const [processes, setProcesses] = useState<MonitoredProcess[]>([
    { name: "firefox", pid: 8392, state: "FROZEN (SIGSTOP)", locked: true, category: "Web Browser" },
    { name: "alacritty", pid: 9140, state: "FROZEN (SIGSTOP)", locked: true, category: "Terminal Console" },
    { name: "keepassxc", pid: 10412, state: "FROZEN (SIGSTOP)", locked: true, category: "Password Vault" },
    { name: "gnome-control-center", pid: 11048, state: "ACTIVE (SIGCONT)", locked: false, category: "System Settings" },
  ]);

  const [selectedPid, setSelectedPid] = useState<number>(8392);
  const [authStatus, setAuthStatus] = useState<"IDLE" | "SCANNING" | "GRANTED" | "SPOOF_ALERT">("IDLE");
  const [livenessScore, setLivenessScore] = useState<number>(98.8);
  const [cosineDist, setCosineDist] = useState<number>(0.88);
  const [ramKeyActive, setRamKeyActive] = useState<boolean>(true);
  const [logs, setLogs] = useState<AuditLog[]>([
    { id: "log-1", time: "22:14:02", process: "gnome-control-center", pid: 11048, result: "GRANTED", confidence: 0.94, liveness: 99.1, action: "SIGCONT" },
    { id: "log-2", time: "22:10:19", process: "keepassxc", pid: 10412, result: "DENIED_SPOOF", confidence: 0.42, liveness: 14.2, action: "CAPTURE_INTRUDER" },
    { id: "log-3", time: "22:05:44", process: "alacritty", pid: 9140, result: "GRANTED", confidence: 0.91, liveness: 98.4, action: "SIGCONT" },
  ]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Animate Biometric Face Landmarks on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frameId: number;
    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const r = 68;

      // Draw outer HUD circle
      ctx.strokeStyle = authStatus === "SPOOF_ALERT" ? "rgba(244, 63, 94, 0.6)" : authStatus === "GRANTED" ? "rgba(16, 185, 129, 0.6)" : "rgba(192, 132, 252, 0.4)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(cx, cy, r + 15, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Rotating scanning sweep
      if (authStatus === "SCANNING") {
        ctx.strokeStyle = "rgba(192, 132, 252, 0.9)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, r + 15, angle, angle + Math.PI / 3);
        ctx.stroke();
        angle += 0.08;
      }

      // Draw simulated face wireframe mesh
      const points = [
        { x: cx, y: cy - 45 }, // Top forehead
        { x: cx - 35, y: cy - 25 }, // Left temple
        { x: cx + 35, y: cy - 25 }, // Right temple
        { x: cx - 22, y: cy - 10 }, // Left eye
        { x: cx + 22, y: cy - 10 }, // Right eye
        { x: cx, y: cy + 5 },       // Nose tip
        { x: cx - 18, y: cy + 25 }, // Left mouth
        { x: cx + 18, y: cy + 25 }, // Right mouth
        { x: cx, y: cy + 45 },      // Chin
        { x: cx - 40, y: cy + 15 }, // Left jaw
        { x: cx + 40, y: cy + 15 }, // Right jaw
      ];

      // Draw mesh interconnects
      ctx.strokeStyle = authStatus === "SPOOF_ALERT" ? "rgba(244, 63, 94, 0.25)" : "rgba(192, 132, 252, 0.2)";
      ctx.lineWidth = 1;
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dist = Math.hypot(points[i].x - points[j].x, points[i].y - points[j].y);
          if (dist < 48) {
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw landmark nodes
      points.forEach((p, idx) => {
        ctx.fillStyle = authStatus === "SPOOF_ALERT" ? "#f43f5e" : authStatus === "GRANTED" ? "#10b981" : "#c084fc";
        ctx.beginPath();
        ctx.arc(p.x, p.y, idx === 5 ? 3.5 : 2.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // Bounding box with corner brackets
      ctx.strokeStyle = authStatus === "SPOOF_ALERT" ? "#f43f5e" : authStatus === "GRANTED" ? "#10b981" : "#c084fc";
      ctx.lineWidth = 2;
      const bx = cx - 55;
      const by = cy - 65;
      const bw = 110;
      const bh = 130;
      const bl = 15;

      // Top-Left
      ctx.beginPath();
      ctx.moveTo(bx, by + bl);
      ctx.lineTo(bx, by);
      ctx.lineTo(bx + bl, by);
      ctx.stroke();

      // Top-Right
      ctx.beginPath();
      ctx.moveTo(bx + bw - bl, by);
      ctx.lineTo(bx + bw, by);
      ctx.lineTo(bx + bw, by + bl);
      ctx.stroke();

      // Bottom-Left
      ctx.beginPath();
      ctx.moveTo(bx, by + bh - bl);
      ctx.lineTo(bx, by + bh);
      ctx.lineTo(bx + bl, by + bh);
      ctx.stroke();

      // Bottom-Right
      ctx.beginPath();
      ctx.moveTo(bx + bw - bl, by + bh);
      ctx.lineTo(bx + bw, by + bh);
      ctx.lineTo(bx + bw, by + bh - bl);
      ctx.stroke();

      frameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(frameId);
  }, [authStatus]);

  const handleAuthenticate = () => {
    setAuthStatus("SCANNING");
    setTimeout(() => {
      setLivenessScore(99.4);
      setCosineDist(0.92);
      setAuthStatus("GRANTED");

      // Unlock selected process
      setProcesses((prev) =>
        prev.map((p) =>
          p.pid === selectedPid ? { ...p, state: "ACTIVE (SIGCONT)", locked: false } : p
        )
      );

      const target = processes.find((p) => p.pid === selectedPid);
      const newLog: AuditLog = {
        id: `log-${Date.now()}`,
        time: new Date().toTimeString().split(" ")[0],
        process: target ? target.name : "app",
        pid: selectedPid,
        result: "GRANTED",
        confidence: 0.92,
        liveness: 99.4,
        action: "SIGCONT",
      };
      setLogs((prev) => [newLog, ...prev.slice(0, 5)]);
    }, 700);
  };

  const handleSpoofAttack = () => {
    setAuthStatus("SCANNING");
    setTimeout(() => {
      setLivenessScore(12.3);
      setCosineDist(0.28);
      setAuthStatus("SPOOF_ALERT");

      // Keep target frozen
      setProcesses((prev) =>
        prev.map((p) =>
          p.pid === selectedPid ? { ...p, state: "FROZEN (SIGSTOP)", locked: true } : p
        )
      );

      const target = processes.find((p) => p.pid === selectedPid);
      const newLog: AuditLog = {
        id: `log-${Date.now()}`,
        time: new Date().toTimeString().split(" ")[0],
        process: target ? target.name : "app",
        pid: selectedPid,
        result: "DENIED_SPOOF",
        confidence: 0.28,
        liveness: 12.3,
        action: "CAPTURE_INTRUDER",
      };
      setLogs((prev) => [newLog, ...prev.slice(0, 5)]);
    }, 700);
  };

  const handleToggleFreeze = (pid: number) => {
    setProcesses((prev) =>
      prev.map((p) => {
        if (p.pid === pid) {
          const nextLocked = !p.locked;
          return {
            ...p,
            locked: nextLocked,
            state: nextLocked ? "FROZEN (SIGSTOP)" : "ACTIVE (SIGCONT)",
          };
        }
        return p;
      })
    );
  };

  const selectedProcess = processes.find((p) => p.pid === selectedPid);

  return (
    <div className="w-full max-w-5xl mx-auto my-8 font-mono text-sm">
      {/* Top HUD Card */}
      <div className="border border-[var(--line)] rounded-2xl overflow-hidden bg-[var(--panel-strong)] backdrop-blur-xl shadow-2xl mb-6">
        <div className="bg-[var(--background-soft)] px-6 py-4 border-b border-[var(--line)] flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <Shield className="text-[#c084fc]" size={20} />
            <div>
              <span className="text-[#c084fc] font-bold uppercase tracking-wider text-sm block">
                FaceGate-Linux Security Architecture
              </span>
              <span className="text-xs text-[var(--muted)]">
                Local Biometric Interception Daemon &bull; PySide6 GUI &bull; ONNX buffalo_l
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 font-semibold flex items-center gap-1.5">
              <Key size={12} />
              RAM Vault: {ramKeyActive ? "AES-256 (tmpfs Active)" : "LOCKED"}
            </span>
            <span className="text-xs px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-semibold flex items-center gap-1">
              <Activity size={12} />
              Daemon: PID 4192
            </span>
          </div>
        </div>

        {/* Main Grid: Biometric Vision + Process Suspension */}
        <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Biometric Vision & Liveness Scanner (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-between bg-black/40 border border-white/10 rounded-xl p-5 relative overflow-hidden">
            <div className="w-full flex justify-between items-center mb-2">
              <span className="text-xs text-white/70 font-semibold flex items-center gap-1.5">
                <Camera size={14} className="text-[#c084fc]" />
                LOCAL_V4L2_DEVICE: /dev/video0
              </span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${
                authStatus === "GRANTED"
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                  : authStatus === "SPOOF_ALERT"
                  ? "bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse"
                  : authStatus === "SCANNING"
                  ? "bg-purple-500/20 text-purple-300 border-purple-500/40 animate-pulse"
                  : "bg-white/5 text-white/70 border-white/10"
              }`}>
                {authStatus === "GRANTED"
                  ? "● MATCH VERIFIED"
                  : authStatus === "SPOOF_ALERT"
                  ? "● SPOOF DETECTED"
                  : authStatus === "SCANNING"
                  ? "● ANALYZING..."
                  : "● STANDBY"}
              </span>
            </div>

            {/* Canvas Face Mesh */}
            <div className="relative my-2">
              <canvas
                ref={canvasRef}
                width={240}
                height={200}
                className="rounded-lg"
              />
            </div>

            {/* Telemetry Readouts */}
            <div className="w-full grid grid-cols-2 gap-2.5 my-3.5 text-center">
              <div className="bg-white/5 p-2.5 rounded-lg border border-white/10">
                <span className="text-xs text-white/50 block font-semibold mb-0.5">COSINE SIMILARITY</span>
                <span className={`text-base font-bold ${authStatus === "SPOOF_ALERT" ? "text-rose-400" : "text-[#c084fc]"}`}>
                  {authStatus === "SCANNING" ? "--" : cosineDist.toFixed(2)}
                </span>
                <span className="text-xs text-white/50 block mt-0.5">Threshold &gt; 0.65</span>
              </div>
              <div className="bg-white/5 p-2.5 rounded-lg border border-white/10">
                <span className="text-xs text-white/50 block font-semibold mb-0.5">LIVENESS SCORE</span>
                <span className={`text-base font-bold ${authStatus === "SPOOF_ALERT" ? "text-rose-400" : "text-emerald-400"}`}>
                  {authStatus === "SCANNING" ? "--" : `${livenessScore.toFixed(1)}%`}
                </span>
                <span className="text-xs text-white/50 block mt-0.5">Centroid Motion Δ</span>
              </div>
            </div>

            {/* Interactive Action Controls */}
            <div className="w-full flex gap-2.5">
              <button
                onClick={handleAuthenticate}
                disabled={authStatus === "SCANNING"}
                className="flex-1 py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all border bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
              >
                <UserCheck size={14} />
                <span>Simulate Admin Face</span>
              </button>

              <button
                onClick={handleSpoofAttack}
                disabled={authStatus === "SCANNING"}
                className="py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all border bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border-rose-500/40"
                title="Simulate Photo Spoof / Unknown Intruder"
              >
                <AlertTriangle size={14} />
                <span>Test Spoof Attack</span>
              </button>
            </div>
          </div>

          {/* Right: Monitored Process Table & Interception Signals (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-[var(--cyan)] font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Terminal size={16} />
                  Target Process Interception Matrix
                </span>
                <span className="text-xs text-[#ffffff] font-semibold">
                  Signal Controller: SIGSTOP / SIGCONT
                </span>
              </div>

              <div className="flex flex-col gap-2.5 mb-4">
                {processes.map((proc) => {
                  const isSelected = proc.pid === selectedPid;
                  return (
                    <div
                      key={proc.pid}
                      onClick={() => setSelectedPid(proc.pid)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? "bg-[#c084fc]/15 border-[#c084fc] shadow-[0_0_15px_rgba(192,132,252,0.18)]"
                          : "bg-white/5 border-white/10 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {proc.locked ? (
                          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
                            <Lock size={16} />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
                            <Unlock size={16} />
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">{proc.name}</span>
                            <span className="text-xs text-slate-300 font-mono">PID {proc.pid}</span>
                          </div>
                          <span className="text-xs text-slate-300">{proc.category}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`text-xs px-2.5 py-1 rounded-md font-bold border ${
                          proc.locked
                            ? "bg-amber-500/15 text-amber-300 border-amber-500/40"
                            : "bg-emerald-500/15 text-emerald-300 border-emerald-500/40"
                        }`}>
                          {proc.state}
                        </span>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleFreeze(proc.pid);
                          }}
                          className="p-1.5 rounded bg-white/5 hover:bg-white/15 border border-white/10 text-white hover:text-white transition-all"
                          title={proc.locked ? "Send SIGCONT" : "Send SIGSTOP"}
                        >
                          <Zap size={15} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tamper-Evident SQLite Audit Trail */}
            <div className="bg-black/50 border border-white/10 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2.5 pb-2 border-b border-white/10">
                <span className="text-xs text-white font-bold flex items-center gap-1.5">
                  <FileText size={14} className="text-[#c084fc]" />
                  LOCAL SQLITE AUDIT LOG (~/.local/share/facegate/audit.db)
                </span>
                <span className="text-xs text-emerald-400 font-semibold">● SHA-256 Verified</span>
              </div>

              <div className="flex flex-col gap-2 max-h-32 overflow-y-auto pr-1">
                {logs.map((log) => (
                  <div key={log.id} className="flex justify-between items-center text-xs py-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-300">{log.time}</span>
                      <span className="text-white font-bold">{log.process}</span>
                      <span className="text-xs text-slate-300">[{log.action}]</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-300">
                        conf: {(log.confidence * 100).toFixed(0)}%
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                        log.result === "GRANTED"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-rose-500/20 text-rose-300"
                      }`}>
                        {log.result}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Core Engineering Uniqueness Matrix */}
        <div className="p-6 bg-black/60 border-t border-white/10">
          <span className="text-sm font-bold text-[#c084fc] uppercase tracking-wider block mb-3 flex items-center gap-2">
            <Zap size={16} /> Core Architectural Innovations & Engineering Uniqueness
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <span className="font-bold text-white block mb-1 text-sm">1. Kernel SIGSTOP Interceptor</span>
              <p className="text-slate-200 text-xs leading-relaxed m-0 font-sans">
                Intercepts window focus events via systemd/X11 hooks and immediately freezes target application threads using POSIX <code className="text-purple-300">SIGSTOP</code> until facial authentication passes.
              </p>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <span className="font-bold text-white block mb-1 text-sm">2. Volatile RAM Vault</span>
              <p className="text-slate-200 text-xs leading-relaxed m-0 font-sans">
                Reference facial embeddings are stored exclusively in temporary RAM (<code className="text-cyan-300">/run/user/1000/tmpfs</code>) encrypted with AES-256-GCM, leaving zero plaintext footprint on disk.
              </p>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <span className="font-bold text-white block mb-1 text-sm">3. Centroid Liveness Anti-Spoof</span>
              <p className="text-slate-200 text-xs leading-relaxed m-0 font-sans">
                Calculates micro-motion temporal optical flow across 68 facial landmarks, defeating static 2D photograph and phone screen spoof attacks.
              </p>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <span className="font-bold text-white block mb-1 text-sm">4. 100% Offline ONNX Model</span>
              <p className="text-slate-200 text-xs leading-relaxed m-0 font-sans">
                Runs the buffalo_l neural face embedding model locally using ONNX Runtime with sub-15ms inference latency and zero cloud telemetry.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
