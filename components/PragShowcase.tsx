"use client";

import { useState } from "react";
import { 
  BrainCircuit, 
  Database, 
  Terminal, 
  Cpu, 
  ShieldCheck, 
  Sparkles, 
  Calculator, 
  Copy, 
  Check, 
  ExternalLink, 
  ArrowRight, 
  CheckCircle2, 
  Server, 
  Layers, 
  Activity, 
  Zap, 
  FileText, 
  Search, 
  RefreshCw 
} from "lucide-react";
import GithubIcon from "@/components/GithubIcon";
import { useRouter } from "next/navigation";

export default function PragShowcase() {
  const router = useRouter();
  const [copiedClone, setCopiedClone] = useState(false);
  const [activeTab, setActiveTab] = useState<"pipeline" | "benchmarks" | "memory">("pipeline");

  // Sample Interactive Demo State
  const [activeQueryIndex, setActiveQueryIndex] = useState(0);

  const sampleQueries = [
    {
      query: "What are the flags for a UDP port scan in nmap?",
      category: "Kali Tool Corpus (Tier 1)",
      route: "Rule-Based Router → Kali Documentation (man nmap)",
      retrievalLatency: "0.05s (SQLite-vec) + 3.50s (BGE Reranker)",
      generation: "Direct Grounded Answer via Qwen3:8B",
      confidence: "HIGH",
      sources: ["/usr/share/man/man1/nmap.1.gz", "knowledge_base_kali/nmap.md"],
      snippet: "To perform a UDP scan in Nmap, use the `-sU` flag. Recommended companion flags include `-sV` for version detection, `-p-` for all ports, and `--min-rate 1000` to accelerate UDP probe throughput.",
      reasoningTime: "Suppressed Thinking Tokens → Direct Response"
    },
    {
      query: "Compute derivative: f(x) = x^3 * sin(x)",
      category: "High-Precision AST Math Engine",
      route: "AST Engine Bypass → SymPy Symbolic Calculus",
      retrievalLatency: "1 ms (Zero LLM reasoning tokens needed)",
      generation: "Exact Algebraic Derivation",
      confidence: "HIGH (100% Deterministic)",
      sources: ["Internal SymPy AST Engine (Calculus Module)"],
      snippet: "d/dx [x³ · sin(x)] = 3x² · sin(x) + x³ · cos(x) = x²(3 sin(x) + x cos(x)). Computed with 0% hallucination in 3ms.",
      reasoningTime: "3 ms Execution Latency"
    },
    {
      query: "Explain Bluetooth LE advertising packets & interval timing",
      category: "Local Research Base + Web Fallback",
      route: "Local Corpus Miss → Parallel Web Fallback (DDG + Wikipedia)",
      retrievalLatency: "3.80s (Parallel ThreadPoolExecutor)",
      generation: "Multi-Tier Grounded Synthesis",
      confidence: "MEDIUM (Secondary Verification)",
      sources: ["Tier 2: Wikipedia/Bluetooth_Low_Energy", "Tier 3: Bluetooth SIG Specs"],
      snippet: "BLE peripheral devices broadcast advertisement packets on 3 primary advertising channels (37, 38, 39). The advertising interval ranges from 20ms to 10.24s in 0.625ms steps.",
      reasoningTime: "Grounded with strict confidence labeling"
    }
  ];

  const currentSample = sampleQueries[activeQueryIndex];

  const handleCopyClone = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText("git clone https://github.com/ScaraMouche-Wanderer/PRAG.git");
    setCopiedClone(true);
    setTimeout(() => setCopiedClone(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6 select-none font-sans" onClick={(e) => e.stopPropagation()}>
      {/* Top Meta Bar: Repository Link, Version, Badges */}
      <div className="flex flex-wrap justify-between items-center gap-3 p-3.5 bg-black/40 rounded-xl border border-white/10">
        <div className="flex items-center gap-2.5 flex-wrap">
          <a
            href="https://github.com/ScaraMouche-Wanderer/PRAG"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white font-mono text-sm font-bold hover:text-indigo-400 transition-colors"
          >
            <GithubIcon size={18} />
            <span>ScaraMouche-Wanderer / PRAG</span>
            <ExternalLink size={13} className="opacity-60" />
          </a>
          <span className="text-xs px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-mono font-semibold flex items-center gap-1">
            <Sparkles size={11} /> Local Fact-Grounded RAG
          </span>
          <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-semibold">
            100% Offline / Zero-Leak
          </span>
          <span className="text-xs px-2 py-0.5 rounded bg-white/5 text-white/70 border border-white/10 font-mono">
            MIT License
          </span>
        </div>

        {/* Quick Clone Snippet */}
        <div className="flex items-center gap-2">
          <div className="bg-black/60 px-3 py-1.5 rounded-lg border border-white/10 font-mono text-xs text-indigo-300 flex items-center gap-2">
            <span className="text-white/40">$</span>
            <span>git clone .../PRAG.git</span>
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

      {/* Main Engineering Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Subsystem Architecture & Uniqueness Matrix (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-5">
          <div>
            <div className="mb-4">
              <h4 className="text-lg font-bold text-white mb-1.5 flex items-center gap-2">
                <BrainCircuit size={20} className="text-indigo-400" />
                Evidence-First Local Research Engine with AST Math & Kali Tool Grounding
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed font-normal">
                A high-performance, 100% local fact-grounded research architecture powered by local <strong className="text-white">Qwen3:8B</strong>, embedded <strong className="text-white">SQLite-vec</strong>, and <strong className="text-white">BAAI Cross-Encoder</strong> reranking. Eliminates LLM hallucinations via deterministic AST math bypass, strict confidence labeling, and automated 60+ Kali Linux tool documentation syncing.
              </p>
            </div>

            {/* Architecture Subsystem Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <Calculator size={15} className="text-cyan-400" />
                  <span className="text-xs font-bold font-mono text-white">AST High-Precision Math</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed m-0">
                  Direct evaluation of complex modulo arithmetic, algebra, and symbolic calculus in <code className="text-cyan-300 text-[11px]">&lt;1–9 ms</code> with 100% zero hallucination without burning LLM reasoning tokens.
                </p>
              </div>

              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheck size={15} className="text-indigo-400" />
                  <span className="text-xs font-bold font-mono text-white">60+ Kali Linux Corpus Sync</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed m-0">
                  Automated daemon synchronization of live local <code className="text-indigo-300 text-[11px]">man</code> pages and CLI docs for penetration testing tools (Nmap, Metasploit, Wireshark, GDB, iptables).
                </p>
              </div>

              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <Layers size={15} className="text-amber-400" />
                  <span className="text-xs font-bold font-mono text-white">CrossEncoder 2-Stage Retrieval</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed m-0">
                  Fast SQLite-vec vector similarity search paired with cached <code className="text-amber-300 text-[11px]">bge-reranker-base</code> scoring to distill top-10 candidate chunks down to top-3 surgical excerpts.
                </p>
              </div>

              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <Cpu size={15} className="text-emerald-400" />
                  <span className="text-xs font-bold font-mono text-white">Zero-Idle RAM Architecture</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed m-0">
                  Zero background daemon memory cost. Embedder and reranker load dynamically on demand and release <code className="text-emerald-300 text-[11px]">100% of RAM</code> back to 0.0 MB upon query completion.
                </p>
              </div>
            </div>
          </div>

          {/* Key Verified Benchmarks */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
            <span className="text-xs px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-semibold flex items-center gap-1.5">
              <CheckCircle2 size={13} /> &lt;1s First Token Latency (TTFT)
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold flex items-center gap-1.5">
              <CheckCircle2 size={13} /> 1ms AST Deterministic Math
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold flex items-center gap-1.5">
              <CheckCircle2 size={13} /> 0.0 MB Post-Query Leakage
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold flex items-center gap-1.5">
              <CheckCircle2 size={13} /> Tier 1-3 Source Trust Validation
            </span>
          </div>
        </div>

        {/* Right Column: Interactive Pipeline Streamer & Grounded Verification Viewport (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col bg-black/75 rounded-xl border border-white/15 overflow-hidden shadow-2xl">
          {/* Header Bar */}
          <div className="bg-slate-900 px-4 py-2.5 border-b border-white/10 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/90" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/90" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/90" />
              </div>
              <span className="text-xs font-mono text-slate-300 font-bold ml-1">
                prag-engine &bull; {currentSample.category}
              </span>
            </div>

            {/* View Tabs */}
            <div className="flex gap-1">
              {(["pipeline", "benchmarks", "memory"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-xs font-mono px-2.5 py-1 rounded transition-all font-semibold cursor-pointer ${
                    activeTab === tab 
                      ? "bg-indigo-500/30 text-indigo-300 border border-indigo-500/50" 
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  {tab === "pipeline" ? "Stream" : tab === "benchmarks" ? "Latency" : "RAM Δ"}
                </button>
              ))}
            </div>
          </div>

          {/* Body Content Based on Tab */}
          <div className="p-4 flex flex-col justify-between flex-1 gap-4 font-mono text-xs">
            {activeTab === "pipeline" && (
              <div className="flex flex-col gap-3">
                {/* Query Selector Tabs */}
                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {sampleQueries.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveQueryIndex(idx)}
                      className={`px-3 py-1 rounded text-xs whitespace-nowrap transition-all cursor-pointer ${
                        activeQueryIndex === idx
                          ? "bg-indigo-600/40 text-indigo-200 border border-indigo-500/60 font-bold"
                          : "bg-white/5 text-slate-300 hover:text-white border border-white/10"
                      }`}
                    >
                      Case {idx + 1}: {s.category.split(" ")[0]}
                    </button>
                  ))}
                </div>

                {/* Simulated Query Box */}
                <div className="bg-black/60 p-3 rounded-lg border border-white/15">
                  <div className="text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Search size={13} className="text-indigo-400" /> User Research Query
                  </div>
                  <div className="text-white text-xs font-semibold">{currentSample.query}</div>
                </div>

                {/* Pipeline Step Trace */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-200 bg-white/[0.04] p-2 rounded border border-white/10">
                    <span className="flex items-center gap-1.5 text-indigo-400 font-semibold">
                      <Zap size={13} /> Route:
                    </span>
                    <span className="text-slate-200 truncate max-w-[200px]">{currentSample.route}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-200 bg-white/[0.04] p-2 rounded border border-white/10">
                    <span className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                      <Activity size={13} /> Latency:
                    </span>
                    <span className="text-cyan-300 font-bold">{currentSample.retrievalLatency}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-200 bg-white/[0.04] p-2 rounded border border-white/10">
                    <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                      <ShieldCheck size={13} /> Confidence:
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
                      {currentSample.confidence}
                    </span>
                  </div>
                </div>

                {/* Answer Excerpt Output */}
                <div className="bg-indigo-950/30 p-3.5 rounded-lg border border-indigo-500/40">
                  <div className="text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>⚡ Fact-Grounded Response:</span>
                    <span className="text-emerald-400 text-xs font-bold">Zero-Hallucination</span>
                  </div>
                  <p className="text-slate-100 text-xs leading-relaxed font-sans m-0">
                    {currentSample.snippet}
                  </p>
                  <div className="mt-2.5 pt-2 border-t border-indigo-500/30 text-xs text-slate-300 flex items-center gap-1.5 truncate">
                    <FileText size={12} className="text-indigo-400 flex-shrink-0" />
                    <span className="truncate">Source: {currentSample.sources.join(", ")}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "benchmarks" && (
              <div className="space-y-2.5 text-[11px]">
                <div className="text-slate-300 text-xs font-bold mb-1 flex items-center gap-1">
                  <Activity size={14} className="text-indigo-400" /> Latency & Performance Breakdown
                </div>
                <div className="space-y-1.5">
                  <div className="p-2 rounded bg-white/5 border border-white/10 flex justify-between items-center">
                    <span className="text-slate-300">Rule-Based Query Router</span>
                    <span className="text-cyan-300 font-bold font-mono">0.00 s (Instant)</span>
                  </div>
                  <div className="p-2 rounded bg-white/5 border border-white/10 flex justify-between items-center">
                    <span className="text-slate-300">AST Symbolic Calculus & Modulo</span>
                    <span className="text-emerald-400 font-bold font-mono">1 – 3 ms</span>
                  </div>
                  <div className="p-2 rounded bg-white/5 border border-white/10 flex justify-between items-center">
                    <span className="text-slate-300">SQLite-vec Vector Search</span>
                    <span className="text-cyan-300 font-bold font-mono">0.05 s</span>
                  </div>
                  <div className="p-2 rounded bg-white/5 border border-white/10 flex justify-between items-center">
                    <span className="text-slate-300">BGE CrossEncoder Top-3 Scoring</span>
                    <span className="text-amber-300 font-bold font-mono">3.50 s</span>
                  </div>
                  <div className="p-2 rounded bg-white/5 border border-white/10 flex justify-between items-center">
                    <span className="text-slate-300">Web UI Streaming TTFT</span>
                    <span className="text-emerald-400 font-bold font-mono">&lt; 1.0 s</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "memory" && (
              <div className="space-y-2.5 text-[11px]">
                <div className="text-slate-300 text-xs font-bold mb-1 flex items-center gap-1">
                  <Server size={14} className="text-emerald-400" /> Per-Phase Memory Profile (PROFILE=1)
                </div>
                <div className="space-y-1.5">
                  <div className="p-2 rounded bg-white/5 border border-white/10 flex justify-between items-center">
                    <span className="text-slate-300">Idle Python Daemon RSS</span>
                    <span className="text-emerald-400 font-bold font-mono">0.0 MB (Zero Cost)</span>
                  </div>
                  <div className="p-2 rounded bg-white/5 border border-white/10 flex justify-between items-center">
                    <span className="text-slate-300">Query Startup & Ingestion</span>
                    <span className="text-cyan-300 font-mono">21.9 MB</span>
                  </div>
                  <div className="p-2 rounded bg-white/5 border border-white/10 flex justify-between items-center">
                    <span className="text-slate-300">Peak Retrieval (Embedder+Reranker)</span>
                    <span className="text-amber-300 font-mono">269.9 MB</span>
                  </div>
                  <div className="p-2 rounded bg-white/5 border border-white/10 flex justify-between items-center">
                    <span className="text-slate-300">Post-Generation Deallocation</span>
                    <span className="text-emerald-400 font-bold font-mono">0.0 MB (100% Released)</span>
                  </div>
                  <div className="p-2 rounded bg-white/5 border border-white/10 flex justify-between items-center">
                    <span className="text-slate-300">Vector Storage on Disk</span>
                    <span className="text-indigo-300 font-mono">3.55 MB Total</span>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Button to Dedicated Interactive Visualizer */}
            <button
              onClick={() => router.push("/project/proj-prag")}
              className="mt-2 w-full py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-sans font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/30"
            >
              <span>Open Dedicated PRAG Engine Simulator</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
