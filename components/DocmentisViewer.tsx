"use client";

import { useEffect, useRef, useState } from "react";
import { UDocClient } from "@docmentis/udoc-viewer";
import { motion, AnimatePresence } from "framer-motion";

interface UDocViewerInstance {
  load: (source: string | File) => Promise<void>;
  destroy: () => void;
}

interface UDocClientInstance {
  createViewer: (options: { container: HTMLElement }) => Promise<UDocViewerInstance>;
  destroy: () => void;
}

export interface DocmentisViewerProps {
  project?: {
    id?: string;
    title?: string;
    summary?: string;
    impact?: string;
    stack?: string[];
  };
}

export default function DocmentisViewer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<UDocViewerInstance | null>(null);
  const clientRef = useRef<UDocClientInstance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentFile, setCurrentFile] = useState<string | null>(null);

  useEffect(() => {
    let client: UDocClientInstance | null = null;
    let viewer: UDocViewerInstance | null = null;

    const initViewer = async () => {
      try {
        client = await UDocClient.create();
        clientRef.current = client;

        if (containerRef.current) {
          viewer = await client.createViewer({
            container: containerRef.current,
          });
          viewerRef.current = viewer;
          
          // Load default document on startup
          await viewer.load("/pdf/nasa-hubble-fact-sheet-mission-operations.pdf");
          setCurrentFile("nasa-hubble-fact-sheet-mission-operations.pdf");
          
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Failed to initialize UDocClient:", err);
      }
    };

    initViewer();

    return () => {
      if (viewerRef.current) viewerRef.current.destroy();
      if (clientRef.current) clientRef.current.destroy();
    };
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && clientRef.current && containerRef.current) {
      setIsLoading(true);
      setCurrentFile(file.name);
      try {
        if (viewerRef.current) {
          viewerRef.current.destroy();
          viewerRef.current = null;
        }

        const newViewer = await clientRef.current.createViewer({
          container: containerRef.current,
        });
        viewerRef.current = newViewer;
        await newViewer.load(file);
      } catch (err) {
        console.error("Failed to load document:", err);
      } finally {
        setIsLoading(false);
        event.target.value = ''; // Reset input to allow re-uploading the same file
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full max-w-5xl mx-auto my-12" 
      style={{ fontFamily: '"Inter", sans-serif' }}
    >
      <div 
        className="relative rounded-3xl overflow-hidden p-[1px]"
        style={{
          background: "linear-gradient(180deg, rgba(56, 189, 248, 0.4) 0%, rgba(56, 189, 248, 0.0) 100%)",
          boxShadow: "0 30px 60px rgba(0,0,0,0.4), 0 0 40px rgba(56,189,248,0.1)"
        }}
      >
        <div className="absolute inset-0 bg-[var(--background)] opacity-90 rounded-3xl" />
        <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% 0%, rgba(56,189,248,0.15), transparent 70%)" }} />
        
        <div className="relative bg-[var(--panel-strong)]/80 backdrop-blur-2xl rounded-3xl overflow-hidden flex flex-col">
          
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between px-8 py-5 border-b border-[var(--cyan)]/20 bg-gradient-to-r from-[var(--cyan)]/5 to-transparent">
            <div className="flex items-center gap-4 mb-4 sm:mb-0">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-[var(--cyan)]/10 border border-[var(--cyan)]/30">
                <div className="w-2 h-2 rounded-full bg-[var(--cyan)] animate-pulse" style={{ boxShadow: "0 0 10px var(--cyan)" }} />
              </div>
              <div>
                <h3 className="text-white font-medium tracking-wide">Universal Render Engine</h3>
                <p className="text-[var(--cyan)] text-xs tracking-widest uppercase font-semibold opacity-70">Powered by Rust & WASM</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <AnimatePresence>
                {currentFile && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="hidden md:flex items-center gap-2 bg-black/40 px-4 py-1.5 rounded-full border border-white/5"
                  >
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest">Active File:</span>
                    <span className="text-white text-xs truncate max-w-[150px]">{currentFile}</span>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <label className="relative overflow-hidden group cursor-pointer">
                <div className="absolute inset-0 bg-[var(--cyan)] opacity-10 group-hover:opacity-20 transition-opacity" />
                <div className="px-6 py-2 border border-[var(--cyan)]/40 rounded-full flex items-center gap-2 transition-all">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <span className="text-[var(--cyan)] text-xs font-semibold tracking-widest uppercase">Upload</span>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".pdf,.docx,.pptx,.png,.jpg,.jpeg,.webp" 
                  onChange={handleFileUpload} 
                />
              </label>
            </div>
          </div>
          
          {/* Main Viewer Area */}
          <div className="relative w-full h-[700px] overflow-hidden bg-transparent">
            {/* Ambient Animated Gradient for the Loading Background */}
            {isLoading && (
              <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--cyan)]/5 via-transparent to-[var(--amber)]/5" />
                <motion.div 
                  animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
                  transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                  className="absolute inset-0 opacity-20"
                  style={{ 
                    backgroundImage: "radial-gradient(rgba(56,189,248,0.4) 1px, transparent 1px)",
                    backgroundSize: "40px 40px"
                  }} 
                />
              </div>
            )}
            
            {/* Loading Grid Overlay */}
            <AnimatePresence>
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#080808]/80 backdrop-blur-sm"
                >
                  <div className="relative flex items-center justify-center mb-6">
                    <motion.div 
                      animate={{ rotate: 360 }} 
                      transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                      className="absolute w-20 h-20 border-[1px] border-dashed border-[var(--cyan)]/30 rounded-full"
                    />
                    <motion.div 
                      animate={{ rotate: -360 }} 
                      transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                      className="absolute w-16 h-16 border-t-2 border-[var(--cyan)] rounded-full"
                    />
                    <div className="w-2 h-2 rounded-full bg-[var(--cyan)]" style={{ boxShadow: "0 0 15px var(--cyan)" }} />
                  </div>
                  <p className="text-[var(--cyan)] text-xs tracking-[0.3em] uppercase font-light">Compiling Wasm Matrix</p>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div 
              ref={containerRef} 
              className="udoc-viewer-container relative z-10 w-full h-full"
              style={{
                // Smooth fade-in once WASM is compiled and document loads
                opacity: isLoading ? 0 : 1,
                transition: "opacity 0.4s ease"
              }}
            />
            

          </div>
        </div>
      </div>
    </motion.div>
  );
}
