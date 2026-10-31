"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function BufferOverflowVisualizer() {
  const [inputStr, setInputStr] = useState("");
  
  const bufferSize = 8;
  const chars = inputStr.split('');
  const isCrashed = chars.length > bufferSize + 3;
  const isOverflow = chars.length > bufferSize;
  const systemMessage = isCrashed
    ? "FATAL: SEGMENTATION FAULT (core dumped) - Return address overwritten."
    : isOverflow
    ? "WARNING: Writing out of bounds. Buffer overflow detected."
    : "System running normally.";

  return (
    <div className="w-full max-w-4xl mx-auto my-12" style={{ fontFamily: '"Consolas", "Courier New", monospace' }}>
      
      <div className="mb-8 border border-[var(--line)] rounded-2xl overflow-hidden bg-[var(--panel-strong)] backdrop-blur-xl shadow-2xl">
        <div className="bg-[var(--background-soft)] px-6 py-4 border-b border-[var(--line)] flex justify-between items-center">
          <span className="text-[var(--cyan)] font-bold uppercase tracking-widest text-sm">Interactive Terminal</span>
          <span 
            className="text-xs px-3 py-1 rounded-full border"
            style={{ 
              color: isCrashed ? '#ef4444' : 'var(--lime)', 
              borderColor: isCrashed ? 'rgba(239,68,68,0.3)' : 'var(--line)', 
              backgroundColor: isCrashed ? 'rgba(239,68,68,0.1)' : 'var(--line)' 
            }}
          >
            {isCrashed ? 'CRASHED' : 'ONLINE'}
          </span>
        </div>
        
        <div className="p-8">
          <div className="flex flex-col md:flex-row gap-12">
            
            {/* Input Section */}
            <div className="flex-1">
              <p className="text-[var(--muted)] text-sm mb-4">
                Enter your payload. The allocated buffer is exactly 8 bytes long. 
                Any characters beyond 8 will overwrite adjacent memory on the stack.
              </p>
              
              <div className="mb-6 relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--cyan)]">&gt;</span>
                <input 
                  type="text" 
                  value={inputStr}
                  onChange={(e) => setInputStr(e.target.value)}
                  disabled={isCrashed}
                  className={`w-full bg-[var(--background)] border ${isCrashed ? 'border-red-500/50 text-red-300' : 'border-[var(--cyan)]/30 text-[var(--cyan)]'} rounded-xl py-4 pl-10 pr-4 focus:outline-none focus:border-[var(--cyan)] transition-colors disabled:opacity-50`}
                  placeholder="Type a string..."
                />
              </div>

              <div className={`p-4 rounded-xl border ${isCrashed ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-[var(--background-soft)] border-[var(--line)] text-[var(--foreground)]'}`}>
                <p className="text-xs">{systemMessage}</p>
              </div>

              {isCrashed && (
                <button 
                  onClick={() => setInputStr("")}
                  className="mt-6 px-6 py-2 bg-[var(--background-soft)] hover:bg-[var(--line)] border border-[var(--line)] text-[var(--foreground)] text-sm transition-colors rounded-full"
                >
                  Reboot System
                </button>
              )}
            </div>

            {/* Visualizer Section */}
            <div className="flex-1 relative">
              <h3 className="text-[var(--muted)] uppercase tracking-widest text-xs mb-4">Memory Stack Layout</h3>
              
              <div className="flex flex-col gap-2">
                {/* Local Variables */}
                <div className="flex items-center gap-4">
                  <span className="text-[var(--muted)] text-xs w-20 text-right">0x7FFFC10</span>
                  <div className="flex-1 h-12 border border-[var(--line)] bg-[var(--background-soft)] rounded-lg flex items-center justify-center text-[var(--muted)] text-sm">
                    Local Variables
                  </div>
                </div>

                {/* Return Address */}
                <div className="flex items-center gap-4 relative">
                  <span className="text-[var(--muted)] text-xs w-20 text-right">0x7FFFC08</span>
                  <motion.div 
                    animate={{
                      borderColor: chars.length > bufferSize + 3 ? 'rgba(239, 68, 68, 0.8)' : 'var(--amber)',
                      backgroundColor: chars.length > bufferSize + 3 ? 'rgba(239, 68, 68, 0.1)' : 'var(--line)',
                      x: isCrashed ? [0, -5, 5, -5, 5, 0] : 0
                    }}
                    transition={{ duration: 0.3 }}
                    className="flex-1 h-12 border border-[var(--line)] rounded-lg flex overflow-hidden relative"
                  >
                    <div className="absolute inset-0 flex items-center justify-center text-[var(--amber)] opacity-60 text-sm pointer-events-none">
                      Return Address
                    </div>
                    {/* Return Address Bytes */}
                    {[...Array(4)].map((_, i) => {
                      const charIndex = bufferSize + i;
                      const hasChar = charIndex < chars.length;
                      return (
                        <div key={`ret-${i}`} className="flex-1 border-r border-[var(--line)] last:border-0 flex items-center justify-center relative z-10">
                          {hasChar && (
                            <motion.span 
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="text-red-400 font-bold"
                            >
                              {chars[charIndex]}
                            </motion.span>
                          )}
                        </div>
                      );
                    })}
                  </motion.div>
                </div>

                {/* Buffer */}
                <div className="flex items-center gap-4">
                  <span className="text-[var(--muted)] text-xs w-20 text-right">0x7FFFC00</span>
                  <div className="flex-1 flex flex-wrap border border-[var(--cyan)] bg-[var(--line)] rounded-lg overflow-hidden relative">
                    <div className="absolute inset-0 flex items-center justify-center text-[var(--cyan)] opacity-30 text-sm pointer-events-none">
                      char buffer[8]
                    </div>
                    {[...Array(8)].map((_, i) => {
                      const hasChar = i < chars.length;
                      return (
                        <div key={`buf-${i}`} className="w-1/4 h-12 border-r border-b border-[var(--line)] flex items-center justify-center relative z-10">
                          {hasChar && (
                            <motion.span 
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="text-[var(--cyan)]"
                            >
                              {chars[i]}
                            </motion.span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 border border-[var(--line)] bg-[var(--background-soft)] rounded-xl text-[var(--muted)] text-xs leading-relaxed">
                <strong className="text-[var(--foreground)] block mb-1 font-bold">What&apos;s happening?</strong>
                In C, local variables and function return addresses are placed on the stack. If <code>gets()</code> or <code>strcpy()</code> is used without bounds checking, writing beyond the 8-byte buffer overwrites adjacent memory. Overwriting the &quot;Return Address&quot; allows an attacker to hijack the execution flow of the program.
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
  