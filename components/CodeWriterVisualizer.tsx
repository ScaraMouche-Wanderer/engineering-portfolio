"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, 
  Terminal, 
  Cpu, 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  Sliders, 
  FileCode, 
  Clock, 
  Keyboard,
  ShieldCheck,
  Code
} from "lucide-react";

const CODE_TEMPLATES = {
  python: `def compute_sha256(payload: bytes) -> str:
    """Computes SHA-256 digest via hashlib."""
    import hashlib
    hasher = hashlib.sha256()
    hasher.update(payload)
    return hasher.hexdigest()`,
  cpp: `template <typename T>
class RingBuffer {
private:
    std::vector<T> buffer;
    size_t head = 0, tail = 0;
public:
    explicit RingBuffer(size_t cap) : buffer(cap) {}
    void push(T val) { buffer[head++ % buffer.size()] = val; }
};`,
  rust: `pub fn process_uinput_stream(fd: RawFd, code: u16) -> Result<(), std::io::Error> {
    let ev = input_event { type_: EV_KEY, code, value: 1 };
    unsafe { write(fd, &ev as *const _ as *const c_void, size_of::<input_event>()) };
    Ok(())
}`,
  markdown_ai: `\`\`\`python
# AI Stripped Python Payload
def calculate_metrics(values):
    return sum(values) / len(values) if values else 0.0
\`\`\``
};

export default function CodeWriterVisualizer() {
  const [selectedLang, setSelectedLang] = useState<keyof typeof CODE_TEMPLATES>("python");
  const [activeText, setActiveText] = useState<string>(CODE_TEMPLATES.python);
  const [speed, setSpeed] = useState<"fast" | "normal" | "safe">("normal");
  const [humanizer, setHumanizer] = useState<boolean>(true);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [typedIndex, setTypedIndex] = useState<number>(0);
  const [wpm, setWpm] = useState<number>(142);
  const [lastEvent, setLastEvent] = useState<{ code: string; type: string; val: number }>({
    code: "KEY_NONE",
    type: "EV_KEY",
    val: 0
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const getDelay = () => {
    const base = speed === "fast" ? 12 : speed === "normal" ? 28 : 60;
    if (humanizer) {
      const jitter = (Math.random() - 0.5) * (base * 0.8);
      return Math.max(6, base + jitter);
    }
    return base;
  };

  useEffect(() => {
    if (isStreaming && typedIndex < activeText.length) {
      const char = activeText[typedIndex];
      const charCodeName = char === " " ? "KEY_SPACE" : char === "\n" ? "KEY_ENTER" : `KEY_${char.toUpperCase()}`;
      
      const delay = getDelay();
      timerRef.current = setTimeout(() => {
        setTypedIndex((prev) => prev + 1);
        setLastEvent({
          code: charCodeName.slice(0, 12),
          type: "EV_KEY",
          val: 1
        });
        if (humanizer) {
          setWpm(Math.floor(135 + (Math.random() * 30 - 15)));
        }
      }, delay);
    } else if (typedIndex >= activeText.length) {
      setIsStreaming(false);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isStreaming, typedIndex, activeText, speed, humanizer]);

  const handleSelectLang = (lang: keyof typeof CODE_TEMPLATES) => {
    setIsStreaming(false);
    setTypedIndex(0);
    setSelectedLang(lang);
    setActiveText(CODE_TEMPLATES[lang]);
  };

  const handleStripMarkdown = () => {
    const cleaned = activeText
      .replace(/^```[a-zA-Z]*\n?/gm, "")
      .replace(/```$/gm, "")
      .trim();
    setActiveText(cleaned);
    setTypedIndex(0);
    setIsStreaming(false);
  };

  const handleToggleStream = () => {
    if (typedIndex >= activeText.length) {
      setTypedIndex(0);
      setIsStreaming(true);
    } else {
      setIsStreaming(!isStreaming);
    }
  };

  const handleReset = () => {
    setIsStreaming(false);
    setTypedIndex(0);
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-8 font-mono text-sm">
      {/* Top Header Card */}
      <div className="border border-[var(--line)] rounded-2xl overflow-hidden bg-[var(--panel-strong)] backdrop-blur-xl shadow-2xl mb-6">
        <div className="bg-[var(--background-soft)] px-6 py-4 border-b border-[var(--line)] flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <Zap className="text-[var(--cyan)]" size={20} />
            <div>
              <span className="text-[var(--cyan)] font-bold uppercase tracking-wider text-sm block">
                CodeWriter Hardware Keystroke Subsystem
              </span>
              <span className="text-xs text-[var(--muted)]">
                Direct /dev/uinput Driver &bull; GTK4 / Libadwaita &bull; Stealth Cadence Humanizer
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 font-semibold flex items-center gap-1.5">
              <ShieldCheck size={12} />
              101 Unit Tests Passed (100%)
            </span>
            <span className="text-xs px-3 py-1 rounded-full border border-[var(--cyan)]/30 bg-[var(--cyan)]/10 text-[var(--cyan)] font-semibold flex items-center gap-1">
              <Cpu size={12} />
              Bypass: Raw USB Emulation
            </span>
          </div>
        </div>

        {/* Content Layout */}
        <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Code Staging & Humanizer Controls (6 cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between bg-black/40 border border-white/10 rounded-xl p-5">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs text-white/70 font-bold flex items-center gap-1.5">
                  <FileCode size={14} className="text-[var(--cyan)]" />
                  Staged Code Payload
                </span>
                
                <button
                  onClick={handleStripMarkdown}
                  className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 hover:border-amber-400 text-amber-300 transition-all cursor-pointer flex items-center gap-1"
                  title="Strip conversational Markdown fences (ChatGPT/Claude/Gemini)"
                >
                  <Sparkles size={10} />
                  <span>Strip Markdown</span>
                </button>
              </div>

              {/* Language Selector Tabs */}
              <div className="flex gap-1.5 mb-3 flex-wrap">
                {(["python", "cpp", "rust", "markdown_ai"] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleSelectLang(lang)}
                    className={`text-[11px] px-2.5 py-1 rounded-md font-semibold cursor-pointer border transition-all ${
                      selectedLang === lang
                        ? "bg-[var(--cyan)]/20 border-[var(--cyan)] text-white font-bold"
                        : "bg-white/5 border-white/10 text-white/50 hover:text-white/80"
                    }`}
                  >
                    {lang === "markdown_ai" ? "AI Markdown" : lang.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Code Textarea / Staging Area */}
              <div className="relative mb-4">
                <textarea
                  value={activeText}
                  onChange={(e) => {
                    setActiveText(e.target.value);
                    setTypedIndex(0);
                    setIsStreaming(false);
                  }}
                  rows={6}
                  className="w-full bg-black/60 border border-white/10 rounded-lg p-3 text-xs font-mono text-cyan-200/90 focus:outline-none focus:border-[var(--cyan)] leading-relaxed resize-none"
                />
              </div>

              {/* Speed Preset & Humanizer Configuration */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-white/5 p-2.5 rounded-lg border border-white/5">
                  <span className="text-[10px] text-white/50 block mb-1.5">TYPING SPEED PRESET</span>
                  <div className="flex gap-1">
                    {(["fast", "normal", "safe"] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => setSpeed(s)}
                        className={`text-[10px] flex-1 py-1 rounded uppercase font-semibold cursor-pointer border ${
                          speed === s
                            ? "bg-[var(--cyan)]/20 border-[var(--cyan)] text-white"
                            : "bg-black/30 border-white/5 text-white/50"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white/5 p-2.5 rounded-lg border border-white/5 flex flex-col justify-between">
                  <span className="text-[10px] text-white/50 block">STEALTH HUMANIZER</span>
                  <button
                    onClick={() => setHumanizer(!humanizer)}
                    className={`py-1 px-2 rounded text-[11px] font-semibold flex items-center justify-center gap-1.5 cursor-pointer border transition-all ${
                      humanizer
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/50"
                        : "bg-black/30 text-white/40 border-white/5"
                    }`}
                  >
                    <Sparkles size={11} />
                    <span>{humanizer ? "Cadence Jitter: ON" : "Cadence: Static"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex gap-2">
              <button
                onClick={handleToggleStream}
                className="flex-1 py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all border bg-[var(--cyan)]/20 hover:bg-[var(--cyan)]/30 text-[var(--cyan)] border-[var(--cyan)]/50 shadow-[0_0_15px_rgba(111,255,233,0.2)]"
              >
                {isStreaming ? <Pause size={14} /> : <Play size={14} />}
                <span>{isStreaming ? "Pause Hardware Stream" : typedIndex >= activeText.length ? "Stream Again" : "Start /dev/uinput Stream"}</span>
              </button>

              <button
                onClick={handleReset}
                className="py-2.5 px-3.5 rounded-lg text-xs font-bold bg-white/5 text-white/80 border border-white/10 hover:border-white/20 transition-all cursor-pointer"
                title="Reset stream position"
              >
                <RotateCcw size={13} />
              </button>
            </div>
          </div>

          {/* Right Column: Linux Kernel Pipeline & Target Window Preview (6 cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              {/* Kernel Pipeline Flow Diagram */}
              <div className="bg-black/50 border border-white/10 rounded-xl p-3.5 mb-4">
                <span className="text-[10px] text-white/50 uppercase tracking-wider block mb-2 font-bold">
                  Kernel Input Event Flow Architecture
                </span>
                
                <div className="flex items-center justify-between text-center gap-1 text-[10px]">
                  <div className="flex-1 bg-white/5 p-2 rounded border border-white/5">
                    <span className="text-white/50 block">STAGE 1</span>
                    <span className="font-bold text-[var(--cyan)]">CodeWriter</span>
                  </div>
                  <span className={`text-xs ${isStreaming ? "text-[var(--cyan)] animate-pulse" : "text-white/20"}`}>&rarr;</span>
                  
                  <div className="flex-1 bg-white/5 p-2 rounded border border-white/5">
                    <span className="text-white/50 block">STAGE 2</span>
                    <span className="font-bold text-amber-300">/dev/uinput</span>
                  </div>
                  <span className={`text-xs ${isStreaming ? "text-amber-300 animate-pulse" : "text-white/20"}`}>&rarr;</span>

                  <div className="flex-1 bg-white/5 p-2 rounded border border-white/5">
                    <span className="text-white/50 block">STAGE 3</span>
                    <span className="font-bold text-purple-300">ydotool Daemon</span>
                  </div>
                  <span className={`text-xs ${isStreaming ? "text-purple-300 animate-pulse" : "text-white/20"}`}>&rarr;</span>

                  <div className="flex-1 bg-white/5 p-2 rounded border border-white/5">
                    <span className="text-white/50 block">TARGET</span>
                    <span className="font-bold text-emerald-300">Active App</span>
                  </div>
                </div>
              </div>

              {/* Raw Event Telemetry Box */}
              <div className="grid grid-cols-3 gap-2.5 mb-4 text-center">
                <div className="bg-white/5 p-2.5 rounded-lg border border-white/10">
                  <span className="text-xs text-white/50 block font-semibold mb-0.5">CURRENT SCANCODE</span>
                  <span className="text-sm font-bold text-[var(--cyan)] block truncate">{lastEvent.code}</span>
                </div>
                <div className="bg-white/5 p-2.5 rounded-lg border border-white/10">
                  <span className="text-xs text-white/50 block font-semibold mb-0.5">STREAM CADENCE</span>
                  <span className="text-sm font-bold text-amber-300 block">~{wpm} WPM</span>
                </div>
                <div className="bg-white/5 p-2.5 rounded-lg border border-white/10">
                  <span className="text-xs text-white/50 block font-semibold mb-0.5">TYPED PROGRESS</span>
                  <span className="text-sm font-bold text-emerald-300 block">
                    {Math.round((typedIndex / activeText.length) * 100)}%
                  </span>
                </div>
              </div>

              {/* Target Window Output Preview */}
              <div className="bg-black/70 border border-white/10 rounded-xl overflow-hidden shadow-inner">
                <div className="bg-white/5 px-3.5 py-2 border-b border-white/10 flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    <span className="text-white/70 ml-1 font-semibold">Target Window: Locked VM Console / Remote Browser</span>
                  </div>
                  <span className="text-emerald-400 font-semibold">● Active Focused Cursor</span>
                </div>

                <div className="p-4 min-h-[140px] text-xs font-mono text-cyan-200/90 leading-relaxed overflow-x-auto">
                  <pre className="m-0 font-mono whitespace-pre-wrap text-[13px] leading-relaxed">
                    {activeText.slice(0, typedIndex)}
                    <span className="inline-block w-2 h-4 bg-[var(--cyan)] align-middle ml-0.5 animate-pulse" />
                  </pre>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center text-xs text-white/60">
              <span>Zero-clipboard dependency &bull; Wayland & X11 support</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 size={14} /> Bypass Verified
              </span>
            </div>
          </div>
        </div>

        {/* Core Engineering Uniqueness Matrix */}
        <div className="p-6 bg-black/60 border-t border-white/10">
          <span className="text-sm font-bold text-[var(--cyan)] uppercase tracking-wider block mb-3 flex items-center gap-2">
            <Zap size={16} /> Core Architectural Innovations & Engineering Uniqueness
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <span className="font-bold text-white block mb-1 text-sm">1. /dev/uinput Driver</span>
              <p className="text-slate-200 text-xs leading-relaxed m-0 font-sans">
                Emulates low-level physical Linux USB HID keystrokes via kernel <code className="text-cyan-300">EV_KEY</code> scancodes, completely bypassing browser clipboard and paste restrictions.
              </p>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <span className="font-bold text-white block mb-1 text-sm">2. Stealth Humanizer Cadence</span>
              <p className="text-slate-200 text-xs leading-relaxed m-0 font-sans">
                Non-linear Gaussian typing distribution engine applying natural human hesitation intervals, micro-delays, and randomized WPM bursts.
              </p>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <span className="font-bold text-white block mb-1 text-sm">3. AI Markdown Stripper</span>
              <p className="text-slate-200 text-xs leading-relaxed m-0 font-sans">
                One-click parser stripping markdown triple-backtick code fences and conversational prose into clean, formatted executable code ready for streaming.
              </p>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <span className="font-bold text-white block mb-1 text-sm">4. 101 Unit Tests (100%)</span>
              <p className="text-slate-200 text-xs leading-relaxed m-0 font-sans">
                Backed by 101 automated pytests verifying timing accuracy, scancode mapping, X11/Wayland window focus hooks, and zero clipboard contamination.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
