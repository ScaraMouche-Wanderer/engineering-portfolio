"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

const NODES_DATA = [
  { id: 1, name: "Node 01: Slurry Pump 4A", rssi: -68, snr: 9.4, vib: 1.8, temp: 48.2, status: "NOMINAL", color: "lime" },
  { id: 2, name: "Node 02: SO₂ Gas Blower", rssi: -79, snr: 7.1, vib: 4.6, temp: 72.8, status: "ELEVATED", color: "amber" },
  { id: 3, name: "Node 03: Primary Kiln Mill", rssi: -84, snr: 5.2, vib: 7.9, temp: 94.1, status: "ALERT: ISO-VIB", color: "red" }
];

export default function LoRaMiniConsole() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const activeNode = NODES_DATA[selectedIdx];
  const router = useRouter();

  return (
    <div 
      className="flex flex-col justify-between h-full font-mono select-none"
      onClick={(e) => e.stopPropagation()}
    >
      <div>
        <div className="flex justify-between items-center pb-2 border-b border-white/10">
          <span className="text-[11px] text-[var(--cyan)] font-bold tracking-wider">LORA_868MHZ_MESH</span>
          <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
            activeNode.color === "lime" ? "bg-lime-500/10 text-lime-400 border border-lime-500/30" :
            activeNode.color === "amber" ? "bg-amber-500/10 text-amber-400 border border-amber-500/30" :
            "bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse"
          }`}>
            {activeNode.status}
          </span>
        </div>

        {/* Node Tabs */}
        <div className="flex gap-1 my-2">
          {NODES_DATA.map((node, idx) => (
            <button
              key={node.id}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIdx(idx);
              }}
              className={`flex-1 py-1 px-1.5 rounded text-[10px] font-bold border transition-all cursor-pointer ${
                selectedIdx === idx
                  ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/40"
                  : "bg-white/5 text-white/50 border-white/10 hover:text-white"
              }`}
            >
              Node 0{node.id}
            </button>
          ))}
        </div>

        {/* Node Telemetry Box */}
        <div className="bg-white/5 p-2.5 rounded border border-white/10 mb-2">
          <div className="text-[11px] text-white font-bold mb-1.5 flex justify-between">
            <span>{activeNode.name}</span>
            <span className="text-cyan-400 font-normal">RSSI: {activeNode.rssi} dBm</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div className="bg-black/30 p-1.5 rounded">
              <span className="text-white/40 block">VIBRATION (RMS)</span>
              <span className={`font-bold text-xs ${activeNode.vib > 5 ? "text-red-400" : activeNode.vib > 3 ? "text-amber-400" : "text-lime-400"}`}>
                {activeNode.vib} mm/s
              </span>
            </div>
            <div className="bg-black/30 p-1.5 rounded">
              <span className="text-white/40 block">BEARING TEMP</span>
              <span className="font-bold text-xs text-white">{activeNode.temp}°C</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-2.5 border-t border-white/10 flex justify-between items-center text-[10px]">
        <span className="text-white/40">SX1276 LoRa &bull; 2.4km Link</span>
        <button
          onClick={() => router.push('/project/proj-3')}
          className="text-[var(--cyan)] hover:underline font-bold flex items-center gap-1 cursor-pointer"
        >
          Open Mesh Telemetry <ArrowRight size={11} />
        </button>
      </div>
    </div>
  );
}
