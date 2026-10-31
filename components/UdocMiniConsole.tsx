"use client";

import { useState } from "react";
import { FileText, ZoomIn, ZoomOut, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UdocMiniConsole() {
  const [docFormat, setDocFormat] = useState<"PDF" | "DOCX" | "SVG">("PDF");
  const [zoom, setZoom] = useState(100);
  const [benchTime, setBenchTime] = useState(2.8);
  const router = useRouter();

  const handleFormatChange = (fmt: "PDF" | "DOCX" | "SVG", e: React.MouseEvent) => {
    e.stopPropagation();
    setDocFormat(fmt);
    setBenchTime(fmt === "PDF" ? 2.8 : fmt === "DOCX" ? 4.1 : 1.4);
  };

  const handleZoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoom((prev) => Math.min(200, prev + 25));
  };

  const handleZoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoom((prev) => Math.max(50, prev - 25));
  };

  return (
    <div 
      className="flex flex-col justify-between h-full font-mono select-none"
      onClick={(e) => e.stopPropagation()}
    >
      <div>
        <div className="flex justify-between items-center pb-2 border-b border-white/10">
          <span className="text-[11px] text-[var(--cyan)] font-bold tracking-wider">DOCMENTIS_WASM_CORE</span>
          <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-lime-500/10 text-lime-400 border border-lime-500/30">
            RUST / WASM ACTIVE
          </span>
        </div>

        {/* Format Selector Tabs */}
        <div className="flex gap-1 my-2">
          {(["PDF", "DOCX", "SVG"] as const).map((fmt) => (
            <button
              key={fmt}
              onClick={(e) => handleFormatChange(fmt, e)}
              className={`flex-1 py-1 px-1.5 rounded text-[10px] font-bold border transition-all cursor-pointer ${
                docFormat === fmt
                  ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/40"
                  : "bg-white/5 text-white/50 border-white/10 hover:text-white"
              }`}
            >
              {fmt} Parser
            </button>
          ))}
        </div>

        {/* Live WASM Pipeline Metric Box */}
        <div className="bg-white/5 p-2.5 rounded border border-white/10 mb-2">
          <div className="flex justify-between items-center text-[10px] mb-2">
            <span className="text-white/60">Thread Engine: WebAssembly (SIMD)</span>
            <span className="text-lime-400 font-bold">Parse: {benchTime} ms</span>
          </div>

          <div className="bg-black/30 p-2 rounded flex justify-between items-center text-[11px]">
            <div className="flex items-center gap-1.5">
              <FileText size={14} className="text-cyan-400" />
              <span className="text-white font-semibold">{docFormat}_RenderMatrix.wasm</span>
            </div>
            <span className="text-white/50 text-[10px] font-mono">Zoom: {zoom}%</span>
          </div>
        </div>

        {/* Interactive Controls */}
        <div className="flex gap-1.5">
          <button
            onClick={handleZoomIn}
            className="flex-1 py-1 px-2 rounded text-[10px] font-semibold bg-white/5 hover:bg-cyan-500/20 text-white/80 hover:text-cyan-400 border border-white/10 hover:border-cyan-500/40 transition-all cursor-pointer flex items-center justify-center gap-1"
          >
            <ZoomIn size={11} /> Zoom In
          </button>
          <button
            onClick={handleZoomOut}
            className="flex-1 py-1 px-2 rounded text-[10px] font-semibold bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 transition-all cursor-pointer flex items-center justify-center gap-1"
          >
            <ZoomOut size={11} /> Zoom Out
          </button>
        </div>
      </div>

      <div className="pt-2.5 border-t border-white/10 flex justify-between items-center text-[10px]">
        <span className="text-white/40">Zero-Server Client Pipeline</span>
        <button
          onClick={() => router.push('/project/proj-udoc')}
          className="text-[var(--cyan)] hover:underline font-bold flex items-center gap-1 cursor-pointer"
        >
          Open WASM Lab <ArrowRight size={11} />
        </button>
      </div>
    </div>
  );
}
