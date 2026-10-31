'use client';

import { useEffect, useState } from 'react';
import ParticleBackground from './ParticleBackground';

export default function DetailParticleWrapper() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('light') ? 'light' : 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    // Observe html class changes to stay in sync
    const observer = new MutationObserver(() => {
      const isLightNow = document.documentElement.classList.contains('light');
      setTheme(isLightNow ? 'light' : 'dark');
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return <ParticleBackground activeSection="home" theme={theme} />;
}
