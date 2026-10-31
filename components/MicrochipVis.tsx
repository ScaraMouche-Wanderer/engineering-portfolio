"use client";

import { motion, AnimatePresence, useInView } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { Code, Cpu, Layers, Radio, Network, Hexagon, Server, TerminalSquare, Hash, Database, Cloud, Activity, ArrowUpRight } from "lucide-react";

const HARDWARE_PINS = ["C / C++", "FreeRTOS", "STM32 / ESP32", "Sensors", "IoT Mesh", "Rust"];
const SOFTWARE_PINS = ["React.js", "Node.js", "Linux Kernel", "Python", "WebAssembly", "Cloud API"];

const PIN_PROJECT_MAP: Record<string, { id: string; title: string; desc: string; role: string; category: string }> = {
  "C / C++": {
    id: "proj-rtos-swarm",
    title: "AeroMesh Drone Swarm",
    desc: "Deterministic FreeRTOS flight controller running 1kHz PID loops and sub-millisecond task scheduling for autonomous drone swarms.",
    role: "Core Flight Firmware",
    category: "Real-Time Embedded"
  },
  "FreeRTOS": {
    id: "proj-rtos-swarm",
    title: "AeroMesh Drone Swarm",
    desc: "Preemptive priority-based kernel scheduling handling IMU telemetry, Kalman filter sensor fusion, and LoRa mesh packet routing.",
    role: "Real-Time Kernel",
    category: "Real-Time Embedded"
  },
  "STM32 / ESP32": {
    id: "proj-rtos-swarm",
    title: "AeroMesh Drone Swarm",
    desc: "Target MCU architecture running high-speed timer interrupts and DMA-driven sensor communication for multi-agent swarms.",
    role: "Hardware & Microcontroller",
    category: "Real-Time Embedded"
  },
  "Sensors": {
    id: "proj-hzl",
    title: "Real-Time Sensor Monitoring Unit",
    desc: "Industrial-grade 4-20mA current loop ADC unit deployed at Hindustan Zinc Limited smelter complex to monitor high-temperature kilns and gas.",
    role: "Industrial Instrumentation",
    category: "Industrial IoT"
  },
  "IoT Mesh": {
    id: "proj-rtos-swarm",
    title: "AeroMesh Drone Swarm",
    desc: "Decentralized LoRa mesh networking protocol transmitting real-time telemetry packets between aerial nodes.",
    role: "Wireless Protocols",
    category: "Real-Time Embedded"
  },
  "Rust": {
    id: "proj-codewriter",
    title: "CodeWriter",
    desc: "Hardware-level keystroke automation utility emulating physical keyboard input directly through Linux /dev/uinput.",
    role: "Systems Automation",
    category: "Linux Systems"
  },
  "React.js": {
    id: "proj-facegate",
    title: "FaceGate-Linux",
    desc: "Modern reactive user interfaces and system monitors integrated with low-level Linux security daemons.",
    role: "User Interface & State",
    category: "Linux Security"
  },
  "Node.js": {
    id: "proj-codewriter",
    title: "CodeWriter",
    desc: "High-performance systems programming and automation bridging kernel interfaces with user desktop environments.",
    role: "Systems Architecture",
    category: "Linux Systems"
  },
  "Linux Kernel": {
    id: "proj-codewriter",
    title: "CodeWriter",
    desc: "Direct Linux kernel input subsystem interfacing (/dev/uinput) to stream genuine hardware scan codes.",
    role: "Kernel & Drivers",
    category: "Linux Systems"
  },
  "Python": {
    id: "proj-facegate",
    title: "FaceGate-Linux",
    desc: "PySide6 Qt6 desktop interface and InsightFace ONNX biometric daemon with AES-256-GCM RAM key caching.",
    role: "Biometric Security Daemon",
    category: "Linux Security"
  },
  "WebAssembly": {
    id: "proj-facegate",
    title: "FaceGate-Linux",
    desc: "Sub-300ms facial verification engine running local neural inference with zero-cloud data transmission.",
    role: "Local Neural Inference",
    category: "Linux Security"
  },
  "Cloud API": {
    id: "proj-facegate",
    title: "FaceGate-Linux",
    desc: "Local-first architecture designed for maximum privacy, zero external telemetry, and offline audit logging.",
    role: "Zero-Cloud Privacy",
    category: "Linux Security"
  }
};

const PIN_ICON_MAP: Record<string, React.ReactNode> = {
  "C / C++": <Code size={18} color="var(--cyan)" />,
  "FreeRTOS": <Activity size={18} color="var(--cyan)" />,
  "STM32 / ESP32": <Cpu size={18} color="var(--cyan)" />,
  "Sensors": <Radio size={18} color="var(--cyan)" />,
  "IoT Mesh": <Network size={18} color="var(--cyan)" />,
  "Rust": <Layers size={18} color="var(--cyan)" />,
  "React.js": <Hexagon size={18} color="var(--cyan)" />,
  "Node.js": <Server size={18} color="var(--cyan)" />,
  "Linux Kernel": <TerminalSquare size={18} color="var(--cyan)" />,
  "Python": <Hash size={18} color="var(--cyan)" />,
  "WebAssembly": <Database size={18} color="var(--cyan)" />,
  "Cloud API": <Cloud size={18} color="var(--cyan)" />
};

export default function MicrochipVis({ onSelectProject }: { onSelectProject?: (id: string) => void }) {
  const [activePin, setActivePin] = useState<string>("C / C++");
  const [pulse, setPulse] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef);

  useEffect(() => {
    if (!isInView) return;
    const interval = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 900);
    }, 4000);
    return () => clearInterval(interval);
  }, [isInView]);

  const activeProject = PIN_PROJECT_MAP[activePin] || PIN_PROJECT_MAP["C / C++"];

  return (
    <div 
      ref={containerRef} 
      className="w-full max-w-[540px] flex flex-col items-center relative rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-5 md:p-6 shadow-2xl transition-all duration-300"
    >
      {/* Visualizer Top Header */}
      <div className="w-full flex items-center justify-between pb-4 mb-4 border-b border-white/10 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-cyan-400 font-bold tracking-wider uppercase">PN-CORE IC &bull; BUS v2.5</span>
        </div>
        <span className="text-slate-400 text-[11px]">CLICK PIN TO PROBE</span>
      </div>

      {/* Background Ambient Glow */}
      <div 
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 pointer-events-none rounded-full blur-3xl transition-opacity duration-700"
        style={{
          background: pulse ? 'radial-gradient(circle, rgba(88,196,182,0.25) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(88,196,182,0.08) 0%, transparent 70%)',
          zIndex: 0
        }} 
      />

      {/* Main IC Package & Pin Bus Layout */}
      <div className="relative z-10 w-full flex items-center justify-between gap-1 md:gap-2 my-2">
        
        {/* Left Pins (Hardware Side) */}
        <div className="flex flex-col gap-2 flex-1 items-end">
          <div className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase mb-1 pr-2">
            HARDWARE / FIRMWARE
          </div>
          {HARDWARE_PINS.map((pin) => {
            const isSelected = activePin === pin;
            return (
              <button
                key={pin}
                onClick={() => setActivePin(pin)}
                onMouseEnter={() => setActivePin(pin)}
                className="flex items-center justify-end w-full group py-0.5 px-0 border-none bg-transparent cursor-pointer outline-none"
                aria-label={`Select pin ${pin}`}
              >
                <span 
                  className={`font-mono text-xs font-semibold transition-all duration-150 mr-2 text-right ${
                    isSelected 
                      ? 'text-cyan-300 font-bold -translate-x-1 drop-shadow-[0_0_8px_rgba(56,189,248,0.7)]' 
                      : 'text-slate-300 group-hover:text-white'
                  }`}
                >
                  {pin}
                </span>

                {/* Copper Lead Trace */}
                <div 
                  className={`h-[3px] rounded-l-sm transition-all duration-200 ${
                    isSelected 
                      ? 'w-7 bg-cyan-400 shadow-[0_0_10px_rgba(56,189,248,0.9)]' 
                      : 'w-3.5 bg-slate-700 group-hover:bg-slate-500'
                  }`} 
                />
              </button>
            );
          })}
        </div>

        {/* Central Silicon QFP Die Body */}
        <motion.div 
          className="w-36 h-48 md:w-40 md:h-52 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-cyan-500/30 rounded-xl flex flex-col items-center justify-center relative overflow-hidden shrink-0 shadow-2xl mx-1"
          style={{
            boxShadow: pulse 
              ? '0 0 25px rgba(56,189,248,0.35), inset 0 0 15px rgba(56,189,248,0.12)' 
              : '0 10px 30px rgba(0,0,0,0.6)'
          }}
          whileHover={{ scale: 1.02 }}
        >
          {/* Circuit Grid Wireframe Background */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />

          {/* Central Die / Processing Core */}
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-lg border border-cyan-400/50 bg-black/70 flex items-center justify-center shadow-inner relative z-10">
            <div className="w-9 h-9 rounded-md bg-cyan-500/15 border border-cyan-400 flex items-center justify-center shadow-[0_0_12px_rgba(56,189,248,0.5)]">
              {activePin && PIN_ICON_MAP[activePin] ? (
                <motion.div
                  key={activePin}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  {PIN_ICON_MAP[activePin]}
                </motion.div>
              ) : (
                <Cpu size={20} color="var(--cyan)" />
              )}
            </div>
          </div>

          <div className="mt-3 text-center relative z-10">
            <div className="text-white font-mono font-bold tracking-widest text-sm">
              PN-CORE
            </div>
            <div className="text-cyan-400 font-mono text-[10px] font-bold tracking-wider mt-0.5">
              STM32 &bull; RTOS &bull; LINUX
            </div>
          </div>
        </motion.div>

        {/* Right Pins (Software Side) */}
        <div className="flex flex-col gap-2 flex-1 items-start">
          <div className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase mb-1 pl-2">
            SOFTWARE / SYSTEMS
          </div>
          {SOFTWARE_PINS.map((pin) => {
            const isSelected = activePin === pin;
            return (
              <button
                key={pin}
                onClick={() => setActivePin(pin)}
                onMouseEnter={() => setActivePin(pin)}
                className="flex items-center justify-start w-full group py-0.5 px-0 border-none bg-transparent cursor-pointer outline-none"
                aria-label={`Select pin ${pin}`}
              >
                {/* Copper Lead Trace */}
                <div 
                  className={`h-[3px] rounded-r-sm transition-all duration-200 ${
                    isSelected 
                      ? 'w-7 bg-cyan-400 shadow-[0_0_10px_rgba(56,189,248,0.9)]' 
                      : 'w-3.5 bg-slate-700 group-hover:bg-slate-500'
                  }`} 
                />

                <span 
                  className={`font-mono text-xs font-semibold transition-all duration-150 ml-2 text-left ${
                    isSelected 
                      ? 'text-cyan-300 font-bold translate-x-1 drop-shadow-[0_0_8px_rgba(56,189,248,0.7)]' 
                      : 'text-slate-300 group-hover:text-white'
                  }`}
                >
                  {pin}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Docked Subsystem Telemetry Card */}
      <div className="w-full mt-4 pt-3 border-t border-white/10 relative z-10">
        <AnimatePresence mode="wait">
          {activeProject && (
            <motion.div
              key={activeProject.id + activePin}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              onClick={() => {
                if (onSelectProject) onSelectProject(activeProject.id);
              }}
              className="group cursor-pointer p-3.5 rounded-xl bg-cyan-500/5 hover:bg-cyan-500/10 border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-200"
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[11px] font-mono font-bold tracking-wider text-cyan-400 uppercase flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  {activePin} &mdash; {activeProject.role}
                </span>
                <span className="text-xs font-mono text-cyan-400 group-hover:text-white flex items-center gap-1 font-bold">
                  <span>INSPECT</span>
                  <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </div>
              
              <h4 className="text-sm font-bold text-white mb-1 tracking-tight">
                {activeProject.title}
              </h4>
              
              <p className="text-xs text-slate-300 leading-relaxed m-0 line-clamp-2">
                {activeProject.desc}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
