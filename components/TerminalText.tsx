"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function TerminalText({ text }: { text: string }) {
  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[index]);
        setIndex((i) => i + 1);
      }, 40 + Math.random() * 30);
      return () => clearTimeout(timeout);
    }
  }, [index, text]);

  return (
    <span style={{ display: 'inline-block', position: 'relative' }}>
      <span style={{ 
        background: 'linear-gradient(90deg, #ffffff 0%, var(--cyan) 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textShadow: '0 0 20px rgba(111, 255, 233, 0.4)',
        fontWeight: 'bold',
        letterSpacing: '-0.02em'
      }}>
        {displayText}
      </span>
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        style={{
          display: 'inline-block',
          width: 'clamp(3px, 0.5vw, 6px)',
          height: '1em',
          backgroundColor: 'var(--cyan)',
          marginLeft: '8px',
          verticalAlign: 'text-bottom',
          boxShadow: '0 0 10px var(--cyan)'
        }}
      />
    </span>
  );
}
