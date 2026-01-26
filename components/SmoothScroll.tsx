'use client';

import React, { useEffect, useRef, useState } from 'react';
import ReactLenis from '@studio-freight/react-lenis';

interface SmoothScrollProps {
  children: React.ReactNode;
}

// Configuration for that "heavy, luxury" feel
const lenisOptions = {
  lerp: 0.1,
  duration: 1.5,
  smoothWheel: true,
  wheelMultiplier: 1,
};

export const SmoothScroll: React.FC<SmoothScrollProps> = ({ children }) => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Only enable on larger screens to preserve native mobile performance (Score 100)
    // Mobile browsers have excellent native momentum scrolling that JS libraries often degrade
    const checkDevice = () => {
      setIsDesktop(window.innerWidth > 1024);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  if (!isDesktop) {
    // Return native scroll/layout for mobile
    return <>{children}</>;
  }

  return (
    <ReactLenis root options={lenisOptions}>
      {children}
    </ReactLenis>
  );
};