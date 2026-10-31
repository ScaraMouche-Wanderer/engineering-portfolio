"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, CheckCircle, AlertTriangle } from "lucide-react";

export default function InteractiveOTA() {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "uploading" | "validating" | "flashing" | "success" | "error">("idle");
  const [logs, setLogs] = useState<string[]>([]);
  const [isLight, setIsLight] = useState(() => {
    if (typeof document !== "undefined") {
      return document.documentElement.classList.contains("light");
    }
    return false;
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addLog = (msg: string) => setLogs((prev) => [...prev, msg].slice(-5));

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          setIsLight(document.documentElement.classList.contains("light"));
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (status === "uploading") {
      let p = 0;
      const interval = setInterval(() => {
        p += Math.random() * 15;
        if (p >= 100) {
          p = 100;
          clearInterval(interval);
          setStatus("validating");
          setLogs((prev) => [...prev, "[OK] Upload complete. Verifying cryptographic signature..."].slice(-5));
        }
        setProgress(p);
      }, 300);
      return () => clearInterval(interval);
    }

    if (status === "validating") {
      const timeout = setTimeout(() => {
        setProgress(0);
        setStatus("flashing");
        addLog("[OK] Signature verified. Key ID: 0x8F9B2");
        addLog("[SYS] Erasing memory sectors...");
      }, 1500);
      return () => clearTimeout(timeout);
    }

    if (status === "flashing") {
      let p = 0;
      const interval = setInterval(() => {
        p += Math.random() * 8;
        if (p >= 100) {
          p = 100;
          clearInterval(interval);
          setStatus("success");
          addLog("[OK] Flash successful. Rebooting target MCU...");
        }
        setProgress(p);
      }, 200);
      return () => clearInterval(interval);
    }
  }, [status]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = e.target.files[0];
      setFile(selected);
      setStatus("uploading");
      setProgress(0);
      setLogs([`[FILE] Selected firmware image: ${selected.name}`]);
    }
  };

  const styles = {
    statusBg: isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)',
    border: isLight ? '2px dashed rgba(13, 140, 131, 0.2)' : '2px dashed rgba(111,255,233,0.3)',
    hoverBorder: isLight ? 'rgba(13, 140, 131, 0.2)' : 'rgba(111,255,233,0.3)',
    dropBg: isLight ? 'rgba(13, 140, 131, 0.02)' : 'rgba(111,255,233,0.02)',
    text: isLight ? '#1a1a1a' : 'white',
    circleTrack: isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.1)',
    consoleBg: isLight ? '#ffffff' : 'rgba(0,0,0,0.6)',
    consoleBorder: isLight ? '1px solid rgba(13, 140, 131, 0.2)' : 'none',
    resetBorder: isLight ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(255,255,255,0.1)'
  };

  return (
    <div 
      style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      onClick={(e) => e.stopPropagation()}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <span style={{ fontFamily: 'monospace', color: 'var(--cyan)', fontSize: '0.8rem', letterSpacing: '2px' }}>FLEET_OTA_CONSOLE</span>
        <span style={{ fontSize: '0.7rem', color: status === 'success' ? '#10b981' : 'var(--muted)', background: styles.statusBg, padding: '2px 8px', borderRadius: '4px' }}>
          {status.toUpperCase()}
        </span>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}>
        {status === "idle" && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ textAlign: 'center', width: '100%' }}
          >
            <div 
              style={{ 
                border: styles.border, 
                borderRadius: '12px', 
                padding: '2rem 1rem', 
                cursor: 'pointer',
                background: styles.dropBg,
                transition: 'all 0.2s ease'
              }}
              onClick={() => fileInputRef.current?.click()}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--cyan)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = styles.hoverBorder}
            >
              <UploadCloud size={32} color="var(--cyan)" style={{ margin: '0 auto 1rem auto' }} />
              <p style={{ margin: 0, color: styles.text, fontSize: '0.9rem', fontWeight: 500 }}>Select .bin Firmware Image</p>
              <p style={{ margin: '0.5rem 0 0 0', color: 'var(--muted)', fontSize: '0.75rem' }}>Simulate live hardware OTA update</p>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".bin,.hex,.zip" style={{ display: 'none' }} />
          </motion.div>
        )}

        {status !== "idle" && (
          <div style={{ width: '100%' }}>
            {file && (
              <div style={{ textAlign: 'center', marginBottom: '0.75rem' }}>
                <span style={{ 
                  fontSize: '0.7rem', 
                  fontFamily: 'monospace', 
                  color: 'var(--cyan)', 
                  background: styles.statusBg, 
                  padding: '3px 10px', 
                  borderRadius: '12px',
                  border: '1px solid rgba(111,255,233,0.2)'
                }}>
                  Target: {file.name}
                </span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
              {status === "success" ? (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><CheckCircle size={48} color="#10b981" /></motion.div>
              ) : status === "error" ? (
                <AlertTriangle size={48} color="#ef4444" />
              ) : (
                <div style={{ position: 'relative', width: '64px', height: '64px' }}>
                  <svg width="64" height="64" viewBox="0 0 64 64" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="32" cy="32" r="28" fill="none" stroke={styles.circleTrack} strokeWidth="4" />
                    <circle cx="32" cy="32" r="28" fill="none" stroke="var(--cyan)" strokeWidth="4" 
                            strokeDasharray={2 * Math.PI * 28} 
                            strokeDashoffset={2 * Math.PI * 28 * (1 - progress / 100)} 
                            style={{ transition: 'stroke-dashoffset 0.3s ease' }} />
                  </svg>
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: styles.text, fontWeight: 'bold' }}>
                    {Math.round(progress)}%
                  </div>
                </div>
              )}
            </div>

            <div style={{ background: styles.consoleBg, border: styles.consoleBorder, padding: '1rem', borderRadius: '8px', minHeight: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', overflow: 'hidden' }}>
              <AnimatePresence>
                {logs.map((log, i) => (
                  <motion.div 
                    key={i + log}
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    style={{ 
                      fontFamily: 'monospace', 
                      fontSize: '0.75rem', 
                      color: log.includes('[OK]') ? '#10b981' : log.includes('[SYS]') ? 'var(--muted)' : 'var(--cyan)',
                      marginTop: '4px'
                    }}
                  >
                    {log}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
      
      {status === 'success' && (
        <button 
          style={{ width: '100%', padding: '0.5rem', background: 'transparent', border: styles.resetBorder, color: 'var(--muted)', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', marginTop: '1rem' }}
          onClick={() => { setStatus('idle'); setFile(null); setLogs([]); }}
        >
          Reset Simulation
        </button>
      )}
    </div>
  );
}
