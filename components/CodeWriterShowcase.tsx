"use client";

import { useState } from "react";
import { Zap, Terminal, Code, Cpu, Keyboard, Sparkles, Copy, Check, ExternalLink, ArrowRight, CheckCircle2 } from "lucide-react";
import GithubIcon from "@/components/GithubIcon";
import { useRouter } from "next/navigation";

export default function CodeWriterShowcase() {
  const router = useRouter();
  const [copiedClone, setCopiedClone] = useState(false);
  const [activeTab, setActiveTab] = useState<"stream_preview" | "pipeline" | "test_suite">("stream_preview");

  const handleCopyClone = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText("git clone https://github.com/ScaraMouche-Wanderer/CodeWriter.git");
    setCopiedClone(true);
    setTimeout(() => setCopiedClone(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6 select-none font-sans" onClick={(e) => e.stopPropagation()}>
      {/* Top Meta Bar: Repository Link, Star Count, Badges */}
      <div className="flex flex-wrap justify-between items-center gap-3 p-3.5 bg-black/40 rounded-xl border border-white/10">
        <div className="flex items-center gap-2.5 flex-wrap">
          <a
            href="https://github.com/ScaraMouche-Wanderer/CodeWriter"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white font-mono text-sm font-bold hover:text-cyan-400 transition-colors"
          >
            <GithubIcon size={18} />
            <span>ScaraMouche-Wanderer / CodeWriter</span>
            <ExternalLink size={13} className="opacity-60" />
          </a>
          <span className="text-xs px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono font-semibold">
            v1.0.0
          </span>
          <span className="text-xs px-2 py-0.5 rounded bg-white/5 text-white/70 border border-white/10 font-mono">
            MIT License
          </span>
        </div>

        {/* Quick Clone Snippet */}
        <div className="flex items-center gap-2">
          <div className="bg-black/60 px-3 py-1.5 rounded-lg border border-white/10 font-mono text-xs text-cyan-300 flex items-center gap-2">
            <span className="text-white/40">$</span>
            <span>git clone .../CodeWriter.git</span>
            <button
              onClick={handleCopyClone}
              className="text-white/60 hover:text-white transition-colors cursor-pointer p-0.5"
              title="Copy Clone Command"
            >
              {copiedClone ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Engineering Showcase Grid (Split 2-Column on Desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Subsystem Architecture & Verified Capabilities (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-5">
          <div>
            <div className="mb-4">
              <h4 className="text-lg font-bold text-white mb-1.5 flex items-center gap-2">
                <Zap size={20} className="text-cyan-400" />
                Native Linux Keystroke Streamer & Desktop Automation Engine
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed font-normal">
                A native GTK4 / Libadwaita desktop utility that streams pre-written code directly into target windows, remote VM consoles, or browser editors via low-level Linux <code className="text-cyan-300 text-xs">/dev/uinput</code> kernel scancodes without clipboard tampering.
              </p>
            </div>

            {/* Architecture Subsystem Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <Keyboard size={15} className="text-cyan-400" />
                  <span className="text-xs font-bold font-mono text-white">Kernel /dev/uinput Injector</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed m-0">
                  Creates virtual HID keyboard devices in Linux userspace generating native <code className="text-cyan-300 text-[11px]">EV_KEY</code> scancodes that completely bypass browser paste listeners.
                </p>
              </div>

              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles size={15} className="text-amber-400" />
                  <span className="text-xs font-bold font-mono text-white">Stealth Humanizer Cadence</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed m-0">
                  Gaussian typing distribution engine applying non-linear delays, natural hesitation intervals, and randomized WPM bursts to mimic authentic human typing.
                </p>
              </div>

              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <Code size={15} className="text-purple-400" />
                  <span className="text-xs font-bold font-mono text-white">GtkSourceView 5 IDE</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed m-0">
                  Full GNOME 45 Libadwaita editor with syntax highlighting, automatic indentation preservation, and multi-file staging buffer.
                </p>
              </div>

              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <Cpu size={15} className="text-emerald-400" />
                  <span className="text-xs font-bold font-mono text-white">AI Markdown Stripper</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed m-0">
                  One-click parser stripping markdown triple-backtick code fences, conversational prose, and formatting artifacts into raw executable code.
                </p>
              </div>
            </div>
          </div>

          {/* Key Verified Benchmarks */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold flex items-center gap-1.5">
              <CheckCircle2 size={13} /> 101 Pytests (100% Passed)
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold flex items-center gap-1.5">
              <CheckCircle2 size={13} /> 2ms to 20ms Streaming Speeds
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold flex items-center gap-1.5">
              <CheckCircle2 size={13} /> Native Wayland & X11 Support
            </span>
          </div>
        </div>

        {/* Right Column: Authentic GTK4 Desktop Window Viewport (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col bg-black/75 rounded-xl border border-white/15 overflow-hidden shadow-2xl">
          {/* GTK4 Window Header */}
          <div className="bg-slate-900 px-4 py-2.5 border-b border-white/10 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/90" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/90" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/90" />
              </div>
              <span className="text-xs font-mono text-slate-300 font-bold ml-1">
                codewriter &bull; GTK4 / Libadwaita
              </span>
            </div>

            {/* View Tabs */}
            <div className="flex gap-1">
              {(["stream_preview", "pipeline", "test_suite"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-xs px-2.5 py-1 rounded font-mono uppercase transition-colors cursor-pointer ${
                    activeTab === tab ? "bg-cyan-500/30 text-cyan-300 font-bold" : "text-slate-300 hover:text-white"
                  }`}
                >
                  {tab === "stream_preview" ? "Editor" : tab === "pipeline" ? "Kernel Flow" : "Tests"}
                </button>
              ))}
            </div>
          </div>

          {/* Terminal / Code Content Body */}
          <div className="p-4 font-mono text-xs leading-relaxed overflow-x-auto min-h-[260px] text-slate-200 flex-1">
            {activeTab === "stream_preview" && (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs pb-1.5 border-b border-white/10 text-slate-300">
                  <span className="text-cyan-300 font-bold">src/kernel_streamer.c</span>
                  <span className="font-semibold text-slate-300">SPEED: 8ms &bull; CADENCE: ~140 WPM</span>
                </div>
                <pre className="text-cyan-100 text-xs font-mono leading-relaxed m-0 whitespace-pre-wrap">
{`#include <linux/uinput.h>
#include <fcntl.h>

void inject_raw_scancode(int fd, uint16_t key) {
    struct input_event ev = {
        .type = EV_KEY,
        .code = key,
        .value = 1 // Key Down
    };
    write(fd, &ev, sizeof(ev));
}`}
                </pre>
              </div>
            )}

            {activeTab === "pipeline" && (
              <div className="space-y-1.5 text-xs text-slate-200">
                <p className="text-slate-300 font-bold m-0">$ codewriter --stream --mode hardware --speed 8ms</p>
                <p className="text-emerald-400 font-bold m-0">[STAGE 1] Staging Buffer: 1,420 bytes loaded</p>
                <p className="text-cyan-300 font-semibold m-0">[STAGE 2] Markdown Stripper: Removed 2 code fences</p>
                <p className="text-amber-300 font-semibold m-0">[STAGE 3] /dev/uinput: Virtual HID Keyboard created</p>
                <p className="text-purple-300 font-semibold m-0">[STAGE 4] Humanizer Cadence: Gaussian jitter applied (&mu;=8ms, &sigma;=2.4ms)</p>
                <p className="text-emerald-400 font-bold m-0">[STAGE 5] Target Window: Active focus received &rarr; Stream Complete</p>
              </div>
            )}

            {activeTab === "test_suite" && (
              <div className="space-y-1.5 text-xs text-slate-200">
                <p className="text-slate-300 font-bold m-0">$ pytest tests/ -v</p>
                <p className="text-emerald-400 m-0">test_uinput_virtual_device.py::test_device_creation <span className="font-bold">PASSED</span></p>
                <p className="text-emerald-400 m-0">test_scancode_lookup.py::test_utf8_to_evkey_map <span className="font-bold">PASSED</span></p>
                <p className="text-emerald-400 m-0">test_humanizer.py::test_gaussian_interval_jitter <span className="font-bold">PASSED</span></p>
                <p className="text-emerald-400 m-0">test_markdown_parser.py::test_fence_stripper <span className="font-bold">PASSED</span></p>
                <p className="text-emerald-400 m-0">test_gtk_gui.py::test_adw_window_lifecycle <span className="font-bold">PASSED</span></p>
                <p className="text-emerald-300 font-bold mt-2 m-0">================ 101 passed in 1.42s ================</p>
              </div>
            )}
          </div>

          {/* Bottom Telemetry Strip */}
          <div className="bg-slate-950 px-4 py-2 border-t border-white/10 flex justify-between items-center text-xs text-slate-300 font-mono">
            <span>GTK4 / Libadwaita &bull; ydotool / XTest</span>
            <span className="text-cyan-400 font-semibold">● Ready to Stream</span>
          </div>
        </div>
      </div>

      {/* Dual Action Bar */}
      <div className="flex flex-wrap gap-3 pt-2 items-center justify-between">
        <div className="flex items-center gap-3 flex-wrap">
          <a
            href="https://github.com/ScaraMouche-Wanderer/CodeWriter"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold text-sm transition-all"
          >
            <GithubIcon size={16} />
            <span>View Source on GitHub ↗</span>
          </a>

          <button
            onClick={() => router.push('/project/proj-codewriter')}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/50 font-bold text-sm cursor-pointer transition-all shadow-[0_0_15px_rgba(111,255,233,0.18)]"
          >
            <span>Launch Kernel Architecture Deep Dive</span>
            <ArrowRight size={15} />
          </button>
        </div>

        <span className="text-xs text-slate-400 font-mono">
          Engineered for Linux Desktop (Wayland / X11)
        </span>
      </div>
    </div>
  );
}
