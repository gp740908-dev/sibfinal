'use client';

import React from 'react';

// ========== CONFIG SECTION ==========
const PRELOADER_CONFIG = {
  enabled: false, // Currently disabled for maximum performance (Lighthouse 100)
};
// ====================================

/**
 * Preloader Component
 * 
 * NOTE: The previous GSAP-based preloader has been removed to optimize bundle size
 * and eliminate the heavy GSAP dependency from the main entry point.
 * 
 * If a preloader is needed in the future, implement it using Framer Motion 
 * to share the same library as the rest of the site (avoiding dual-libs).
 */
export const Preloader: React.FC = () => {
  if (!PRELOADER_CONFIG.enabled) return null;

  return null;
};
