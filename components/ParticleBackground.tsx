"use client";

import { useEffect, useRef, memo } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  alphaPhase: number;
}

function ParticleBackgroundComponent({ theme = "dark" }: { activeSection?: string; theme?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const isLight = theme === "light";

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize, { passive: true });

    const particleCount = isLight ? 14 : 22;
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        radius: Math.random() * 1.3 + 0.6,
        baseAlpha: isLight ? Math.random() * 0.08 + 0.03 : Math.random() * 0.22 + 0.08,
        alphaPhase: Math.random() * Math.PI * 2
      });
    }

    const render = () => {
      if (document.hidden) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;
        p.alphaPhase += 0.02;

        if (p.x < -10) p.x = width + 10;
        else if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        else if (p.y > height + 10) p.y = -10;

        const dynamicAlpha = p.baseAlpha + Math.sin(p.alphaPhase) * 0.04;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

        if (isLight) {
          ctx.fillStyle = `rgba(59, 107, 99, ${Math.max(0.01, dynamicAlpha)})`;
        } else {
          ctx.fillStyle = `rgba(88, 196, 182, ${Math.max(0.03, dynamicAlpha)})`;
        }

        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none -z-10"
      style={{
        transform: "translate3d(0,0,0)",
        willChange: "transform",
        backfaceVisibility: "hidden"
      }}
    />
  );
}

const ParticleBackground = memo(ParticleBackgroundComponent);
export default ParticleBackground;

