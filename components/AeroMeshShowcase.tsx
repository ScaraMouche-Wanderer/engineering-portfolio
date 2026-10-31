"use client";

import { useState } from "react";
import { Cpu, Radio, Navigation, Wifi, ArrowRight, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AeroMeshShowcase() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"rtos_telemetry" | "mesh_network" | "pid_loop">("rtos_telemetry");

  return (
    <div className="flex flex-col gap-6 select-none font-sans" onClick={(e) => e.stopPropagation()}>
      {/* Top Meta Bar */}
      <div className="flex flex-wrap justify-between items-center gap-3 p-3.5 bg-black/40 rounded-xl border border-white/10">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="flex items-center gap-2 text-white font-mono text-sm font-bold">
            <Cpu size={18} className="text-cyan-400" />
            <span>Embedded Firmware & Swarm Telemetry &bull; FreeRTOS & STM32</span>
          </span>
          <span className="text-xs px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono font-semibold">
            Bare-Metal C / C++
          </span>
        </div>

        <div className="text-xs font-mono text-slate-300">
          868MHz LoRa Mesh &bull; 1kHz Control Loop
        </div>
      </div>

      {/* Main Engineering Showcase Grid (Split 2-Column on Desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Subsystem Architecture & Verified Capabilities (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-5">
          <div>
            <div className="mb-4">
              <h4 className="text-lg font-bold text-white mb-1.5 flex items-center gap-2">
                <Navigation size={20} className="text-cyan-400" />
                Deterministic Bare-Metal Flight Control & Swarm Mesh Firmware
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed font-normal">
                Hard real-time embedded flight controller firmware executing on STM32 ARM Cortex-M4 microcontrollers, orchestrating peer-to-peer LoRa mesh coordination and deterministic sensor fusion.
              </p>
            </div>

            {/* Architecture Subsystem Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <Cpu size={15} className="text-cyan-400" />
                  <span className="text-xs font-bold font-mono text-white">1kHz Deterministic RTOS</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed m-0">
                  Strict priority-preemptive FreeRTOS scheduler guaranteeing zero task starvation across IMU sampling, attitude PID, and motor PWM.
                </p>
              </div>

              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <Navigation size={15} className="text-emerald-400" />
                  <span className="text-xs font-bold font-mono text-white">Kalman Sensor Fusion</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed m-0">
                  Extended Kalman Filter combining 6-DOF gyro/accel with barometric altitude to eliminate motor vibration drift.
                </p>
              </div>

              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <Radio size={15} className="text-purple-400" />
                  <span className="text-xs font-bold font-mono text-white">LoRa Decentralized Mesh</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed m-0">
                  Peer-to-peer ad-hoc 868MHz mesh network transmitting heartbeat positions and collision vectors across decentralized nodes.
                </p>
              </div>

              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <Wifi size={15} className="text-amber-400" />
                  <span className="text-xs font-bold font-mono text-white">Failsafe Return-to-Home</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed m-0">
                  Autonomous emergency state machine triggering deterministic altitude hold and GPS waypoint return upon RF link loss.
                </p>
              </div>
            </div>
          </div>

          {/* Key Verified Benchmarks */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
            <span className="text-xs px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold flex items-center gap-1.5">
              <CheckCircle2 size={13} /> 1000Hz Deterministic Loop Time
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold flex items-center gap-1.5">
              <CheckCircle2 size={13} /> Sub-2ms Jitter Guarantee
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 font-semibold flex items-center gap-1.5">
              <CheckCircle2 size={13} /> Multi-Agent Swarm Sync
            </span>
          </div>
        </div>

        {/* Right Column: Ground Station Telemetry Viewport (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col bg-black/75 rounded-xl border border-white/15 overflow-hidden shadow-2xl">
          {/* GCS Header */}
          <div className="bg-slate-900 px-4 py-2.5 border-b border-white/10 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/90" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/90" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/90" />
              </div>
              <span className="text-xs font-mono text-slate-300 font-bold ml-1">
                AEROMESH_GCS &bull; Telemetry Radar
              </span>
            </div>

            {/* View Tabs */}
            <div className="flex gap-1">
              {(["rtos_telemetry", "mesh_network", "pid_loop"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-xs px-2 py-0.5 rounded font-mono uppercase transition-colors cursor-pointer ${
                    activeTab === tab ? "bg-cyan-500/30 text-cyan-300 font-bold" : "text-slate-300 hover:text-white"
                  }`}
                >
                  {tab === "rtos_telemetry" ? "Flight" : tab === "mesh_network" ? "Mesh" : "PID"}
                </button>
              ))}
            </div>
          </div>

          {/* Terminal / Code Content Body */}
          <div className="p-4 font-mono text-xs leading-relaxed overflow-x-auto min-h-[260px] text-slate-200 flex-1">
            {activeTab === "rtos_telemetry" && (
              <div className="space-y-2.5">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-white/5 p-2.5 rounded-lg border border-white/10">
                    <span className="text-xs text-slate-300 font-bold block mb-1">ROLL / PITCH</span>
                    <span className="text-sm font-bold text-cyan-300">+0.8° / -0.2°</span>
                  </div>
                  <div className="bg-white/5 p-2.5 rounded-lg border border-white/10">
                    <span className="text-xs text-slate-300 font-bold block mb-1">ALTITUDE</span>
                    <span className="text-sm font-bold text-emerald-300">24.5 m</span>
                  </div>
                  <div className="bg-white/5 p-2.5 rounded-lg border border-white/10">
                    <span className="text-xs text-slate-300 font-bold block mb-1">BATTERY</span>
                    <span className="text-sm font-bold text-amber-300">15.8V (4S)</span>
                  </div>
                </div>
                <div className="text-xs text-slate-200 space-y-1.5 mt-3">
                  <p className="m-0 text-slate-300">[RTOS] Task_Attitude_Loop: 1000Hz (Execution: 240us)</p>
                  <p className="m-0 text-emerald-400 font-semibold">[KALMAN] Covariance matrix P nominal &bull; Jitter: &lt;1.2us</p>
                  <p className="m-0 text-cyan-300 font-semibold">[SWARM] 4 Nodes In Formation &bull; Mesh RSSI: -68 dBm</p>
                </div>
              </div>
            )}

            {activeTab === "mesh_network" && (
              <div className="space-y-2 text-xs text-slate-200">
                <p className="text-purple-400 font-bold m-0 text-sm"># Peer-to-Peer 868MHz LoRa Mesh Routing</p>
                <p className="m-0 text-cyan-300 font-semibold">NODE_01 (LEADER): pos=[142.5, 88.2, 25.0] &bull; ONLINE</p>
                <p className="m-0 text-slate-200">NODE_02 (WING_L): offset=[-5.0, -5.0, 0.0] &bull; LOCKED</p>
                <p className="m-0 text-slate-200">NODE_03 (WING_R): offset=[+5.0, -5.0, 0.0] &bull; LOCKED</p>
                <p className="m-0 text-emerald-400 font-bold">PACKET_LOSS: 0.02% &bull; Range: 2.4 km</p>
              </div>
            )}

            {activeTab === "pid_loop" && (
              <div className="space-y-1.5 text-xs text-slate-200">
                <p className="text-slate-300 m-0 font-bold">{"/* Quaternion PID Update */"}</p>
                <p className="text-cyan-300 m-0 font-semibold">Kp_roll = 1.45, Ki_roll = 0.04, Kd_roll = 0.022</p>
                <p className="text-cyan-300 m-0 font-semibold">Kp_pitch = 1.45, Ki_pitch = 0.04, Kd_pitch = 0.022</p>
                <p className="text-emerald-400 font-bold m-0">MOTOR_OUTPUTS: [M1: 58%] [M2: 58%] [M3: 59%] [M4: 59%]</p>
              </div>
            )}
          </div>

          {/* Bottom Telemetry Strip */}
          <div className="bg-slate-950 px-4 py-2 border-t border-white/10 flex justify-between items-center text-xs text-slate-300 font-mono">
            <span>FreeRTOS &bull; STM32F405 &bull; C / C++</span>
            <span className="text-cyan-400 font-semibold">● Armed & Stable</span>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="flex flex-wrap gap-3 pt-2 items-center justify-between">
        <button
          onClick={() => router.push('/project/proj-rtos-swarm')}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/50 font-bold text-sm cursor-pointer transition-all shadow-[0_0_15px_rgba(111,255,233,0.18)]"
        >
          <span>Launch Flight Firmware Architecture Deep Dive</span>
          <ArrowRight size={15} />
        </button>

        <span className="text-xs text-slate-400 font-mono">
          Custom Hardware & Embedded Firmware Stack
        </span>
      </div>
    </div>
  );
}
