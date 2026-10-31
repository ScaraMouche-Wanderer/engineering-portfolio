"use client";

import { useState } from "react";
import { Activity, Gauge, Flame, Radio, ArrowRight, CheckCircle2, Factory } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HzlShowcase() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"telemetry" | "adc_specs" | "modbus">("telemetry");

  return (
    <div className="flex flex-col gap-6 select-none font-sans" onClick={(e) => e.stopPropagation()}>
      {/* Top Meta Bar */}
      <div className="flex flex-wrap justify-between items-center gap-3 p-3.5 bg-black/40 rounded-xl border border-white/10">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="flex items-center gap-2 text-white font-mono text-sm font-bold">
            <Factory size={18} className="text-amber-400" />
            <span>Industrial IoT & Instrumentation &bull; Hindustan Zinc Limited (Vedanta)</span>
          </span>
          <span className="text-xs px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-semibold">
            Deployed in Production
          </span>
        </div>

        <div className="text-xs font-mono text-slate-300">
          Chanderiya Lead-Zinc Smelter Complex
        </div>
      </div>

      {/* Main Engineering Showcase Grid (Split 2-Column on Desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Subsystem Architecture & Verified Capabilities (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-5">
          <div>
            <div className="mb-4">
              <h4 className="text-lg font-bold text-white mb-1.5 flex items-center gap-2">
                <Gauge size={20} className="text-amber-400" />
                Real-Time High-Temperature Sensor Monitoring Unit
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed font-normal">
                An industrial-grade IoT instrumentation unit engineered for continuous thermal and current loop telemetry across zinc roaster furnaces, replacing dangerous manual inspection routines with real-time Modbus-RTU telemetry.
              </p>
            </div>

            {/* Architecture Subsystem Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <Flame size={15} className="text-amber-400" />
                  <span className="text-xs font-bold font-mono text-white">4-20mA Current Loop ADC</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed m-0">
                  Precision analog front-end with 16-bit ADS1115 ADC monitoring industrial pressure and current transmitters with optical ground isolation.
                </p>
              </div>

              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <Activity size={15} className="text-emerald-400" />
                  <span className="text-xs font-bold font-mono text-white">Thermocouple Linearization</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed m-0">
                  NIST polynomial polynomial linearization for Type-K thermocouple inputs operating in harsh 650°C - 1050°C roaster chambers.
                </p>
              </div>

              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <Radio size={15} className="text-cyan-400" />
                  <span className="text-xs font-bold font-mono text-white">Modbus-RTU Industrial Bus</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed m-0">
                  RS-485 multi-drop fieldbus protocol integration feeding continuous telemetry packets to central DCS PLC controllers.
                </p>
              </div>

              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <Factory size={15} className="text-purple-400" />
                  <span className="text-xs font-bold font-mono text-white">Thermal Surge Interlock</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed m-0">
                  Hardware watchdog and deterministic thermal gradient trip interlocks for immediate boiler pressure venting.
                </p>
              </div>
            </div>
          </div>

          {/* Key Verified Benchmarks */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold flex items-center gap-1.5">
              <CheckCircle2 size={13} /> 40% Reduction in Manual Inspection Rounds
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold flex items-center gap-1.5">
              <CheckCircle2 size={13} /> Real-Time Modbus-RTU Telemetry
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold flex items-center gap-1.5">
              <CheckCircle2 size={13} /> Optical Isolation Protection
            </span>
          </div>
        </div>

        {/* Right Column: Industrial DCS Telemetry Viewport (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col bg-black/75 rounded-xl border border-white/15 overflow-hidden shadow-2xl">
          {/* SCADA Console Header */}
          <div className="bg-slate-900 px-4 py-2.5 border-b border-white/10 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/90" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/90" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/90" />
              </div>
              <span className="text-xs font-mono text-slate-300 font-bold ml-1">
                HZL_ROASTER_UNIT_04 &bull; SCADA Panel
              </span>
            </div>

            {/* View Tabs */}
            <div className="flex gap-1">
              {(["telemetry", "adc_specs", "modbus"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-xs px-2 py-0.5 rounded font-mono uppercase transition-colors cursor-pointer ${
                    activeTab === tab ? "bg-amber-500/30 text-amber-300 font-bold" : "text-slate-300 hover:text-white"
                  }`}
                >
                  {tab === "telemetry" ? "Sensors" : tab === "adc_specs" ? "ADC Cal" : "Modbus"}
                </button>
              ))}
            </div>
          </div>

          {/* Terminal / Code Content Body */}
          <div className="p-4 font-mono text-xs leading-relaxed overflow-x-auto min-h-[260px] text-slate-200 flex-1">
            {activeTab === "telemetry" && (
              <div className="space-y-2.5">
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-white/5 p-2.5 rounded-lg border border-white/10">
                    <span className="text-xs text-slate-300 font-bold block mb-1">KILN CORE TEMP</span>
                    <span className="text-lg font-bold text-amber-400">842.6 °C</span>
                    <span className="text-xs text-emerald-400 font-semibold block mt-1">● Nominal Operating</span>
                  </div>
                  <div className="bg-white/5 p-2.5 rounded-lg border border-white/10">
                    <span className="text-xs text-slate-300 font-bold block mb-1">4-20mA LOOP ADC</span>
                    <span className="text-lg font-bold text-cyan-400">14.82 mA</span>
                    <span className="text-xs text-slate-300 block mt-1">Pressure: 4.2 bar</span>
                  </div>
                </div>
                <div className="text-xs text-slate-200 space-y-1.5 mt-3">
                  <p className="m-0 text-slate-300">[FIELD_BUS] Modbus Slave Address: 0x07 (Baud: 115200)</p>
                  <p className="m-0 text-emerald-400 font-semibold">[STATUS] Cold-Junction Comp: 29.4°C (PT100 RTD)</p>
                  <p className="m-0 text-cyan-300 font-semibold">[POLL] Sample Rate: 100ms &bull; CRC-16 Validated</p>
                </div>
              </div>
            )}

            {activeTab === "adc_specs" && (
              <div className="space-y-2 text-xs text-slate-200">
                <p className="text-amber-400 font-bold m-0 text-sm"># ADC Calibration & Linearization Parameters</p>
                <p className="m-0 text-slate-200">Resolution: 16-bit Sigma-Delta (ADS1115)</p>
                <p className="m-0 text-slate-200">V_REF: 4.096V &bull; Gain: 1x (PGA)</p>
                <p className="m-0 text-slate-200">Linearization Eq: V = c0 + c1*T + c2*T^2 + ... (NIST-9)</p>
                <p className="m-0 text-emerald-400 font-bold">Noise Floor: &lt;0.05% Full-Scale Error</p>
              </div>
            )}

            {activeTab === "modbus" && (
              <div className="space-y-1.5 text-xs text-slate-200">
                <p className="text-slate-300 m-0 font-bold">$ modbus-cli --read --slave 7 --reg 40001-40008</p>
                <p className="text-cyan-300 m-0 font-semibold">REG 40001: 0x20EA [8426 &rarr; 842.6°C]</p>
                <p className="text-cyan-300 m-0 font-semibold">REG 40002: 0x05CA [1482 &rarr; 14.82mA]</p>
                <p className="text-cyan-300 m-0 font-semibold">REG 40003: 0x0001 [STATE: ARMED]</p>
                <p className="text-emerald-400 font-bold m-0">STATUS: 0 ERRORS &bull; 100% PACKET INTEGRITY</p>
              </div>
            )}
          </div>

          {/* Bottom Telemetry Strip */}
          <div className="bg-slate-950 px-4 py-2 border-t border-white/10 flex justify-between items-center text-xs text-slate-300 font-mono">
            <span>RS-485 Modbus-RTU &bull; Embedded C</span>
            <span className="text-emerald-400 font-semibold">● Production Monitored</span>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="flex flex-wrap gap-3 pt-2 items-center justify-between">
        <button
          onClick={() => router.push('/project/proj-hzl')}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 font-bold text-sm cursor-pointer transition-all shadow-[0_0_15px_rgba(245,158,11,0.18)]"
        >
          <span>Launch Industrial Instrumentation Deep Dive</span>
          <ArrowRight size={15} />
        </button>

        <span className="text-xs text-slate-400 font-mono">
          Commissioned at Hindustan Zinc Limited Smelting Complex
        </span>
      </div>
    </div>
  );
}
