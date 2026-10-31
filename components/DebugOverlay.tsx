"use client";

import { useEffect, useState } from "react";
import { useDebugStore } from "@/store/useDebugStore";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, X } from "lucide-react";

export default function DebugOverlay() {
  const isDebugMode = useDebugStore((s) => s.isDebugMode);
  const toggleDebugMode = useDebugStore((s) => s.toggleDebugMode);
  const logs = useDebugStore((s) => s.logs);
  const addLog = useDebugStore((s) => s.addLog);

  const [metrics, setMetrics] = useState({ fps: 60, memory: 45.2, ping: 12 });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = ["INPUT", "TEXTAREA", "SELECT"].includes(target?.tagName);
      if (isInput) return;

      // Ctrl + Shift + D
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "d") {
        e.preventDefault();
        toggleDebugMode();
        addLog(`System Debug Mode ${useDebugStore.getState().isDebugMode ? "Disabled" : "Enabled"}`, "warn");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleDebugMode, addLog]);

  useEffect(() => {
    if (!isDebugMode) return;
    
    const interval = setInterval(() => {
      setMetrics({
        fps: Math.floor(58 + Math.random() * 3),
        memory: +(42 + Math.random() * 4).toFixed(1),
        ping: Math.floor(10 + Math.random() * 5),
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [isDebugMode]);

  if (!isDebugMode) return null;

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-[10000] debug-active"
      style={{ background: 'rgba(0, 0, 0, 0.05)' }}
    >
      <AnimatePresence>
        {isDebugMode && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-20 right-6 w-84 bg-black/90 backdrop-blur-md border border-cyan-500/40 rounded-xl overflow-hidden shadow-2xl pointer-events-auto"
            style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.8rem' }}
          >
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-cyan-500/20 bg-cyan-500/10">
              <div className="flex items-center gap-2">
                <Cpu size={14} className="text-cyan-400" />
                <span className="text-cyan-400 font-bold tracking-widest uppercase text-xs">SYS.TELEMETRY HUD</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-lime-500 animate-pulse" />
                <button
                  onClick={toggleDebugMode}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
            
            <div className="p-4 flex flex-col gap-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-white/5 rounded-lg p-2 text-center border border-white/5">
                  <div className="text-white/50 mb-1 text-[10px]">FPS</div>
                  <div className="text-lime-400 font-bold">{metrics.fps}</div>
                </div>
                <div className="bg-white/5 rounded-lg p-2 text-center border border-white/5">
                  <div className="text-white/50 mb-1 text-[10px]">HEAP (MB)</div>
                  <div className="text-amber-400 font-bold">{metrics.memory}</div>
                </div>
                <div className="bg-white/5 rounded-lg p-2 text-center border border-white/5">
                  <div className="text-white/50 mb-1 text-[10px]">BUS LATENCY</div>
                  <div className="text-cyan-400 font-bold">{metrics.ping}ms</div>
                </div>
              </div>

              <div className="h-36 overflow-y-auto flex flex-col gap-1 border-t border-white/10 pt-3">
                {logs.length === 0 && (
                  <span className="text-white/40 text-xs">[SYS] Monitoring FreeRTOS kernel & WebSockets...</span>
                )}
                {logs.map((log) => (
                  <div key={log.id} className="flex gap-2">
                    <span className="text-white/30 shrink-0 text-[11px]">
                      [{new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]
                    </span>
                    <span className={`text-[11px] ${
                      log.type === 'warn' ? 'text-amber-400' :
                      log.type === 'error' ? 'text-red-400' :
                      log.type === 'success' ? 'text-lime-400' :
                      'text-cyan-400/90'
                    }`}>
                      {log.message}
                    </span>
                  </div>
                ))}
                <div className="text-cyan-400 animate-pulse text-xs">_</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
