'use client';

import React, { useEffect, useRef } from 'react';
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
  return (
    <ReactLenis root options={lenisOptions}>
      {children}
    </ReactLenis>
  );
};