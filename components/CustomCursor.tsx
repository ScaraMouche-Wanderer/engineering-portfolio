"use client";

import { useEffect, useState, useRef } from "react";

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);
  const [isTextInput, setIsTextInput] = useState(false);

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: -100, y: -100, targetX: -100, targetY: -100 });
  const isRunning = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let animId = 0;

    const tick = () => {
      // Smooth lerp
      mouse.current.x += (mouse.current.targetX - mouse.current.x) * 0.28;
      mouse.current.y += (mouse.current.targetY - mouse.current.y) * 0.28;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouse.current.targetX}px, ${mouse.current.targetY}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${mouse.current.x}px, ${mouse.current.y}px, 0) translate(-50%, -50%)`;
      }

      const dx = Math.abs(mouse.current.targetX - mouse.current.x);
      const dy = Math.abs(mouse.current.targetY - mouse.current.y);

      if (dx > 0.05 || dy > 0.05) {
        animId = requestAnimationFrame(tick);
      } else {
        isRunning.current = false;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.targetX = e.clientX;
      mouse.current.targetY = e.clientY;

      setIsVisible(true);

      if (!isRunning.current) {
        isRunning.current = true;
        animId = requestAnimationFrame(tick);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const isText = !!target.closest("input, textarea, select, [contenteditable='true']");
      setIsTextInput(isText);

      const isClickable = !!target.closest(
        "a, button, [role='button'], .nav-pill, .reactive-button, .accordion-item, .bento-card, .timeline-item, .glow-text, .featured-pill, .minimal-link, .brand, .skill-group-items span"
      );
      setIsInteractive(isClickable && !isText);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("mouseover", handleMouseOver, { passive: true });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  const shouldHide = !isVisible || isTextInput;

  return (
    <>
      {/* Precision Center Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[99999]"
        style={{
          width: isInteractive ? "7px" : "4px",
          height: isInteractive ? "7px" : "4px",
          borderRadius: "50%",
          background: "var(--cyan, #58c4b6)",
          boxShadow: isInteractive ? "0 0 14px var(--cyan, #58c4b6), 0 0 4px #ffffff" : "0 0 8px var(--cyan, #58c4b6)",
          opacity: shouldHide ? 0 : 1,
          willChange: "transform, opacity",
          transition: "width 0.15s ease, height 0.15s ease, opacity 0.2s ease, box-shadow 0.15s ease"
        }}
      />
      {/* Magnetic Aura Outer Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[99998]"
        style={{
          width: isInteractive ? "38px" : "22px",
          height: isInteractive ? "38px" : "22px",
          borderRadius: "50%",
          border: isInteractive ? "1.5px solid var(--cyan, #58c4b6)" : "1px solid rgba(88, 196, 182, 0.4)",
          background: isInteractive ? "rgba(88, 196, 182, 0.12)" : "rgba(88, 196, 182, 0.02)",
          boxShadow: isInteractive ? "0 0 20px rgba(88, 196, 182, 0.3), inset 0 0 10px rgba(88, 196, 182, 0.1)" : "none",
          opacity: shouldHide ? 0 : 1,
          willChange: "transform, opacity",
          transition: "width 0.2s cubic-bezier(0.16, 1, 0.3, 1), height 0.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease, border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease"
        }}
      />
    </>
  );
}


