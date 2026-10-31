"use client";

import { useState, useEffect, useRef } from "react";
import { Activity, AlertTriangle, Database, Sliders } from "lucide-react";

interface SensorChannel {
  id: string;
  name: string;
  unit: string;
  min: number;
  max: number;
  normalMin: number;
  normalMax: number;
  current: number;
  adcRaw: number;
  status: "nominal" | "warning" | "critical";
  history: number[];
  color: string;
}

export default function IndustrialSensorsVisualizer() {
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [sampleRate, setSampleRate] = useState<10 | 50 | 100>(50);
  const [logs, setLogs] = useState<string[]>([
    "[INIT] STM32F4 ADC DMA Controller Initialized",
    "[BUS] Modbus-RTU RS485 Interface Active @ 115200 baud",
    "[4-20mA] 4 Industrial Loop Transmitters Calibrated",
    "[OK] Continuous Telemetry Stream Synced with Plant SCADA"
  ]);

  const [sensors, setSensors] = useState<Record<string, SensorChannel>>({
    roasterTemp: {
      id: "roasterTemp",
      name: "Roaster Core Temp (RTD)",
      unit: "°C",
      min: 700,
      max: 1100,
      normalMin: 850,
      normalMax: 980,
      current: 918.4,
      adcRaw: 3412,
      status: "nominal",
      history: [912, 915, 918, 917, 919, 918, 920, 918.4],
      color: "#ff7b54"
    },
    so2Gas: {
      id: "so2Gas",
      name: "SO₂ Flue Gas Analyzer",
      unit: "ppm",
      min: 0,
      max: 1500,
      normalMin: 200,
      normalMax: 750,
      current: 432.1,
      adcRaw: 1820,
      status: "nominal",
      history: [420, 425, 430, 428, 435, 431, 432.1],
      color: "#6fffe9"
    },
    slurryPressure: {
      id: "slurryPressure",
      name: "Leaching Slurry Pressure",
      unit: "bar",
      min: 0,
      max: 30,
      normalMin: 12,
      normalMax: 22,
      current: 18.2,
      adcRaw: 2480,
      status: "nominal",
      history: [18.0, 18.1, 18.3, 18.2, 18.4, 18.2],
      color: "#ffb84d"
    },
    millVibe: {
      id: "millVibe",
      name: "Smelter Mill Vibration",
      unit: "mm/s",
      min: 0,
      max: 12,
      normalMin: 1.0,
      normalMax: 4.5,
      current: 2.85,
      adcRaw: 1140,
      status: "nominal",
      history: [2.8, 2.9, 2.7, 2.85, 2.9, 2.85],
      color: "#adff6a"
    }
  });

  const [activeChannel, setActiveChannel] = useState<string>("roasterTemp");
  const logContainerRef = useRef<HTMLDivElement>(null);

  const addLog = (msg: string) => {
    setLogs((prev) => [...prev.slice(-15), msg]);
  };

  useEffect(() => {
    const intervalTime = 1000 / (sampleRate / 5);
    const interval = setInterval(() => {
      setSensors((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((key) => {
          const s = next[key];
          let delta = (Math.random() - 0.5) * (s.max - s.min) * 0.015;
          if (isCalibrating) {
            delta *= 0.1;
          }
          let newCurrent = Math.max(s.min, Math.min(s.max, s.current + delta));
          newCurrent = Number(newCurrent.toFixed(s.unit === "bar" || s.unit === "mm/s" ? 2 : 1));

          let status: "nominal" | "warning" | "critical" = "nominal";
          if (newCurrent > s.normalMax || newCurrent < s.normalMin) {
            status = newCurrent > s.normalMax + (s.max - s.normalMax) * 0.5 ? "critical" : "warning";
          }

          const rawAdc = Math.round(((newCurrent - s.min) / (s.max - s.min)) * 4095);
          const newHistory = [...s.history.slice(-15), newCurrent];

          next[key] = {
            ...s,
            current: newCurrent,
            adcRaw: rawAdc,
            status,
            history: newHistory
          };
        });
        return next;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [sampleRate, isCalibrating]);

  const triggerAnomaly = () => {
    setSensors((prev) => {
      const next = { ...prev };
      next.roasterTemp.current = 1042.5;
      next.roasterTemp.status = "critical";
      next.so2Gas.current = 980.0;
      next.so2Gas.status = "warning";
      return next;
    });
    addLog(`[ALERT] HIGH TEMPERATURE DETECTED: 1042.5°C on Channel 0 (Roaster Core)`);
    addLog(`[ALERT] Flue Gas SO2 Surge detected: 980 ppm - Automated cooling valve energized`);
  };

  const currentActive = sensors[activeChannel] || sensors.roasterTemp;

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
        {/* Top Instrumentation Header */}
        <div style={{
          padding: "1.25rem 1.75rem",
          background: "linear-gradient(90deg, rgba(56, 189, 248, 0.08), rgba(255, 123, 84, 0.04))",
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
              background: "var(--lime)",
              boxShadow: "0 0 10px var(--lime)"
            }} />
            <div>
              <span style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--foreground)", letterSpacing: "1px" }}>
                HZL INDUSTRIAL TELEMETRY ACQUISITION UNIT
              </span>
              <span style={{ display: "block", fontSize: "0.7rem", color: "var(--muted)", letterSpacing: "0.5px" }}>
                Hindustan Zinc Limited (Chanderiya Smelter Complex) • STM32 / 4-20mA Current Loop
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <button
              onClick={triggerAnomaly}
              style={{
                background: "rgba(255, 77, 77, 0.15)",
                border: "1px solid rgba(255, 77, 77, 0.4)",
                color: "#ff8080",
                fontSize: "0.75rem",
                padding: "0.4rem 0.8rem",
                borderRadius: "0.5rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                fontWeight: 600,
                transition: "all 0.2s"
              }}
            >
              <AlertTriangle size={14} /> Inject Thermal Surge
            </button>

            <button
              onClick={() => setIsCalibrating(!isCalibrating)}
              style={{
                background: isCalibrating ? "rgba(111, 255, 233, 0.2)" : "rgba(255, 255, 255, 0.05)",
                border: `1px solid ${isCalibrating ? "var(--cyan)" : "var(--line)"}`,
                color: isCalibrating ? "var(--cyan)" : "var(--foreground)",
                fontSize: "0.75rem",
                padding: "0.4rem 0.8rem",
                borderRadius: "0.5rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                transition: "all 0.2s"
              }}
            >
              <Sliders size={14} /> {isCalibrating ? "Calibrating..." : "Calibrate ADC"}
            </button>
          </div>
        </div>

        {/* 4 Sensor Channel Tabs */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1px",
          background: "var(--line)"
        }}>
          {Object.values(sensors).map((sensor) => {
            const isSelected = activeChannel === sensor.id;
            return (
              <div
                key={sensor.id}
                onClick={() => setActiveChannel(sensor.id)}
                style={{
                  padding: "1.25rem",
                  background: isSelected ? "var(--background-soft)" : "var(--panel)",
                  cursor: "pointer",
                  borderLeft: isSelected ? `3px solid ${sensor.color}` : "3px solid transparent",
                  transition: "all 0.2s ease"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.4rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    {sensor.name.split(" ")[0]}
                  </span>
                  <span style={{
                    fontSize: "0.65rem",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    background: sensor.status === "critical" ? "rgba(239, 68, 68, 0.2)" : sensor.status === "warning" ? "rgba(255, 184, 77, 0.2)" : "rgba(173, 255, 106, 0.15)",
                    color: sensor.status === "critical" ? "#ef4444" : sensor.status === "warning" ? "var(--amber)" : "var(--lime)"
                  }}>
                    {sensor.status.toUpperCase()}
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "baseline", gap: "0.3rem" }}>
                  <span style={{ fontSize: "1.6rem", fontWeight: 700, color: "var(--foreground)" }}>
                    {sensor.current}
                  </span>
                  <span style={{ fontSize: "0.9rem", color: sensor.color }}>{sensor.unit}</span>
                </div>

                <div style={{ marginTop: "0.5rem", display: "flex", justifyContent: "space-between", fontSize: "0.65rem", color: "var(--muted)" }}>
                  <span>ADC 12-bit: 0x{sensor.adcRaw.toString(16).toUpperCase().padStart(3, "0")}</span>
                  <span>Range: {sensor.min}-{sensor.max}{sensor.unit}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Deep Telemetry Visualizer Body */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem", padding: "1.75rem" }}>
          {/* Left: Waveform & ADC Gauge */}
          <div style={{
            background: "rgba(0,0,0,0.3)",
            border: "1px solid var(--line)",
            borderRadius: "0.75rem",
            padding: "1.25rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "var(--cyan)", fontSize: "0.8rem", letterSpacing: "1px", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Activity size={14} /> Real-Time Signal Waveform ({currentActive.name})
              </span>
              <div style={{ display: "flex", gap: "0.4rem" }}>
                {([10, 50, 100] as const).map((rate) => (
                  <button
                    key={rate}
                    onClick={() => setSampleRate(rate)}
                    style={{
                      background: sampleRate === rate ? "var(--cyan)" : "rgba(255,255,255,0.05)",
                      color: sampleRate === rate ? "#000" : "var(--muted)",
                      border: "none",
                      padding: "2px 8px",
                      borderRadius: "4px",
                      fontSize: "0.65rem",
                      cursor: "pointer",
                      fontWeight: 600
                    }}
                  >
                    {rate}Hz
                  </button>
                ))}
              </div>
            </div>

            {/* SVG Live Line Graph */}
            <div style={{ height: "140px", width: "100%", position: "relative" }}>
              <svg width="100%" height="100%" viewBox="0 0 400 120" preserveAspectRatio="none" style={{ overflow: "visible" }}>
                {/* Background Grid Lines */}
                <line x1="0" y1="30" x2="400" y2="30" stroke="var(--line)" strokeDasharray="3 3" />
                <line x1="0" y1="60" x2="400" y2="60" stroke="var(--line)" strokeDasharray="3 3" />
                <line x1="0" y1="90" x2="400" y2="90" stroke="var(--line)" strokeDasharray="3 3" />

                {/* Polyline of History */}
                {(() => {
                  const hist = currentActive.history;
                  const range = currentActive.max - currentActive.min;
                  const points = hist.map((val, idx) => {
                    const x = (idx / (hist.length - 1)) * 400;
                    const normalized = 1 - (val - currentActive.min) / range;
                    const y = Math.max(5, Math.min(115, normalized * 100 + 10));
                    return `${x},${y}`;
                  }).join(" ");

                  return (
                    <>
                      <polyline
                        fill="none"
                        stroke={currentActive.color}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={points}
                      />
                      {hist.map((val, idx) => {
                        const x = (idx / (hist.length - 1)) * 400;
                        const normalized = 1 - (val - currentActive.min) / range;
                        const y = Math.max(5, Math.min(115, normalized * 100 + 10));
                        return (
                          <circle
                            key={idx}
                            cx={x}
                            cy={y}
                            r={idx === hist.length - 1 ? 4 : 2}
                            fill={currentActive.color}
                          />
                        );
                      })}
                    </>
                  );
                })()}
              </svg>
            </div>

            {/* Industrial Conversion Flow */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "0.5rem",
              background: "rgba(255, 255, 255, 0.02)",
              padding: "0.75rem",
              borderRadius: "0.5rem",
              border: "1px solid var(--line)"
            }}>
              <div>
                <span style={{ fontSize: "0.65rem", color: "var(--muted)", display: "block" }}>LOOP CURRENT</span>
                <span style={{ fontSize: "0.9rem", color: "var(--foreground)", fontWeight: 600 }}>
                  {(4 + ((currentActive.current - currentActive.min) / (currentActive.max - currentActive.min)) * 16).toFixed(2)} mA
                </span>
              </div>
              <div>
                <span style={{ fontSize: "0.65rem", color: "var(--muted)", display: "block" }}>ADC VALUE</span>
                <span style={{ fontSize: "0.9rem", color: "var(--cyan)", fontWeight: 600 }}>
                  {currentActive.adcRaw} / 4095
                </span>
              </div>
              <div>
                <span style={{ fontSize: "0.65rem", color: "var(--muted)", display: "block" }}>CALIBRATED OUT</span>
                <span style={{ fontSize: "0.9rem", color: currentActive.color, fontWeight: 600 }}>
                  {currentActive.current} {currentActive.unit}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Modbus Packet Log & Industrial Impact */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{
              background: "#080c10",
              border: "1px solid var(--line)",
              borderRadius: "0.75rem",
              padding: "1rem",
              flex: 1,
              display: "flex",
              flexDirection: "column"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--cyan)", letterSpacing: "1px", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <Database size={14} /> SCADA / Modbus-RTU Log
                </span>
                <span style={{ fontSize: "0.65rem", color: "var(--muted)" }}>Frame rate: {sampleRate} pkts/s</span>
              </div>

              <div
                ref={logContainerRef}
                style={{
                  flex: 1,
                  maxHeight: "150px",
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.3rem",
                  fontSize: "0.7rem",
                  color: "var(--muted)"
                }}
              >
                {logs.map((log, idx) => (
                  <div key={idx} style={{
                    color: log.includes("[ALERT]") ? "#ef4444" : log.includes("[OK]") ? "var(--lime)" : "var(--muted)"
                  }}>
                    {log}
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              background: "rgba(56, 189, 248, 0.05)",
              border: "1px solid rgba(56, 189, 248, 0.2)",
              borderRadius: "0.75rem",
              padding: "1rem"
            }}>
              <strong style={{ display: "block", color: "var(--cyan)", fontSize: "0.75rem", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "0.3rem" }}>
                Industrial Production Impact
              </strong>
              <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--muted)", lineHeight: 1.5 }}>
                Implemented at Hindustan Zinc Limited (world’s largest single zinc smelting plant). Prototyped a robust 4-20mA ADC acquisition module that eliminated manual operator rounds by 40% while preventing unplanned kiln downtime.
              </p>
            </div>
          </div>
        </div>

        {/* Core Industrial Innovations & Proven Impact Matrix */}
        <div style={{
          padding: "1.5rem",
          background: "#05080c",
          borderTop: "1px solid var(--line)"
        }}>
          <span style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--amber)", letterSpacing: "1px", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
            <Activity size={16} /> Core Industrial Innovations & Engineering Uniqueness
          </span>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
            <div style={{ background: "rgba(255,255,255,0.05)", padding: "1.1rem", borderRadius: "0.75rem", border: "1px solid rgba(255,255,255,0.08)" }}>
              <span style={{ color: "#ffffff", fontWeight: 700, fontSize: "0.92rem", display: "block", marginBottom: "0.35rem" }}>
                1. 4-20mA Current Loops
              </span>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.6 }}>
                Immune to severe industrial electromagnetic noise across kilometer-long smelter cable runs, with live broken-wire fault detection (0mA).
              </p>
            </div>

            <div style={{ background: "rgba(255,255,255,0.05)", padding: "1.1rem", borderRadius: "0.75rem", border: "1px solid rgba(255,255,255,0.08)" }}>
              <span style={{ color: "#ffffff", fontWeight: 700, fontSize: "0.92rem", display: "block", marginBottom: "0.35rem" }}>
                2. 12-Bit ADC DMA Sampling
              </span>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.6 }}>
                Continuous hardware Direct Memory Access transfers convert 4 channels without CPU blocking, maintaining real-time SCADA telemetry.
              </p>
            </div>

            <div style={{ background: "rgba(255,255,255,0.05)", padding: "1.1rem", borderRadius: "0.75rem", border: "1px solid rgba(255,255,255,0.08)" }}>
              <span style={{ color: "#ffffff", fontWeight: 700, fontSize: "0.92rem", display: "block", marginBottom: "0.35rem" }}>
                3. Sub-Second Valve Actuation
              </span>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.6 }}>
                Embedded threshold monitors detect thermal runaway (&gt;1000°C) and SO₂ gas surges to trigger emergency cooling interlocks automatically.
              </p>
            </div>

            <div style={{ background: "rgba(255,255,255,0.05)", padding: "1.1rem", borderRadius: "0.75rem", border: "1px solid rgba(255,255,255,0.08)" }}>
              <span style={{ color: "#ffffff", fontWeight: 700, fontSize: "0.92rem", display: "block", marginBottom: "0.35rem" }}>
                4. 40% Routine Check Reduction
              </span>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.6 }}>
                Prototyped and deployed at Vedanta Hindustan Zinc Ltd (Chanderiya), eliminating 40% of hazardous manual walk-through inspections.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
