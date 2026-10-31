"use client";

import { useState } from "react";
import { Flame, RefreshCw, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HzlMiniConsole() {
  const [temp, setTemp] = useState(918.4);
  const [current, setCurrent] = useState(18.2);
  const [gasPpm, setGasPpm] = useState(432);
  const [isSurge, setIsSurge] = useState(false);
  const router = useRouter();

  const handleInjectSurge = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isSurge) {
      setIsSurge(true);
      setTemp(1068.4);
      setCurrent(19.9);
      setGasPpm(615);
    } else {
      setIsSurge(false);
      setTemp(918.4);
      setCurrent(18.2);
      setGasPpm(432);
    }
  };

  const handleCalibrate = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSurge(false);
    setTemp(910.0);
    setCurrent(18.0);
    setGasPpm(420);
  };

  return (
    <div 
      className="flex flex-col justify-between h-full font-mono select-none"
      onClick={(e) => e.stopPropagation()}
    >
      <div>
        <div className="flex justify-between items-center pb-2.5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5 mr-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <span className="text-xs text-amber-300 font-bold tracking-wider">HZL_SMELTER_ADC_STREAM</span>
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-md font-bold ${
            isSurge ? "bg-red-500/20 text-red-300 border border-red-500/50 animate-pulse" : "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40"
          }`}>
            {isSurge ? "● ALARM: HIGH THERMAL" : "● 4-20mA LOOP: NOMINAL"}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2.5 my-3.5">
          <div className="bg-white/5 p-2.5 rounded-lg border border-white/10 text-center">
            <span className="text-xs text-white/50 font-semibold block mb-0.5">ROASTER TEMP</span>
            <span className={`text-sm font-bold block ${isSurge ? "text-red-400" : "text-amber-400"}`}>
              {temp.toFixed(1)}°C
            </span>
          </div>
          <div className="bg-white/5 p-2.5 rounded-lg border border-white/10 text-center">
            <span className="text-xs text-white/50 font-semibold block mb-0.5">CURRENT LOOP</span>
            <span className="text-sm font-bold text-cyan-400 block">{current.toFixed(1)} mA</span>
          </div>
          <div className="bg-white/5 p-2.5 rounded-lg border border-white/10 text-center">
            <span className="text-xs text-white/50 font-semibold block mb-0.5">FLUE SO₂</span>
            <span className="text-sm font-bold text-emerald-400 block">{gasPpm} ppm</span>
          </div>
        </div>

        {/* Interactive Controls */}
        <div className="flex gap-2.5">
          <button
            onClick={handleInjectSurge}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all border ${
              isSurge 
                ? "bg-red-500/20 text-red-300 border-red-500/50" 
                : "bg-white/10 text-white border-white/20 hover:border-amber-400 hover:text-amber-300"
            }`}
          >
            <Flame size={14} />
            <span>{isSurge ? "Clear Thermal Surge" : "Inject Thermal Surge"}</span>
          </button>
          <button
            onClick={handleCalibrate}
            className="py-2 px-3.5 rounded-lg text-xs font-bold bg-white/10 text-white border border-white/20 hover:border-cyan-400 hover:text-cyan-300 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
          >
            <RefreshCw size={13} />
            <span>Calibrate</span>
          </button>
        </div>
      </div>

      <div className="pt-3 border-t border-white/10 flex justify-between items-center text-xs">
        <span className="text-white/60">Protocol: Modbus-RTU @ 9600 Baud &bull; Smelter Unit</span>
        <button
          onClick={() => router.push('/project/proj-hzl')}
          className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer transition-colors"
        >
          <span>Open SCADA Lab</span>
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}
