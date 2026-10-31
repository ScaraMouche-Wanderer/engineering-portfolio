"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function OTAManager() {
  const [status, setStatus] = useState<"idle" | "signing" | "deploying" | "complete">("idle");
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState({ total: 500, success: 0, failed: 0, offline: 34 });

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    let timeout: NodeJS.Timeout | undefined;
    
    if (status === "signing") {
      timeout = setTimeout(() => setStatus("deploying"), 2000);
    } else if (status === "deploying") {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setStatus("complete");
            return 100;
          }
          
          const increment = Math.random() * 5;
          const newProgress = Math.min(100, prev + increment);
          
          const completedDevices = Math.floor(((newProgress) / 100) * (stats.total - stats.offline));
          // Simulate a few random failures
          const failedDevices = Math.floor(completedDevices * 0.02);
          
          setStats(s => ({
            ...s,
            success: completedDevices - failedDevices,
            failed: failedDevices
          }));
          
          return newProgress;
        });
      }, 300);
    }
    
    return () => {
      if (interval) clearInterval(interval);
      if (timeout) clearTimeout(timeout);
    };
  }, [status, stats.total, stats.offline]);

  const handleDeploy = () => {
    setStatus("signing");
    setProgress(0);
    setStats({ total: 500, success: 0, failed: 0, offline: 34 });
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-12" style={{ fontFamily: '"Consolas", "Courier New", monospace' }}>
      
      <div className="border border-white/10 rounded-2xl overflow-hidden bg-[#0a0f14] shadow-2xl">
        <div className="bg-[#121820] px-6 py-4 border-b border-white/10 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-white/80 font-bold uppercase tracking-widest text-sm">OTA Fleet Manager</span>
            <span className="text-xs bg-white/10 text-white/50 px-2 py-0.5 rounded">v2.4.1</span>
          </div>
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-amber-500/50" />
            <div className="w-3 h-3 rounded-full bg-lime-500/50" />
          </div>
        </div>
        
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-[#121820] border border-white/5 rounded-xl p-6">
              <div className="text-white/40 text-xs uppercase mb-2">Total Fleet</div>
              <div className="text-3xl font-light text-white">{stats.total}</div>
            </div>
            <div className="bg-[#121820] border border-white/5 rounded-xl p-6">
              <div className="text-lime-500/60 text-xs uppercase mb-2">Success</div>
              <div className="text-3xl font-light text-lime-400">{stats.success}</div>
            </div>
            <div className="bg-[#121820] border border-white/5 rounded-xl p-6">
              <div className="text-red-500/60 text-xs uppercase mb-2">Failed</div>
              <div className="text-3xl font-light text-red-400">{stats.failed}</div>
            </div>
            <div className="bg-[#121820] border border-white/5 rounded-xl p-6">
              <div className="text-white/40 text-xs uppercase mb-2">Offline</div>
              <div className="text-3xl font-light text-white/50">{stats.offline}</div>
            </div>
          </div>

          <div className="bg-[#121820] border border-white/5 rounded-xl p-8 mb-8 flex flex-col items-center justify-center text-center">
            {status === "idle" && (
              <>
                <div className="w-16 h-16 rounded-full border border-dashed border-white/20 flex items-center justify-center mb-4 text-white/30">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                </div>
                <h3 className="text-white mb-2">Upload Firmware Image</h3>
                <p className="text-white/40 text-sm mb-6 max-w-md">Select a compiled .bin file. The image will be cryptographically signed before deployment.</p>
                <button 
                  onClick={handleDeploy}
                  className="px-6 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-full transition-colors"
                >
                  Select & Deploy firmware_v2.bin
                </button>
              </>
            )}

            {status !== "idle" && (
              <div className="w-full max-w-2xl text-left">
                <div className="flex justify-between items-end mb-2">
                  <h3 className="text-white text-lg">
                    {status === "signing" && "Signing payload with RSA-2048..."}
                    {status === "deploying" && "Pushing to active nodes..."}
                    {status === "complete" && "Deployment Complete"}
                  </h3>
                  <span className="text-cyan-400">{progress.toFixed(1)}%</span>
                </div>
                
                <div className="h-4 w-full bg-black/50 rounded-full overflow-hidden border border-white/5 mb-6">
                  <motion.div 
                    className="h-full bg-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.5)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: "linear", duration: 0.3 }}
                  />
                </div>

                <div className="bg-black/50 border border-white/5 rounded-lg p-4 h-32 overflow-y-auto text-xs text-white/40 flex flex-col gap-1">
                  {status === "signing" && (
                    <>
                      <div>&gt; Generating SHA-256 hash of firmware_v2.bin...</div>
                      <div>&gt; Hash: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</div>
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
                        &gt; Applying RSA-2048 signature using HSM key...
                      </motion.div>
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="text-cyan-400">
                        &gt; Signature valid. Ready for broadcast.
                      </motion.div>
                    </>
                  )}
                  {status === "deploying" && (
                    <>
                      <div>&gt; Signature valid. Ready for broadcast.</div>
                      <div>&gt; Establishing WebSocket connections to 466 nodes...</div>
                      <div>&gt; Splitting payload into 1024-byte chunks...</div>
                      <div className="text-cyan-400 animate-pulse">&gt; Streaming binary data over MQTT...</div>
                    </>
                  )}
                  {status === "complete" && (
                    <>
                      <div>&gt; Establishing WebSocket connections to 466 nodes...</div>
                      <div>&gt; Splitting payload into 1024-byte chunks...</div>
                      <div>&gt; Streaming binary data over MQTT...</div>
                      <div className="text-lime-400">&gt; Broadcast complete. All online nodes acknowledged receipt.</div>
                      <div className="text-amber-400">&gt; Nodes rebooting into new partition...</div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center text-xs text-white/30">
            <div>Target: ESP32-S3 (Architecture: Xtensa dual-core 32-bit LX7)</div>
            {status === "complete" && (
              <button onClick={() => setStatus("idle")} className="hover:text-white transition-colors underline">New Deployment</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
