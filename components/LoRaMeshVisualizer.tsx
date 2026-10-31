"use client";

import { useState, useEffect } from "react";
import { Radio, ShieldAlert } from "lucide-react";

interface NodeData {
  id: string;
  name: string;
  location: string;
  rssi: number;
  snr: number;
  temp: number;
  vibration: number;
  status: "nominal" | "warning" | "critical";
  lastHeard: string;
}

export default function LoRaMeshVisualizer() {
  const [selectedNode, setSelectedNode] = useState<string>("node-1");
  const [packetCount, setPacketCount] = useState(14820);
  const [anomalyActive, setAnomalyActive] = useState(false);

  const [nodes, setNodes] = useState<Record<string, NodeData>>({
    "node-1": {
      id: "node-1",
      name: "ESP32 Node 01",
      location: "Pump House - Induction Motor 4A",
      rssi: -68,
      snr: 9.4,
      temp: 48.2,
      vibration: 1.8,
      status: "nominal",
      lastHeard: "20ms ago"
    },
    "node-2": {
      id: "node-2",
      name: "ESP32 Node 02",
      location: "Exhaust Blower #2 Bearing Unit",
      rssi: -82,
      snr: 6.2,
      temp: 54.6,
      vibration: 2.1,
      status: "nominal",
      lastHeard: "45ms ago"
    },
    "node-3": {
      id: "node-3",
      name: "ESP32 Node 03 (Mesh Gateway)",
      location: "Central Substation LoRa Hub",
      rssi: -45,
      snr: 12.0,
      temp: 38.0,
      vibration: 0.4,
      status: "nominal",
      lastHeard: "5ms ago"
    },
    "node-4": {
      id: "node-4",
      name: "ESP32 Node 04",
      location: "Slurry Agitator Reducer Gearbox",
      rssi: -94,
      snr: 4.1,
      temp: 61.2,
      vibration: 3.2,
      status: "nominal",
      lastHeard: "120ms ago"
    }
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setPacketCount((c) => c + 1);
      setNodes((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((k) => {
          if (k === "node-2" && anomalyActive) {
            next[k].vibration = Number((7.8 + Math.random() * 0.8).toFixed(2));
            next[k].temp = Number((82.4 + Math.random() * 1.2).toFixed(1));
            next[k].status = "critical";
          } else {
            const jitter = (Math.random() - 0.5) * 0.2;
            next[k].temp = Number((next[k].temp + jitter * 0.2).toFixed(1));
            next[k].vibration = Number(Math.max(0.2, next[k].vibration + jitter * 0.1).toFixed(2));
          }
        });
        return next;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [anomalyActive]);

  const active = nodes[selectedNode] || nodes["node-1"];

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
          background: "linear-gradient(90deg, rgba(255, 184, 77, 0.08), rgba(111, 255, 233, 0.04))",
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
              background: "var(--amber)",
              boxShadow: "0 0 10px var(--amber)"
            }} />
            <div>
              <span style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--foreground)", letterSpacing: "1px" }}>
                INDUSTRIAL LORAWAN TELEMETRY MESH
              </span>
              <span style={{ display: "block", fontSize: "0.7rem", color: "var(--muted)", letterSpacing: "0.5px" }}>
                ESP32 + SX1276 (868MHz) • Predictive Maintenance & Vibration Analytics
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <button
              onClick={() => setAnomalyActive(!anomalyActive)}
              style={{
                background: anomalyActive ? "rgba(239, 68, 68, 0.2)" : "rgba(255, 255, 255, 0.05)",
                border: `1px solid ${anomalyActive ? "#ef4444" : "var(--line)"}`,
                color: anomalyActive ? "#ef4444" : "var(--foreground)",
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
              <ShieldAlert size={14} /> {anomalyActive ? "Clear Bearing Fault" : "Simulate Bearing Fault"}
            </button>
          </div>
        </div>

        {/* Mesh Map & Node List */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem", padding: "1.75rem" }}>
          
          {/* Left: Node Selector Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--cyan)", letterSpacing: "1px", textTransform: "uppercase" }}>
              ACTIVE MESH NODES ({Object.keys(nodes).length})
            </span>

            {Object.values(nodes).map((n) => {
              const isSelected = selectedNode === n.id;
              return (
                <div
                  key={n.id}
                  onClick={() => setSelectedNode(n.id)}
                  style={{
                    background: isSelected ? "var(--background-soft)" : "rgba(0,0,0,0.2)",
                    border: `1px solid ${isSelected ? "var(--cyan)" : "var(--line)"}`,
                    borderRadius: "0.75rem",
                    padding: "1rem",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.2rem" }}>
                      <Radio size={14} color={isSelected ? "var(--cyan)" : "var(--muted)"} />
                      <strong style={{ fontSize: "0.85rem", color: "var(--foreground)" }}>{n.name}</strong>
                    </div>
                    <span style={{ fontSize: "0.7rem", color: "var(--muted)", display: "block" }}>{n.location}</span>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <span style={{
                      fontSize: "0.65rem",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      background: n.status === "critical" ? "rgba(239, 68, 68, 0.2)" : "rgba(173, 255, 106, 0.15)",
                      color: n.status === "critical" ? "#ef4444" : "var(--lime)",
                      display: "inline-block",
                      marginBottom: "0.2rem"
                    }}>
                      {n.status.toUpperCase()}
                    </span>
                    <span style={{ fontSize: "0.7rem", color: "var(--muted)", display: "block" }}>
                      RSSI: {n.rssi} dBm
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Selected Node Telemetry & FFT Vibration Analysis */}
          <div style={{
            background: "rgba(0,0,0,0.3)",
            border: "1px solid var(--line)",
            borderRadius: "0.75rem",
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div>
                <span style={{ fontSize: "0.7rem", color: "var(--muted)", textTransform: "uppercase" }}>SELECTED NODE</span>
                <h3 style={{ fontSize: "1.1rem", color: "var(--foreground)", margin: "0.2rem 0" }}>{active.name}</h3>
                <span style={{ fontSize: "0.75rem", color: "var(--cyan)" }}>{active.location}</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: "0.7rem", color: "var(--muted)" }}>Packets Transmitted</span>
                <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--lime)" }}>{packetCount.toLocaleString()}</div>
              </div>
            </div>

            {/* Telemetry Metrics Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.75rem" }}>
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--line)", padding: "0.75rem", borderRadius: "0.5rem" }}>
                <span style={{ fontSize: "0.65rem", color: "var(--muted)", display: "block" }}>VIBRATION RMS</span>
                <span style={{ fontSize: "1.2rem", fontWeight: 700, color: active.vibration > 5 ? "#ef4444" : "var(--foreground)" }}>
                  {active.vibration} mm/s
                </span>
                <span style={{ fontSize: "0.65rem", color: active.vibration > 5 ? "#ef4444" : "var(--lime)", display: "block", marginTop: "2px" }}>
                  {active.vibration > 5 ? "⚠️ Bearing Degradation Alert" : "✓ Within ISO 10816-3 limits"}
                </span>
              </div>

              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--line)", padding: "0.75rem", borderRadius: "0.5rem" }}>
                <span style={{ fontSize: "0.65rem", color: "var(--muted)", display: "block" }}>HOUSING TEMP</span>
                <span style={{ fontSize: "1.2rem", fontWeight: 700, color: active.temp > 70 ? "#ef4444" : "var(--foreground)" }}>
                  {active.temp} °C
                </span>
                <span style={{ fontSize: "0.65rem", color: "var(--muted)", display: "block", marginTop: "2px" }}>
                  Limit: 75.0 °C
                </span>
              </div>

              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--line)", padding: "0.75rem", borderRadius: "0.5rem" }}>
                <span style={{ fontSize: "0.65rem", color: "var(--muted)", display: "block" }}>LORA LINK QUALITY</span>
                <span style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--cyan)" }}>
                  {active.rssi} dBm
                </span>
                <span style={{ fontSize: "0.65rem", color: "var(--muted)", display: "block" }}>
                  SNR: +{active.snr} dB
                </span>
              </div>

              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--line)", padding: "0.75rem", borderRadius: "0.5rem" }}>
                <span style={{ fontSize: "0.65rem", color: "var(--muted)", display: "block" }}>PREDICTIVE DOWNTIME</span>
                <span style={{ fontSize: "1.1rem", fontWeight: 600, color: active.status === "critical" ? "#ef4444" : "var(--lime)" }}>
                  {active.status === "critical" ? "Intervention: 4h" : "Safe > 3000h"}
                </span>
                <span style={{ fontSize: "0.65rem", color: "var(--muted)", display: "block" }}>
                  Python ML Model
                </span>
              </div>
            </div>

            <div style={{
              background: "rgba(255, 184, 77, 0.05)",
              border: "1px solid rgba(255, 184, 77, 0.2)",
              borderRadius: "0.5rem",
              padding: "0.75rem",
              fontSize: "0.75rem",
              color: "var(--muted)"
            }}>
              <strong style={{ color: "var(--amber)", display: "block", marginBottom: "0.2rem" }}>Industrial ROI</strong>
              Saved $50k+ in unplanned plant shutdowns by continuously transmitting LoRa telemetry over 2.4km in heavy metallic factory interference.
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
