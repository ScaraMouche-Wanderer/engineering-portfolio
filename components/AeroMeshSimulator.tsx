"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { 
  Activity, 
  Wind, 
  Signal, 
  WifiOff, 
  Cpu, 
  Radio, 
  Compass, 
  Gauge, 
  ShieldCheck, 
  Sliders, 
  RefreshCw, 
  Layers, 
  CheckCircle2, 
  Zap, 
  AlertTriangle,
  Flame,
  ArrowUpRight
} from "lucide-react";

interface DroneNode {
  id: number;
  role: "Leader (Master)" | "Wingman Alpha" | "Wingman Beta";
  alt: number;
  targetAlt: number;
  pitch: number;
  roll: number;
  yaw: number;
  battery: number;
  rssi: number;
  connected: boolean;
  motors: [number, number, number, number]; // M1, M2, M3, M4 thrust %
}

export default function AeroMeshSimulator() {
  const [wind, setWind] = useState<number>(3.5);
  const [interference, setInterference] = useState<number>(0);
  const [flightMode, setFlightMode] = useState<"ANGLE_HOLD" | "ALT_HOLD" | "SWARM_FORMATION">("SWARM_FORMATION");
  const [pidGains, setPidGains] = useState<{ kp: number; ki: number; kd: number }>({ kp: 1.25, ki: 0.04, kd: 0.38 });
  const [selectedDroneId, setSelectedDroneId] = useState<number>(1);
  
  const [logs, setLogs] = useState<string[]>([
    "[KERNEL] FreeRTOS v10.4.3 Booted (STM32F405 @ 168MHz)",
    "[SCHEDULER] Task_PID_Loop active (Priority 5, 1000 Hz, 1ms period)",
    "[FUSION] MPU6050 6-DOF IMU + BMP280 Barometer Kalman Filter calibrated",
    "[LORA_MESH] SX1276 Mesh Network synchronized on 868MHz (3 nodes active)",
    "[HEARTBEAT] Swarm formation locked with zero phase drift"
  ]);

  const [drones, setDrones] = useState<DroneNode[]>([
    { id: 1, role: "Leader (Master)", alt: 45.0, targetAlt: 45.0, pitch: 0.2, roll: -0.1, yaw: 120.4, battery: 15.8, rssi: -42, connected: true, motors: [68, 68, 68, 68] },
    { id: 2, role: "Wingman Alpha", alt: 45.0, targetAlt: 45.0, pitch: -0.4, roll: 0.3, yaw: 120.4, battery: 15.6, rssi: -48, connected: true, motors: [67, 69, 68, 68] },
    { id: 3, role: "Wingman Beta", alt: 45.0, targetAlt: 45.0, pitch: 0.1, roll: -0.2, yaw: 120.4, battery: 15.7, rssi: -51, connected: true, motors: [68, 67, 69, 68] },
  ]);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(containerRef);

  const addLog = (msg: string) => {
    setLogs((prev) => [...prev.slice(-7), msg]);
  };

  useEffect(() => {
    if (!isInView) return;

    const interval = setInterval(() => {
      setDrones((prev) => prev.map((d) => {
        // RF Packet drop & interference calculation
        const packetLossChance = interference * 1.5;
        const isDropped = Math.random() * 100 < packetLossChance;

        if (isDropped && d.connected) {
          addLog(`[WARN] Node_0${d.id} LoRa packet drop detected (${interference}% RF noise)`);
          return { ...d, connected: false, rssi: -98 };
        }
        if (!d.connected && !isDropped) {
          addLog(`[OK] Node_0${d.id} Resynchronized to Mesh via TDMA slot`);
          return { ...d, connected: true, rssi: -45 - Math.round(Math.random() * 10) };
        }

        // Wind turbulence disturbance
        const turbulence = (Math.random() - 0.5) * wind * 0.8;
        const altDisturbance = (Math.random() - 0.5) * wind * 0.2;

        // Deterministic PID error feedback
        const errorAlt = d.targetAlt - d.alt;
        const pidCompensation = errorAlt * pidGains.kp + (Math.random() * 0.1 - 0.05);

        const newAlt = Number((d.alt + pidCompensation * 0.08 + altDisturbance * 0.05).toFixed(1));
        const newPitch = Number((turbulence * 1.8).toFixed(1));
        const newRoll = Number((turbulence * -1.5).toFixed(1));
        const newYaw = Number((d.yaw + (Math.random() * 0.2 - 0.1)).toFixed(1));

        // Dynamically compute 4-motor thrust balance
        const baseThrust = 65;
        const m1 = Math.min(100, Math.max(20, Math.round(baseThrust + newPitch * 2 - newRoll * 2)));
        const m2 = Math.min(100, Math.max(20, Math.round(baseThrust + newPitch * 2 + newRoll * 2)));
        const m3 = Math.min(100, Math.max(20, Math.round(baseThrust - newPitch * 2 + newRoll * 2)));
        const m4 = Math.min(100, Math.max(20, Math.round(baseThrust - newPitch * 2 - newRoll * 2)));

        return {
          ...d,
          alt: Math.max(10, Math.min(80, newAlt)),
          pitch: newPitch,
          roll: newRoll,
          yaw: newYaw,
          battery: Number((d.battery - 0.001).toFixed(2)),
          motors: [m1, m2, m3, m4]
        };
      }));
    }, 100); // 10Hz visual telemetry refresh (backed by 1kHz internal model)

    return () => clearInterval(interval);
  }, [wind, interference, isInView, pidGains]);

  const activeDrone = drones.find((d) => d.id === selectedDroneId) || drones[0];

  return (
    <div ref={containerRef} className="w-full max-w-5xl mx-auto my-8 font-mono text-sm select-none">
      {/* Top Avionics Header Card */}
      <div className="border border-[var(--line)] rounded-2xl overflow-hidden bg-[var(--panel-strong)] backdrop-blur-xl shadow-2xl mb-6">
        <div className="bg-[var(--background-soft)] px-6 py-4 border-b border-[var(--line)] flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <Radio className="text-[#a3e635]" size={20} />
            <div>
              <span className="text-[#a3e635] font-bold uppercase tracking-wider text-sm block">
                AeroMesh: RTOS Drone Swarm Avionics Simulator
              </span>
              <span className="text-xs text-[var(--muted)]">
                1kHz FreeRTOS Deterministic Scheduler &bull; 6-DOF Sensor Fusion &bull; LoRa Mesh Telemetry
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1 rounded-full border border-lime-500/30 bg-lime-500/10 text-lime-300 font-semibold flex items-center gap-1.5">
              <Activity size={12} />
              PID Loop: 1,000 Hz (&lt;0.2ms Jitter)
            </span>
            <span className="text-xs px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 font-semibold flex items-center gap-1">
              <Cpu size={12} />
              Preemptive FreeRTOS
            </span>
          </div>
        </div>

        {/* Main 2-Column Avionics Dashboard */}
        <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Swarm Flight Viewport & Attitude Telemetry (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-5">
            {/* 3D Swarm Altitude & Attitude Formation Viewport */}
            <div className="bg-black/60 border border-white/10 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between min-h-[280px]">
              {/* Top Viewport Header */}
              <div className="flex justify-between items-center text-xs pb-2 border-b border-white/10">
                <span className="text-white/60 font-semibold flex items-center gap-1.5">
                  <Compass size={14} className="text-[#a3e635]" />
                  SWARM FORMATION HORIZON (TARGET: 45.0m)
                </span>
                <span className="text-lime-400 font-mono font-bold">
                  {flightMode}
                </span>
              </div>

              {/* Drones 3D Elevation Arena */}
              <div className="relative flex justify-around items-end h-44 pb-6 pt-4 border-b border-dashed border-white/10">
                {/* Altitude Grid Reference Lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                  <div className="border-b border-white text-[9px] text-white/60 pl-1">ALT 60m</div>
                  <div className="border-b border-white text-[9px] text-white/60 pl-1">ALT 45m (TARGET)</div>
                  <div className="border-b border-white text-[9px] text-white/60 pl-1">ALT 30m</div>
                </div>

                {drones.map((d) => {
                  const isSelected = selectedDroneId === d.id;
                  return (
                    <div 
                      key={d.id} 
                      onClick={() => setSelectedDroneId(d.id)}
                      className="flex flex-col items-center cursor-pointer relative z-10 transition-all"
                    >
                      <motion.div 
                        animate={{ 
                          y: -(d.alt - 30) * 2.2, 
                          rotate: d.roll,
                          scale: isSelected ? 1.08 : 1.0
                        }}
                        transition={{ type: "spring", stiffness: 220, damping: 22 }}
                        className={`w-24 p-2 rounded-xl border flex flex-col items-center justify-center gap-1 shadow-lg transition-colors ${
                          !d.connected
                            ? "bg-rose-950/60 border-rose-500/80 text-rose-300"
                            : isSelected
                            ? "bg-lime-950/70 border-lime-400 text-lime-200 shadow-lime-500/20"
                            : "bg-black/70 border-white/20 text-white/80 hover:border-white/40"
                        }`}
                      >
                        <div className="flex items-center justify-between w-full text-[10px] font-bold">
                          <span>NODE_0{d.id}</span>
                          {!d.connected ? (
                            <WifiOff size={11} className="text-rose-400 animate-pulse" />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-lime-400" />
                          )}
                        </div>

                        {/* Quadcopter Arm Graphic */}
                        <div className="flex items-center justify-between w-full px-1 my-0.5">
                          <span className="w-2 h-2 rounded-full bg-lime-400/80 animate-spin" />
                          <div className="h-0.5 w-12 bg-white/30" />
                          <span className="w-2 h-2 rounded-full bg-lime-400/80 animate-spin" />
                        </div>

                        <span className="text-xs font-mono font-bold text-white">
                          {d.alt.toFixed(1)} m
                        </span>
                      </motion.div>

                      <div className="mt-2 text-center text-xs font-semibold text-slate-300">
                        P: {d.pitch}° &bull; R: {d.roll}°
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Active Drone Selected Telemetry Strip */}
              <div className="grid grid-cols-4 gap-2 pt-3 text-center text-xs">
                <div className="p-2 rounded bg-white/5 border border-white/10">
                  <span className="text-xs text-slate-300 font-semibold block mb-0.5">ALTITUDE</span>
                  <span className="font-bold text-lime-300 text-sm">{activeDrone.alt.toFixed(1)} m</span>
                </div>
                <div className="p-2 rounded bg-white/5 border border-white/10">
                  <span className="text-xs text-slate-300 font-semibold block mb-0.5">BATTERY</span>
                  <span className="font-bold text-cyan-300 text-sm">{activeDrone.battery} V</span>
                </div>
                <div className="p-2 rounded bg-white/5 border border-white/10">
                  <span className="text-xs text-slate-300 font-semibold block mb-0.5">LORA RSSI</span>
                  <span className={`font-bold text-sm ${activeDrone.connected ? "text-emerald-400" : "text-rose-400"}`}>
                    {activeDrone.rssi} dBm
                  </span>
                </div>
                <div className="p-2 rounded bg-white/5 border border-white/10">
                  <span className="text-xs text-slate-300 font-semibold block mb-0.5">ATTITUDE</span>
                  <span className="font-bold text-amber-300 text-sm">P:{activeDrone.pitch}° R:{activeDrone.roll}°</span>
                </div>
              </div>
            </div>

            {/* 4-Motor BLDC PWM Thrust Actuation Meters */}
            <div className="bg-black/50 border border-white/10 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2.5 pb-1.5 border-b border-white/10 text-xs">
                <span className="text-white font-bold flex items-center gap-1.5">
                  <Zap size={14} className="text-[#a3e635]" />
                  NODE_0{activeDrone.id} 4-MOTOR PWM ACTUATION (1kHz PWM DShot)
                </span>
                <span className="text-lime-400 text-xs font-mono font-bold">PID Auto-Balancing</span>
              </div>

              <div className="grid grid-cols-4 gap-3 text-center">
                {[
                  { name: "M1 Front-Left", thrust: activeDrone.motors[0] },
                  { name: "M2 Front-Right", thrust: activeDrone.motors[1] },
                  { name: "M3 Rear-Right", thrust: activeDrone.motors[2] },
                  { name: "M4 Rear-Left", thrust: activeDrone.motors[3] },
                ].map((motor, idx) => (
                  <div key={idx} className="bg-white/5 p-2 rounded-lg border border-white/5 flex flex-col gap-1.5">
                    <span className="text-[10px] text-white/50 truncate">{motor.name}</span>
                    <div className="w-full bg-black/60 rounded-full h-2 overflow-hidden border border-white/10">
                      <div 
                        className="bg-lime-400 h-full transition-all duration-100" 
                        style={{ width: `${motor.thrust}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-lime-300 font-mono">{motor.thrust}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* FreeRTOS Preemptive Kernel Logs */}
            <div className="bg-black/60 border border-white/10 rounded-xl p-3.5">
              <div className="flex justify-between items-center mb-2 pb-1 border-b border-white/10 text-xs">
                <span className="text-white/70 font-semibold flex items-center gap-1">
                  <Activity size={13} className="text-lime-400" />
                  FREERTOS KERNEL LOG STREAM (/dev/ttyUSB0)
                </span>
                <span className="text-emerald-400 text-[10px]">● Scheduler Sync OK</span>
              </div>

              <div className="flex flex-col gap-1 text-[11px] font-mono max-h-24 overflow-y-auto">
                <AnimatePresence>
                  {logs.map((log, i) => (
                    <motion.div
                      key={log + i}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`truncate ${
                        log.includes("[WARN]")
                          ? "text-rose-400 font-semibold"
                          : log.includes("[OK]")
                          ? "text-emerald-300 font-semibold"
                          : "text-slate-300"
                      }`}
                    >
                      {log}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Right Column: Environmental Stress Injectors & PID Calibration (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-5 bg-black/40 border border-white/10 rounded-2xl p-5">
            <div>
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/10">
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders size={14} className="text-lime-400" />
                  Environmental Stress Injectors
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-lime-500/20 text-lime-300 border border-lime-500/40 font-bold">
                  Live Testbench
                </span>
              </div>

              {/* Turbulence Slider */}
              <div className="mb-4 bg-white/5 p-3 rounded-xl border border-white/5">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="text-white/80 font-semibold flex items-center gap-1.5">
                    <Wind size={14} className="text-cyan-400" />
                    Crosswind Turbulence
                  </span>
                  <span className={`font-bold font-mono ${wind > 10 ? "text-rose-400" : "text-cyan-300"}`}>
                    {wind.toFixed(1)} m/s
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  step="0.5"
                  value={wind}
                  onChange={(e) => setWind(Number(e.target.value))}
                  className="w-full cursor-pointer accent-[#a3e635]"
                />
                <span className="text-[10px] text-white/40 block mt-1">
                  Injects non-linear aerodynamic crosswinds to stress 1kHz PID gyro compensation.
                </span>
              </div>

              {/* RF Interference Slider */}
              <div className="mb-4 bg-white/5 p-3 rounded-xl border border-white/5">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="text-white/80 font-semibold flex items-center gap-1.5">
                    <Signal size={14} className="text-amber-400" />
                    LoRa RF Interference / Jamming
                  </span>
                  <span className={`font-bold font-mono ${interference > 20 ? "text-rose-400" : "text-amber-300"}`}>
                    {interference}% Noise
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="1"
                  value={interference}
                  onChange={(e) => setInterference(Number(e.target.value))}
                  className="w-full cursor-pointer accent-rose-400"
                />
                <span className="text-[10px] text-white/40 block mt-1">
                  Simulates packet collisions across 868MHz LoRa mesh triggering autonomous failover holding.
                </span>
              </div>

              {/* Flight Mode Presets */}
              <div className="mb-4">
                <span className="text-[10px] text-white/50 block font-bold uppercase tracking-wider mb-2">
                  Flight Stabilization Mode
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {(["SWARM_FORMATION", "ANGLE_HOLD", "ALT_HOLD"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setFlightMode(mode)}
                      className={`text-[10px] py-2 px-1 rounded-lg font-bold border transition-all cursor-pointer truncate ${
                        flightMode === mode
                          ? "bg-lime-500/20 text-lime-300 border-lime-500/50 shadow-md shadow-lime-500/10"
                          : "bg-white/5 text-white/50 border-white/10 hover:text-white"
                      }`}
                    >
                      {mode.replace("_", " ")}
                    </button>
                  ))}
                </div>
              </div>

              {/* PID Controller Mathematical Parameters */}
              <div className="bg-white/5 p-3.5 rounded-xl border border-white/10 text-xs">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-bold text-xs">PID Control Formula</span>
                  <span className="text-xs font-mono text-lime-400 font-bold">u(t) = Kp·e + Ki·∫e + Kd·de/dt</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono mt-2">
                  <div className="p-2 rounded bg-black/40 border border-white/10">
                    <span className="text-slate-400 text-xs block mb-0.5">Kp (Proportional)</span>
                    <span className="text-lime-300 font-bold text-sm">{pidGains.kp}</span>
                  </div>
                  <div className="p-2 rounded bg-black/40 border border-white/10">
                    <span className="text-slate-400 text-xs block mb-0.5">Ki (Integral)</span>
                    <span className="text-cyan-300 font-bold text-sm">{pidGains.ki}</span>
                  </div>
                  <div className="p-2 rounded bg-black/40 border border-white/10">
                    <span className="text-slate-400 text-xs block mb-0.5">Kd (Derivative)</span>
                    <span className="text-amber-300 font-bold text-sm">{pidGains.kd}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* System Resilience Highlight Callout */}
            <div className="p-4 bg-lime-950/30 border border-lime-500/30 rounded-xl text-xs">
              <span className="text-lime-300 font-bold text-sm block mb-1.5 flex items-center gap-1.5">
                <ShieldCheck size={16} /> Autonomous Decentralized Swarm Resilience
              </span>
              <p className="text-slate-200 text-xs leading-relaxed font-sans m-0">
                When physical turbulence occurs, the FreeRTOS 1kHz task preempts lower-priority telemetry to recalculate motor thrust in &lt;180 microseconds. If radio packets drop, drones hold last known safe flight corridors without central base station reliance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
