"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Activity, Zap, Navigation } from "lucide-react";

export default function InteractiveSwarm() {
  const [activeNode, setActiveNode] = useState<number | null>(null);
  const [telemetry, setTelemetry] = useState({ roll: 0, pitch: 0, yaw: 0, batt: 98 });

  const containerRef = useRef(null);
  const isInView = useInView(containerRef);

  useEffect(() => {
    if (activeNode !== null && isInView) {
      const interval = setInterval(() => {
        setTelemetry({
          roll: Number((Math.random() * 4 - 2).toFixed(2)),
          pitch: Number((Math.random() * 4 - 2).toFixed(2)),
          yaw: Number((Math.random() * 360).toFixed(1)),
          batt: Math.max(0, Number((98 - Math.random() * 2).toFixed(1)))
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [activeNode, isInView]);

  const nodes = [
    { id: 1, x: 20, y: 30 },
    { id: 2, x: 70, y: 20 },
    { id: 3, x: 50, y: 70 },
    { id: 4, x: 80, y: 60 },
  ];

  return (
    <div 
      ref={containerRef}
      style={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: '260px' }}
      onClick={(e) => e.stopPropagation()}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', paddingBottom: '0.6rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ display: 'flex', gap: '5px', marginRight: '4px' }}>
            <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'rgba(244,63,94,0.8)', display: 'inline-block' }} />
            <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'rgba(245,158,11,0.8)', display: 'inline-block' }} />
            <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'rgba(16,185,129,0.8)', display: 'inline-block' }} />
          </div>
          <span style={{ fontFamily: 'var(--font-mono, monospace)', color: 'var(--lime)', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '1px' }}>AEROMESH_FLIGHT_RADAR</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="pulse-dot" style={{ width: 8, height: 8, background: '#10b981' }} />
          <span style={{ fontSize: '0.82rem', color: 'var(--foreground)', fontWeight: 600, fontFamily: 'var(--font-mono, monospace)' }}>{activeNode ? `NODE_0${activeNode} ACTIVE` : 'SCANNING MESH...'}</span>
        </div>
      </div>

      <div style={{ flex: 1, position: 'relative', background: 'rgba(0,0,0,0.6)', borderRadius: '10px', border: '1px solid rgba(167,243,102,0.2)', overflow: 'hidden', minHeight: '170px' }}>
        {/* Radar grid */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        
        {nodes.map((node) => (
          <motion.div
            key={node.id}
            whileHover={{ scale: 1.25 }}
            onClick={() => setActiveNode(node.id === activeNode ? null : node.id)}
            style={{
              position: 'absolute',
              left: `${node.x}%`,
              top: `${node.y}%`,
              width: '20px',
              height: '20px',
              transform: 'translate(-50%, -50%)',
              cursor: 'pointer',
              zIndex: 2
            }}
          >
            <div style={{ 
              width: '100%', 
              height: '100%', 
              borderRadius: '50%', 
              background: activeNode === node.id ? 'var(--lime)' : 'rgba(255,255,255,0.3)',
              boxShadow: activeNode === node.id ? '0 0 15px var(--lime)' : 'none',
              transition: 'all 0.3s ease'
            }} />
            {activeNode === node.id && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 2.2, opacity: 0 }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid var(--lime)' }}
              />
            )}
          </motion.div>
        ))}

        {/* Connections */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          <line x1="20%" y1="30%" x2="50%" y2="70%" stroke="rgba(167,243,102,0.25)" strokeWidth="1.5" strokeDasharray="4 4" />
          <line x1="50%" y1="70%" x2="80%" y2="60%" stroke="rgba(167,243,102,0.25)" strokeWidth="1.5" strokeDasharray="4 4" />
          <line x1="70%" y1="20%" x2="80%" y2="60%" stroke="rgba(167,243,102,0.25)" strokeWidth="1.5" strokeDasharray="4 4" />
          <line x1="20%" y1="30%" x2="70%" y2="20%" stroke="rgba(167,243,102,0.25)" strokeWidth="1.5" strokeDasharray="4 4" />
        </svg>

        <AnimatePresence>
          {activeNode && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              style={{
                position: 'absolute',
                bottom: '10px',
                left: '10px',
                right: '10px',
                background: 'rgba(10,24,18,0.92)',
                border: '1px solid var(--lime)',
                borderRadius: '8px',
                padding: '0.85rem',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '0.75rem',
                backdropFilter: 'blur(8px)'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}><Activity size={12} /> ROLL/PITCH</span>
                <span style={{ color: 'white', fontFamily: 'var(--font-mono, monospace)', fontSize: '0.92rem', fontWeight: 700 }}>{telemetry.roll}° / {telemetry.pitch}°</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}><Navigation size={12} /> HEADING</span>
                <span style={{ color: 'white', fontFamily: 'var(--font-mono, monospace)', fontSize: '0.92rem', fontWeight: 700 }}>{telemetry.yaw}° N</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}><Zap size={12} /> VOLTAGE</span>
                <span style={{ color: '#10b981', fontFamily: 'var(--font-mono, monospace)', fontSize: '0.92rem', fontWeight: 700 }}>{telemetry.batt}%</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {!activeNode && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.5px' }}>Click any node on radar to inspect real-time telemetry</span>
          </div>
        )}
      </div>
    </div>
  );
}
