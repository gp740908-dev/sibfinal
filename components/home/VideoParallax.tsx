'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';

// Luxury Easing
const LUXURY_EASE = [0.16, 1, 0.3, 1];

export const VideoParallax: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Framer Motion scroll-linked parallax
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Image parallax: moves slower than scroll
  const imageY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1.05, 1.1]);

  // Text reveal based on scroll
  const textOpacity = useTransform(scrollYProgress, [0.2, 0.4, 0.6, 0.8], [0, 1, 1, 0]);
  const textY = useTransform(scrollYProgress, [0.2, 0.4, 0.6, 0.8], [30, 0, 0, -30]);
  const textBlur = useTransform(scrollYProgress, [0.2, 0.35, 0.65, 0.8], [8, 0, 0, 8]);
  const textScale = useTransform(scrollYProgress, [0.2, 0.4, 0.6, 0.8], [0.95, 1, 1, 0.95]);

  return (
    <section
      ref={sectionRef}
      className="relative h-[80vh] w-full overflow-hidden bg-forest flex items-center justify-center"
    >
      {/* Image Background Layer - Framer Motion Parallax */}
      <div className="absolute inset-0 z-0 w-full h-full overflow-hidden">
        <motion.div
          className="relative w-full h-[120%] -top-[10%]"
          style={{
            y: imageY,
            scale: imageScale
          }}
        >
          <Image
            src="/imagehomepage/imagelaut.webp"
            alt="Bali ocean view"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </motion.div>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-forest/40 mix-blend-multiply"></div>
      </div>

      {/* Centered Text Content - Scroll-linked animation */}
      <motion.div
        className="relative z-10 text-center px-6 mix-blend-screen"
        style={{
          opacity: textOpacity,
          y: textY,
          scale: textScale,
          filter: useTransform(textBlur, (v) => `blur(${v}px)`)
        }}
      >
        <h2 className="font-serif italic text-5xl md:text-7xl lg:text-9xl text-sand leading-[1.1] tracking-tight text-shadow-lg">
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: LUXURY_EASE, delay: 0 }}
          >
            Time stands still
          </motion.span>
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: LUXURY_EASE, delay: 0.1 }}
          >
            in the heart
          </motion.span>
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: LUXURY_EASE, delay: 0.2 }}
          >
            of the jungle.
          </motion.span>
        </h2>
      </motion.div>

    </section>
  );
};

export default VideoParallax;