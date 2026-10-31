"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, ShieldCheck, Sliders } from "lucide-react";

export default function FlightControllerVisualizer() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [filterMode, setFilterMode] = useState<"kalman" | "raw">("kalman");
  const [pidP, setPidP] = useState(1.4);
  const [pidI, setPidI] = useState(0.05);
  const [pidD, setPidD] = useState(0.28);

  const [attitude, setAttitude] = useState({ roll: 2.1, pitch: -1.5, yaw: 142.0 });
  const [motors, setMotors] = useState([1480, 1510, 1495, 1525]); // PWM microsecond values (1000 - 2000)
  const [history, setHistory] = useState<{ roll: number; pitch: number; raw: number }[]>([]);

  useEffect(() => {
    if (!isPlaying) return;

    let localYaw = 142.0;

    const interval = setInterval(() => {
      const t = Date.now() / 800;
      const targetRoll = Math.sin(t) * 12 + Math.cos(t * 1.5) * 4;
      const targetPitch = Math.cos(t * 0.8) * 8 + Math.sin(t * 2) * 3;
      const noise = (Math.random() - 0.5) * (filterMode === "raw" ? 6 : 0.6);

      const currentRoll = Number((targetRoll + noise).toFixed(1));
      const currentPitch = Number((targetPitch + noise).toFixed(1));
      localYaw = Number(((localYaw + 0.2) % 360).toFixed(1));

      setAttitude({
        roll: currentRoll,
        pitch: currentPitch,
        yaw: localYaw
      });

      // Calculate motor outputs based on PID corrections
      const baseThrottle = 1500;
      const rollCorr = currentRoll * pidP * 5;
      const pitchCorr = currentPitch * pidP * 5;

      setMotors([
        Math.round(baseThrottle + pitchCorr - rollCorr),
        Math.round(baseThrottle + pitchCorr + rollCorr),
        Math.round(baseThrottle - pitchCorr - rollCorr),
        Math.round(baseThrottle - pitchCorr + rollCorr)
      ]);

      setHistory((prev) => [
        ...prev.slice(-25),
        {
          roll: currentRoll,
          pitch: currentPitch,
          raw: Number((targetRoll + (Math.random() - 0.5) * 8).toFixed(1))
        }
      ]);
    }, 40); // 25 FPS steady live update

    return () => clearInterval(interval);
  }, [isPlaying, filterMode, pidP, pidI, pidD]);

  return (
    <div className="w-full max-w-5xl mx-auto my-8" style={{ fontFamily: 'var(--font-mono, monospace)' }}>
      <div style={{
        background: "var(--panel-strong)",
        border: "1px solid var(--line)",
        borderRadius: "1.25rem",
        overflow: "hidden",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
        backdropFilter: "blur(16px)"
      }}>
        {/* Header */}
        <div style={{
          padding: "1.25rem 1.75rem",
          background: "linear-gradient(90deg, rgba(111, 255, 233, 0.08), rgba(56, 189, 248, 0.04))",
          borderBottom: "1px solid var(--line)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "var(--cyan)",
              boxShadow: "0 0 10px var(--cyan)"
            }} />
            <div>
              <span style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--foreground)", letterSpacing: "1px" }}>
                QUANTUM V2 FLIGHT CONTROLLER CORE
              </span>
              <span style={{ display: "block", fontSize: "0.7rem", color: "var(--muted)", letterSpacing: "0.5px" }}>
                STM32F405 @ 168MHz • 1kHz Dual IMU Sensor Fusion & Blackbox Telemetry
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <button
              onClick={() => setFilterMode(filterMode === "kalman" ? "raw" : "kalman")}
              style={{
                background: filterMode === "kalman" ? "rgba(111, 255, 233, 0.15)" : "rgba(255, 184, 77, 0.15)",
                border: `1px solid ${filterMode === "kalman" ? "var(--cyan)" : "var(--amber)"}`,
                color: filterMode === "kalman" ? "var(--cyan)" : "var(--amber)",
                fontSize: "0.75rem",
                padding: "0.4rem 0.8rem",
                borderRadius: "0.5rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                fontWeight: 600
              }}
            >
              <ShieldCheck size={14} /> Filter: {filterMode === "kalman" ? "Kalman Fusion" : "Raw Accel"}
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              style={{
                background: isPlaying ? "rgba(255, 255, 255, 0.05)" : "rgba(173, 255, 106, 0.15)",
                border: "1px solid var(--line)",
                color: isPlaying ? "var(--muted)" : "var(--lime)",
                fontSize: "0.75rem",
                padding: "0.4rem 0.8rem",
                borderRadius: "0.5rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem"
              }}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />} {isPlaying ? "Freeze" : "Resume"}
            </button>
          </div>
        </div>

        {/* Visualizer Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem", padding: "1.75rem" }}>
          
          {/* Left: Artificial Horizon Attitude Indicator */}
          <div style={{
            background: "rgba(0,0,0,0.3)",
            border: "1px solid var(--line)",
            borderRadius: "0.75rem",
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative"
          }}>
            <span style={{ position: "absolute", top: "1rem", left: "1rem", color: "var(--cyan)", fontSize: "0.75rem", letterSpacing: "1px" }}>
              ATTITUDE HORIZON
            </span>

            {/* Circular Horizon Dial */}
            <div style={{
              width: "180px",
              height: "180px",
              borderRadius: "50%",
              border: "3px solid var(--cyan)",
              boxShadow: "0 0 25px rgba(111, 255, 233, 0.2)",
              position: "relative",
              overflow: "hidden",
              background: "#08110f",
              margin: "1rem 0"
            }}>
              {/* Sky / Ground Split */}
              <motion.div
                style={{
                  position: "absolute",
                  width: "300px",
                  height: "300px",
                  left: "-60px",
                  top: "-60px",
                  background: "linear-gradient(180deg, #1e3a8a 0%, #1e3a8a 50%, #854d0e 50%, #854d0e 100%)",
                  transformOrigin: "center center"
                }}
                animate={{
                  rotate: attitude.roll,
                  y: attitude.pitch * 3
                }}
                transition={{ duration: 0.05, ease: "linear" }}
              />

              {/* Pitch Ladder Lines */}
              <div style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none"
              }}>
                <div style={{ width: "40px", height: "1px", background: "rgba(255,255,255,0.7)", margin: "8px 0" }} />
                <div style={{ width: "80px", height: "2px", background: "white", margin: "4px 0" }} />
                <div style={{ width: "40px", height: "1px", background: "rgba(255,255,255,0.7)", margin: "8px 0" }} />
              </div>

              {/* Fixed Aircraft Reticle */}
              <div style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none"
              }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--amber)", border: "2px solid #000" }} />
                <div style={{ position: "absolute", width: "40px", height: "3px", background: "var(--amber)", borderRadius: "2px" }} />
              </div>
            </div>

            {/* Attitude Readouts */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", width: "100%", textAlign: "center", marginTop: "0.5rem" }}>
              <div style={{ background: "rgba(255,255,255,0.03)", padding: "0.6rem", borderRadius: "0.5rem", border: "1px solid var(--line)" }}>
                <span style={{ fontSize: "0.65rem", color: "var(--muted)", display: "block" }}>ROLL</span>
                <span style={{ fontSize: "1rem", color: "var(--foreground)", fontWeight: 700 }}>{attitude.roll}°</span>
              </div>
              <div style={{ background: "rgba(255,255,255,0.03)", padding: "0.6rem", borderRadius: "0.5rem", border: "1px solid var(--line)" }}>
                <span style={{ fontSize: "0.65rem", color: "var(--muted)", display: "block" }}>PITCH</span>
                <span style={{ fontSize: "1rem", color: "var(--foreground)", fontWeight: 700 }}>{attitude.pitch}°</span>
              </div>
              <div style={{ background: "rgba(255,255,255,0.03)", padding: "0.6rem", borderRadius: "0.5rem", border: "1px solid var(--line)" }}>
                <span style={{ fontSize: "0.65rem", color: "var(--muted)", display: "block" }}>YAW (HEADING)</span>
                <span style={{ fontSize: "1rem", color: "var(--cyan)", fontWeight: 700 }}>{attitude.yaw}°</span>
              </div>
            </div>
          </div>

          {/* Right: 4 Quad-X Motors & PID Tuning */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            
            {/* 4 Motors Quad-X Telemetry */}
            <div style={{
              background: "rgba(0,0,0,0.3)",
              border: "1px solid var(--line)",
              borderRadius: "0.75rem",
              padding: "1.25rem"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <span style={{ color: "var(--cyan)", fontSize: "0.75rem", letterSpacing: "1px", textTransform: "uppercase" }}>
                  DSHOT-600 MOTOR PWM SIGNALS
                </span>
                <span style={{ fontSize: "0.65rem", color: "var(--lime)" }}>Loop: 1000 Hz</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem" }}>
                {motors.map((pwm, idx) => {
                  const percent = Math.max(0, Math.min(100, ((pwm - 1000) / 1000) * 100));
                  return (
                    <div key={idx} style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid var(--line)",
                      borderRadius: "0.5rem",
                      padding: "0.75rem 0.5rem",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "0.5rem"
                    }}>
                      <span style={{ fontSize: "0.65rem", color: "var(--muted)" }}>M{idx + 1}</span>
                      
                      {/* Vertical Progress Bar */}
                      <div style={{ width: "12px", height: "80px", background: "rgba(255,255,255,0.05)", borderRadius: "6px", overflow: "hidden", position: "relative" }}>
                        <div style={{
                          position: "absolute",
                          bottom: 0,
                          width: "100%",
                          height: `${percent}%`,
                          background: percent > 60 ? "var(--orange)" : "var(--cyan)",
                          transition: "height 0.1s linear"
                        }} />
                      </div>

                      <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--foreground)" }}>
                        {pwm}
                      </span>
                      <span style={{ fontSize: "0.6rem", color: "var(--muted)" }}>μs</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Live PID Oscilloscope */}
            <div style={{
              background: "rgba(0,0,0,0.3)",
              border: "1px solid var(--line)",
              borderRadius: "0.75rem",
              padding: "1.25rem",
              flex: 1
            }}>
              <span style={{ color: "var(--cyan)", fontSize: "0.75rem", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: "0.75rem" }}>
                SENSOR FUSION (KALMAN vs RAW IMU)
              </span>

              <div style={{ height: "70px", width: "100%" }}>
                <svg width="100%" height="100%" viewBox="0 0 300 70" preserveAspectRatio="none">
                  <line x1="0" y1="35" x2="300" y2="35" stroke="var(--line)" strokeDasharray="2 2" />
                  {history.length > 1 && (
                    <>
                      {/* Raw Noisy line */}
                      <polyline
                        fill="none"
                        stroke="rgba(255, 184, 77, 0.4)"
                        strokeWidth="1.5"
                        points={history.map((h, i) => `${(i / (history.length - 1)) * 300},${35 - h.raw * 1.5}`).join(" ")}
                      />
                      {/* Filtered Kalman line */}
                      <polyline
                        fill="none"
                        stroke="var(--cyan)"
                        strokeWidth="2"
                        points={history.map((h, i) => `${(i / (history.length - 1)) * 300},${35 - h.roll * 1.5}`).join(" ")}
                      />
                    </>
                  )}
                </svg>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.65rem", marginTop: "0.4rem" }}>
                <span style={{ color: "var(--cyan)" }}>● Kalman Filtered Rate</span>
                <span style={{ color: "var(--amber)" }}>● Raw Gyro/Accel Noise</span>
              </div>
            </div>

            {/* Live PID Tuning Sliders */}
            <div style={{
              background: "rgba(0,0,0,0.3)",
              border: "1px solid var(--line)",
              borderRadius: "0.75rem",
              padding: "1.25rem"
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <span style={{ color: "var(--cyan)", fontSize: "0.75rem", letterSpacing: "1px", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <Sliders size={13} /> REAL-TIME PID TUNING
                </span>
                <button
                  onClick={() => {
                    setPidP(1.4);
                    setPidI(0.05);
                    setPidD(0.28);
                  }}
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid var(--line)",
                    color: "var(--muted)",
                    fontSize: "0.65rem",
                    padding: "0.2rem 0.5rem",
                    borderRadius: "0.3rem",
                    cursor: "pointer"
                  }}
                >
                  Reset
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem", fontSize: "0.7rem" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem", color: "var(--muted)" }}>
                    <span>Kp (Proportional)</span>
                    <span style={{ color: "var(--foreground)", fontWeight: 700 }}>{pidP.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="3.0"
                    step="0.05"
                    value={pidP}
                    onChange={(e) => setPidP(parseFloat(e.target.value))}
                    style={{ width: "100%", accentColor: "var(--cyan)", cursor: "pointer" }}
                  />
                </div>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem", color: "var(--muted)" }}>
                    <span>Ki (Integral)</span>
                    <span style={{ color: "var(--foreground)", fontWeight: 700 }}>{pidI.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.0"
                    max="0.2"
                    step="0.01"
                    value={pidI}
                    onChange={(e) => setPidI(parseFloat(e.target.value))}
                    style={{ width: "100%", accentColor: "var(--lime)", cursor: "pointer" }}
                  />
                </div>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem", color: "var(--muted)" }}>
                    <span>Kd (Derivative)</span>
                    <span style={{ color: "var(--foreground)", fontWeight: 700 }}>{pidD.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.0"
                    max="0.8"
                    step="0.02"
                    value={pidD}
                    onChange={(e) => setPidD(parseFloat(e.target.value))}
                    style={{ width: "100%", accentColor: "var(--amber)", cursor: "pointer" }}
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
