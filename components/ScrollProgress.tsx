"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

const CHAPTERS = [
  { id: "home", label: "01 HOME" },
  { id: "about", label: "02 ABOUT" },
  { id: "skills", label: "03 SKILLS" },
  { id: "education", label: "04 EDUCATION" },
  { id: "experience", label: "05 EXPERIENCE" },
  { id: "projects", label: "06 PROJECTS" },
  { id: "journey", label: "07 JOURNEY" },
  { id: "contact", label: "08 CONTACT" },
];

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const [percent, setPercent] = useState(0);
  const [activeSection, setActiveSection] = useState("home");
  const [isHovered, setIsHovered] = useState(false);

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    return scrollYProgress.on("change", (latest) => {
      setPercent(Math.round(latest * 100));

      // Calculate active section from scroll position
      const scrollPos = window.scrollY + window.innerHeight * 0.35;
      for (let i = CHAPTERS.length - 1; i >= 0; i--) {
        const el = document.getElementById(CHAPTERS[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(CHAPTERS[i].id);
          break;
        }
      }
    });
  }, [scrollYProgress]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Top Precision Neon Gradient Line */}
      <div 
        className="fixed top-0 left-0 right-0 z-[10000] pointer-events-none h-[3px] bg-white/5"
        style={{ transform: "translate3d(0,0,0)" }}
      >
        <motion.div
          className="h-full w-full origin-left bg-gradient-to-r from-cyan-400 via-lime-400 to-amber-400"
          style={{ 
            scaleX,
            boxShadow: "0 0 12px rgba(88, 196, 182, 0.6)"
          }}
        />
      </div>

      {/* Floating Right-Side Chapter Waypoint HUD (Desktop only) */}
      <div 
        className="fixed right-5 top-1/2 -translate-y-1/2 z-[90] hidden xl:flex flex-col items-end gap-2.5"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ pointerEvents: "auto" }}
      >
        {CHAPTERS.map((ch) => {
          const isActive = activeSection === ch.id;

          return (
            <button
              key={ch.id}
              onClick={() => scrollToSection(ch.id)}
              className="group flex items-center gap-2.5 transition-all duration-200"
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "2px 0"
              }}
              title={ch.label}
            >
              {/* Text Label on hover or active */}
              <span 
                className={`font-mono text-[10px] font-bold tracking-wider uppercase transition-all duration-200 ${
                  isActive 
                    ? "text-cyan-400 opacity-100 translate-x-0" 
                    : isHovered 
                    ? "text-slate-400 opacity-80 translate-x-0" 
                    : "opacity-0 translate-x-2 pointer-events-none"
                }`}
                style={{
                  textShadow: isActive ? "0 0 8px rgba(88, 196, 182, 0.5)" : "none"
                }}
              >
                {ch.label}
              </span>

              {/* Waypoint Dot/Bar */}
              <div 
                className={`transition-all duration-300 rounded-full ${
                  isActive 
                    ? "w-3.5 h-3.5 bg-cyan-400 shadow-[0_0_12px_rgba(88,196,182,0.8)] scale-110" 
                    : "w-1.5 h-1.5 bg-white/20 group-hover:bg-cyan-400/60 group-hover:scale-125"
                }`}
              />
            </button>
          );
        })}
      </div>
    </>
  );
}
