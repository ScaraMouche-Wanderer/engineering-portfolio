"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";

export default function ScrambleText({ text }: { text: string }) {
  const [displayText, setDisplayText] = useState(text);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startAnimation = useCallback(() => {
    let iteration = 0;
    
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    intervalRef.current = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return text[index];
            }
            if (letter === " ") return " ";
            return LETTERS[Math.floor(Math.random() * LETTERS.length)];
          })
          .join("")
      );
      
      if (iteration >= text.length) { 
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
      
      iteration += 1 / 2;
    }, 30);
  }, [text]);

  useEffect(() => {
    startAnimation();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startAnimation]);

  return (
    <motion.span 
      onHoverStart={() => {
        setIsHovered(true);
        startAnimation();
      }}
      onHoverEnd={() => setIsHovered(false)}
      style={{
        display: 'inline-block',
        fontFamily: "var(--font-mono, 'JetBrains Mono', 'Fira Code', monospace)",
        fontWeight: 700,
        textTransform: 'uppercase',
        color: isHovered ? 'var(--orange)' : 'var(--cyan)',
        transition: 'color 0.3s ease',
        cursor: "crosshair",
        letterSpacing: '0.04em'
      }}
    >
      {displayText}
    </motion.span>
  );
}
