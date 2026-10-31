"use client";

import { useState } from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FlightMiniConsole() {
  const [roll, setRoll] = useState(2.1);
  const [pitch, setPitch] = useState(-1.5);
  const [yaw, setYaw] = useState(142.0);
  const [isKalman, setIsKalman] = useState(true);
  const router = useRouter();

  const handleBankLeft = (e: React.MouseEvent) => {
    e.stopPropagation();
    const noise = isKalman ? 0 : (Math.random() - 0.5) * 3;
    setRoll((prev) => +(prev - 12.5 + noise).toFixed(1));
    setYaw((prev) => +((prev - 8 + 360) % 360).toFixed(1));
  };

  const handleBankRight = (e: React.MouseEvent) => {
    e.stopPropagation();
    const noise = isKalman ? 0 : (Math.random() - 0.5) * 3;
    setRoll((prev) => +(prev + 12.5 + noise).toFixed(1));
    setYaw((prev) => +((prev + 8) % 360).toFixed(1));
  };

  const handlePitchUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const noise = isKalman ? 0 : (Math.random() - 0.5) * 3;
    setPitch((prev) => +(prev + 10.0 + noise).toFixed(1));
  };

  const handleLevel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRoll(0.0);
    setPitch(0.0);
  };

  return (
    <div 
      className="flex flex-col justify-between h-full font-mono select-none"
      onClick={(e) => e.stopPropagation()}
    >
      <div>
        <div className="flex justify-between items-center pb-2.5 border-b border-white/10">
          <span className="text-xs text-[var(--cyan)] font-bold tracking-wider">QUANTUM_V2_PID_LOOP</span>
          <button
            onClick={() => setIsKalman(!isKalman)}
            className={`text-xs px-2.5 py-1 rounded-md font-bold border transition-colors cursor-pointer ${
              isKalman 
                ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/25" 
                : "bg-amber-500/15 text-amber-300 border-amber-500/40 hover:bg-amber-500/25"
            }`}
          >
            {isKalman ? "● KALMAN: ON (1000Hz)" : "● RAW IMU NOISY"}
          </button>
        </div>

        {/* Attitude Telemetry Badges */}
        <div className="grid grid-cols-3 gap-2.5 my-3 text-center">
          <div className="bg-white/5 p-2.5 rounded-lg border border-white/10">
            <span className="text-xs text-white/50 block font-semibold mb-0.5">ROLL (DEG)</span>
            <span className={`text-sm font-bold block ${roll > 0 ? "text-cyan-400" : roll < 0 ? "text-amber-400" : "text-white"}`}>
              {roll > 0 ? `+${roll}` : roll}°
            </span>
          </div>
          <div className="bg-white/5 p-2.5 rounded-lg border border-white/10">
            <span className="text-xs text-white/50 block font-semibold mb-0.5">PITCH (DEG)</span>
            <span className={`text-sm font-bold block ${pitch > 0 ? "text-emerald-400" : pitch < 0 ? "text-amber-400" : "text-white"}`}>
              {pitch > 0 ? `+${pitch}` : pitch}°
            </span>
          </div>
          <div className="bg-white/5 p-2.5 rounded-lg border border-white/10">
            <span className="text-xs text-white/50 block font-semibold mb-0.5">YAW (DEG)</span>
            <span className="text-sm font-bold text-white block">{yaw}°</span>
          </div>
        </div>

        {/* Interactive Controls */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={handleBankLeft}
            className="flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-cyan-500/20 text-white hover:text-cyan-300 border border-white/10 hover:border-cyan-500/40 transition-all cursor-pointer text-center"
          >
            ← Bank Left
          </button>
          <button
            onClick={handlePitchUp}
            className="flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-emerald-500/20 text-white hover:text-emerald-300 border border-white/10 hover:border-emerald-500/40 transition-all cursor-pointer text-center"
          >
            ↑ Pitch Up
          </button>
          <button
            onClick={handleBankRight}
            className="flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-cyan-500/20 text-white hover:text-cyan-300 border border-white/10 hover:border-cyan-500/40 transition-all cursor-pointer text-center"
          >
            Bank Right →
          </button>
          <button
            onClick={handleLevel}
            className="py-1.5 px-3 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer"
          >
            Level
          </button>
        </div>
      </div>

      <div className="pt-3 border-t border-white/10 flex justify-between items-center text-[10px]">
        <div className="flex items-center gap-1.5">
          <ShieldCheck size={12} className="text-lime-400" />
          <span className="text-white/40">DShot-600 PWM: Active</span>
        </div>
        <button
          onClick={() => router.push('/project/proj-1')}
          className="text-[var(--cyan)] hover:underline font-bold flex items-center gap-1 cursor-pointer"
        >
          Open 1kHz Scope <ArrowRight size={11} />
        </button>
      </div>
    </div>
  );
}
