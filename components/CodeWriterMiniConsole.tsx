"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, ArrowRight, Zap, Sparkles, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

const SNIPPET = `void stream_keystroke(int uinput_fd, uint16_t code) {
    struct input_event ev = { .type = EV_KEY, .code = code, .value = 1 };
    write(uinput_fd, &ev, sizeof(ev)); // Direct /dev/uinput
}`;

export default function CodeWriterMiniConsole() {
  const [speed, setSpeed] = useState<"fast" | "normal" | "safe">("normal");
  const [humanizer, setHumanizer] = useState<boolean>(true);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [typedChars, setTypedChars] = useState<number>(0);
  const [curWpm, setCurWpm] = useState<number>(145);
  const router = useRouter();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const getDelay = () => {
    const base = speed === "fast" ? 15 : speed === "normal" ? 35 : 70;
    if (humanizer) {
      const jitter = (Math.random() - 0.5) * (base * 0.75);
      return Math.max(8, base + jitter);
    }
    return base;
  };

  useEffect(() => {
    if (isTyping && typedChars < SNIPPET.length) {
      const delay = getDelay();
      timerRef.current = setTimeout(() => {
        setTypedChars((prev) => prev + 1);
        if (humanizer) {
          setCurWpm(Math.floor(130 + (Math.random() * 40 - 20)));
        }
      }, delay);
    } else if (typedChars >= SNIPPET.length) {
      setIsTyping(false);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isTyping, typedChars, speed, humanizer]);

  const handleToggleStream = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typedChars >= SNIPPET.length) {
      setTypedChars(0);
      setIsTyping(true);
    } else {
      setIsTyping(!isTyping);
    }
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsTyping(false);
    setTypedChars(0);
  };

  return (
    <div 
      className="flex flex-col justify-between h-full font-mono select-none"
      onClick={(e) => e.stopPropagation()}
    >
      <div>
        {/* GTK4 Desktop Utility Window Header */}
        <div className="flex justify-between items-center pb-2.5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5 mr-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <span className="text-xs text-white/90 font-bold tracking-wide flex items-center gap-1.5">
              <Zap size={14} className="text-cyan-400" />
              CodeWriter Keystroke Engine (/dev/uinput)
            </span>
          </div>

          <span className={`text-xs px-2.5 py-1 rounded-md font-bold transition-all ${
            isTyping
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 animate-pulse"
              : typedChars >= SNIPPET.length
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50"
              : "bg-white/5 text-white/70 border border-white/15"
          }`}>
            {isTyping ? "● HARDWARE STREAMING..." : typedChars >= SNIPPET.length ? "● INJECTION COMPLETE" : "● READY TO STREAM"}
          </span>
        </div>

        {/* Configuration Bar */}
        <div className="flex justify-between items-center my-3 gap-2 flex-wrap">
          <div className="flex gap-1.5">
            {(["fast", "normal", "safe"] as const).map((s) => (
              <button
                key={s}
                onClick={(e) => {
                  e.stopPropagation();
                  setSpeed(s);
                }}
                className={`text-xs px-2.5 py-1 rounded-md uppercase font-semibold cursor-pointer border transition-all ${
                  speed === s
                    ? "bg-cyan-500/20 border-cyan-400 text-white shadow-sm"
                    : "bg-white/5 border-white/10 text-white/60 hover:text-white"
                }`}
              >
                {s} ({s === "fast" ? "2ms" : s === "normal" ? "8ms" : "20ms"})
              </button>
            ))}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setHumanizer(!humanizer);
            }}
            className={`text-xs px-2.5 py-1 rounded-md font-semibold cursor-pointer border flex items-center gap-1.5 transition-all ${
              humanizer
                ? "bg-amber-500/20 border-amber-400/60 text-amber-300"
                : "bg-white/5 border-white/10 text-white/50"
            }`}
            title="Toggle Gaussian typing cadence jitter"
          >
            <Sparkles size={12} />
            <span>{humanizer ? "Humanizer: ON" : "Humanizer: OFF"}</span>
          </button>
        </div>

        {/* Live Code Stream Canvas */}
        <div className="bg-black/75 p-3 rounded-lg border border-white/15 text-xs leading-relaxed text-cyan-200 min-h-[95px] font-mono overflow-x-auto relative mb-3 shadow-inner">
          <div className="text-xs text-white/50 mb-1.5 border-b border-white/10 pb-1 flex justify-between font-semibold">
            <span>KERNEL_TARGET: /dev/uinput &bull; RAW_EVENT</span>
            <span>{humanizer ? `CADENCE: ~${curWpm} WPM (Gaussian)` : "CADENCE: SYNCHRONOUS"}</span>
          </div>
          <pre className="m-0 font-mono whitespace-pre-wrap text-[13px] leading-relaxed">
            {SNIPPET.slice(0, typedChars)}
            <span className="inline-block w-2 h-4 bg-cyan-400 align-middle ml-0.5 animate-pulse" />
          </pre>
        </div>

        {/* Interactive Controls */}
        <div className="flex gap-2.5">
          <button
            onClick={handleToggleStream}
            className="flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all border bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border-cyan-500/50 shadow-[0_0_12px_rgba(111,255,233,0.2)]"
          >
            {isTyping ? <Pause size={14} /> : <Play size={14} />}
            <span>{isTyping ? "Pause Emulation" : typedChars >= SNIPPET.length ? "Stream Again" : "Start Hardware Keystroke Stream"}</span>
          </button>

          <button
            onClick={handleReset}
            className="py-2 px-3.5 rounded-lg text-xs font-bold bg-white/10 text-white border border-white/20 hover:bg-white/15 flex items-center justify-center gap-1 cursor-pointer transition-all"
            title="Reset typed buffer"
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      <div className="pt-3 border-t border-white/10 flex justify-between items-center text-xs">
        <span className="text-white/60">GTK4 / Libadwaita &bull; 101 Unit Tests (100% Passed)</span>
        <button
          onClick={() => router.push('/project/proj-codewriter')}
          className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 cursor-pointer transition-colors"
        >
          <span>Kernel Lab Deep Dive</span>
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}
