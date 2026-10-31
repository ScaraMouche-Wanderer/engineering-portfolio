"use client";

import { useState } from "react";
import { RefreshCw, ArrowRight, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MemoryMiniConsole() {
  const [bytesInjected, setBytesInjected] = useState(8);
  const [canaryIntact, setCanaryIntact] = useState(true);
  const [isExploited, setIsExploited] = useState(false);
  const router = useRouter();

  const handleInject4 = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newBytes = bytesInjected + 4;
    setBytesInjected(newBytes);
    if (newBytes > 12) {
      setCanaryIntact(false);
    }
    if (newBytes >= 16) {
      setIsExploited(true);
    }
  };

  const handleOverflow = (e: React.MouseEvent) => {
    e.stopPropagation();
    setBytesInjected(24);
    setCanaryIntact(false);
    setIsExploited(true);
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setBytesInjected(8);
    setCanaryIntact(true);
    setIsExploited(false);
  };

  return (
    <div 
      className="flex flex-col justify-between h-full font-mono select-none"
      onClick={(e) => e.stopPropagation()}
    >
      <div>
        <div className="flex justify-between items-center pb-2 border-b border-white/10">
          <span className="text-[11px] text-[var(--cyan)] font-bold tracking-wider">STACK_MEMORY_LAYOUT</span>
          <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
            isExploited ? "bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse" :
            !canaryIntact ? "bg-amber-500/10 text-amber-400 border border-amber-500/30" :
            "bg-lime-500/10 text-lime-400 border border-lime-500/30"
          }`}>
            {isExploited ? "EIP HIJACKED (0x41414141)" : !canaryIntact ? "CANARY CORRUPTED" : "STACK: PROTECTED"}
          </span>
        </div>

        {/* Stack Frames Display */}
        <div className="flex flex-col gap-1 my-2 text-[10px]">
          <div className={`p-1.5 rounded flex justify-between items-center border transition-all ${
            bytesInjected >= 16 ? "bg-red-500/20 border-red-500/40 text-red-400 font-bold" : "bg-white/5 border-white/10 text-white/70"
          }`}>
            <span>[0x7FFC08] Return Address (RIP)</span>
            <span>{bytesInjected >= 16 ? "0x41414141 (OVERWRITTEN)" : "0x00401122"}</span>
          </div>
          <div className={`p-1.5 rounded flex justify-between items-center border transition-all ${
            !canaryIntact ? "bg-amber-500/20 border-amber-500/40 text-amber-400 font-bold" : "bg-white/5 border-white/10 text-lime-400"
          }`}>
            <span className="flex items-center gap-1"><Lock size={10} /> [0x7FFC04] Stack Canary</span>
            <span>{!canaryIntact ? "0x41414141 (SMASHED)" : "0xDEADBEEF (VALID)"}</span>
          </div>
          <div className="p-1.5 rounded bg-cyan-500/10 border border-cyan-500/30 flex justify-between items-center text-cyan-400">
            <span>[0x7FFC00] char buffer[8]</span>
            <span>{bytesInjected} Bytes ({bytesInjected > 8 ? "OVERFLOW" : "NOMINAL"})</span>
          </div>
        </div>

        {/* Interactive Controls */}
        <div className="flex gap-1.5">
          <button
            onClick={handleInject4}
            className="flex-1 py-1 px-2 rounded text-[10px] font-semibold bg-white/5 hover:bg-cyan-500/20 text-white/80 hover:text-cyan-400 border border-white/10 hover:border-cyan-500/40 transition-all cursor-pointer"
          >
            +4 Bytes &apos;AAAA&apos;
          </button>
          <button
            onClick={handleOverflow}
            className="flex-1 py-1 px-2 rounded text-[10px] font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 hover:border-red-500/60 transition-all cursor-pointer"
          >
            Smash Stack (24B)
          </button>
          <button
            onClick={handleReset}
            className="py-1 px-2.5 rounded text-[10px] font-semibold bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 transition-all cursor-pointer"
          >
            <RefreshCw size={11} />
          </button>
        </div>
      </div>

      <div className="pt-2.5 border-t border-white/10 flex justify-between items-center text-[10px]">
        <span className="text-white/40">GDB / x86-64 Memory Lab</span>
        <button
          onClick={() => router.push('/project/proj-4')}
          className="text-[var(--cyan)] hover:underline font-bold flex items-center gap-1 cursor-pointer"
        >
          Open Exploit Lab <ArrowRight size={11} />
        </button>
      </div>
    </div>
  );
}
