'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Villa } from '../../types';
import { ArrowRight } from 'lucide-react';

interface VillaShowcaseProps {
  villas: Villa[];
}

export const VillaShowcase: React.FC<VillaShowcaseProps> = ({ villas }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for prev, 1 for next
  const [cursorText, setCursorText] = useState<'PREV' | 'VIEW' | 'NEXT'>('VIEW');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Guard clause for empty data
  if (!villas || villas.length === 0) return null;

  const activeVilla = villas[currentIndex];

  // Helper to get secondary image for the floating detail
  // Try to find an interior shot or just use the second image, fallback to main
  const detailImage = activeVilla.images && activeVilla.images.length > 1
    ? activeVilla.images[1]
    : activeVilla.imageUrl;

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % villas.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + villas.length) % villas.length);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const { left, width, top } = containerRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    setMousePos({ x, y });

    // Determine zone
    const widthPercent = x / width;
    if (widthPercent < 0.3) {
      setCursorText('PREV');
    } else if (widthPercent > 0.7) {
      setCursorText('NEXT');
    } else {
      setCursorText('VIEW');
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Prevent navigation if clicking the actual button (handled by Link)
    if ((e.target as HTMLElement).closest('a')) return;

    if (cursorText === 'PREV') handlePrev();
    if (cursorText === 'NEXT') handleNext();
    if (cursorText === 'VIEW') {
      // Programmatic navigation or just let the user click the button?
      // The plan says "Click Center -> Navigates", so we'll push router or simple link.
      // But for better UX, let's keep the center click as "Go to Details"
      // We can use a hidden link or router, but let's assume the user might click the text.
      // For now, let's just trigger the link click programmatically or use router.
      // Actually, let's rely on the huge invisible link overlay or just push.
      const link = document.getElementById(`view-link-${activeVilla.id}`);
      link?.click();
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price).replace('Rp', 'Rp ').replace(',00', ',-');
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen bg-forest-dark overflow-hidden cursor-none group"
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      onMouseLeave={() => setMousePos({ x: -100, y: -100 })} // Hide cursor
    >
      {/* 1. Background Image Slider */}
      {villas.map((villa, index) => (
        <div
          key={villa.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
        >
          <Image
            src={villa.imageUrl}
            alt={villa.name}
            fill
            className="object-cover"
            priority={index === 0}
            sizes="100vw"
          />
          {/* Dark Overlay for Text Readability */}
          <div className="absolute inset-0 bg-black/40" />
        </div>
      ))}

      {/* 2. Top Pagination */}
      <div className="absolute top-12 left-0 right-0 z-30 flex justify-center items-center">
        <div className="flex items-center gap-4 text-sand-light font-sans text-sm tracking-widest">
          <span>{currentIndex + 1}</span>
          <span className="w-12 h-px bg-sand-light/50"></span>
          <span>{villas.length}</span>
        </div>
      </div>

      {/* 3. Center Content (Typography) */}
      <div className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center text-sand-light px-4 pointer-events-none">

        {/* Floating Animation Container for Content */}
        <div className="animate-fade-in-up">
          <h3 className="font-sans text-sm md:text-base uppercase tracking-[0.2em] mb-4 opacity-90">
            Sleeps {activeVilla.guests} Adults &mdash; {activeVilla.features?.[0] || 'Luxury Pool'}
          </h3>

          <h2 className="font-serif text-6xl md:text-8xl lg:text-9xl mb-6 tracking-tight leading-none text-white drop-shadow-lg">
            {activeVilla.name}
          </h2>

          {/* Hidden Link for programmatic click */}
          <Link
            id={`view-link-${activeVilla.id}`}
            href={`/villas/${activeVilla.id}`}
            className="hidden"
          />
        </div>
      </div>

      {/* 4. Floating Detail Image (Bottom Center) */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-40 translate-y-1/4 pointer-events-none md:pointer-events-auto">
        <div className="relative w-48 h-64 md:w-64 md:h-80 overflow-hidden rounded-t-full border-4 border-white/10 shadow-2xl animate-fade-in-up transition-transform duration-700 hover:-translate-y-4">
          <Image
            key={`detail-${activeVilla.id}`}
            src={detailImage}
            alt="Interior Detail"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 192px, 256px"
          />
        </div>
      </div>

      {/* 5. Custom Cursor (Local) */}
      <div
        className="fixed z-50 pointer-events-none hidden md:flex items-center justify-center transition-opacity duration-300"
        style={{
          left: mousePos.x,
          top: mousePos.y + 80, // Offset to not cover text exactly if needed, but usually centered is better.
          // Actually, let's use fixed positioning based on clientX/Y if we used client coordinates.
          // But we used relative coordinates in handleMouseMove.
          // Let's fix this: handleMouseMove uses clientX/Y for fixed elements.
        }}
      >
        {/* 
            Wait, I used relative coordinates for the logic, but for a FIXED element I need client coordinates.
            Let's re-check handleMouseMove. 
            I stored relative X/Y in mousePos. 
            If the container is sticky or scrolled, fixed is safer.
            But wait, the container is `relative h-screen`.
            Let's just use a simplified approach: The cursor is ABSOLUTE inside the container? 
            No, if the container is overflow-hidden, the cursor might get clipped if it's large.
            Fixed is better. I'll need client coordinates.
         */}
      </div>
    </section>
  );
};

// Re-implementing with client coordinates for the cursor
export default function VillaShowcaseWrapper({ villas }: VillaShowcaseProps) {
  // Wrapper to handle client-side logic cleanly if needed, but main component is fine.
  // Let's overwrite the file with the corrected logic below.
  return <VillaShowcaseMain villas={villas} />;
}

const VillaShowcaseMain: React.FC<VillaShowcaseProps> = ({ villas }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cursorText, setCursorText] = useState<'PREV' | 'VIEW' | 'NEXT'>('VIEW');
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 }); // Start off-screen
  const containerRef = useRef<HTMLDivElement>(null);

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  if (!villas || villas.length === 0) return null;
  const activeVilla = villas[currentIndex];

  // Detail image fallback
  const detailImage = activeVilla.images && activeVilla.images.length > 1
    ? activeVilla.images[1]
    : activeVilla.imageUrl;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % villas.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + villas.length) % villas.length);
  };

  // Touch Handlers for Swipe
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Tracking client coordinates for the fixed cursor
    setMousePos({ x: e.clientX, y: e.clientY });

    // Zone detection logic (using bounding box)
    if (containerRef.current) {
      const { left, width } = containerRef.current.getBoundingClientRect();
      const relativeX = e.clientX - left;
      const widthPercent = relativeX / width;

      if (widthPercent < 0.3) setCursorText('PREV');
      else if (widthPercent > 0.7) setCursorText('NEXT');
      else setCursorText('VIEW');
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('a')) return;

    // On touch devices, click might trigger after touchend
    // We should treat click as 'VIEW' only if it wasn't a swipe
    // But since we use simple logic, let's assume tap

    if (cursorText === 'PREV') handlePrev();
    if (cursorText === 'NEXT') handleNext();
    if (cursorText === 'VIEW') {
      // Navigate
      const link = document.getElementById(`view-link-${activeVilla.id}`);
      link?.click();
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price).replace('Rp', 'Rp ').replace(',00', ',-');
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[90vh] md:h-screen bg-forest-dark overflow-hidden cursor-none group"
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      onMouseLeave={() => setMousePos({ x: -100, y: -100 })}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Background Images */}
      {villas.map((villa, index) => (
        <div
          key={villa.id}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
        >
          <Image
            src={villa.imageUrl}
            alt={villa.name}
            fill
            className="object-cover"
            priority={index === 0}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/30 md:bg-black/20" /> {/* Scrim */}
        </div>
      ))}

      {/* Top Pagination */}
      <div className="absolute top-12 left-0 right-0 z-30 flex justify-center animate-fade-in">
        <div className="flex items-center gap-6 text-white/90 font-serif italic text-lg tracking-widest">
          <span>{currentIndex + 1}</span>
          <span className="w-16 h-[1px] bg-white/60"></span>
          <span>{villas.length}</span>
        </div>
      </div>

      {/* Center Typography */}
      <div className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center px-4 pointer-events-none select-none">

        <div key={activeVilla.id} className="animate-fade-in-up flex flex-col items-center">
          <span className="font-sans text-xs md:text-sm uppercase tracking-[0.3em] mb-6 text-white/90 drop-shadow-md">
            Sleeps {activeVilla.guests} Adults &mdash; {activeVilla.features?.[0] || 'Private Pool'}
          </span>

          <h2 className="font-serif text-5xl md:text-8xl lg:text-[9rem] mb-2 tracking-tighter leading-none text-white drop-shadow-xl mix-blend-overlay opacity-90">
            {activeVilla.name}
          </h2>

          <div className="font-sans text-sm md:text-base tracking-widest text-white/80 mb-6 flex items-center gap-2">
            <span>Start from</span>
            <span className="font-serif text-xl italic text-white">{formatPrice(activeVilla.pricePerNight)}</span>
          </div>

          <div className="mt-2 overflow-hidden">
            <Link
              id={`view-link-${activeVilla.id}`}
              href={`/villas/${activeVilla.id}`}
              className="pointer-events-auto inline-flex items-center gap-2 text-white border-b border-white/50 pb-1 hover:border-white transition-all uppercase tracking-widest text-xs"
            >
              View Details <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* Floating Detail Image (Bottom) */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-40 translate-y-[15%] pointer-events-none">
        <div className="relative w-40 h-56 md:w-56 md:h-72 overflow-hidden rounded-t-[100px] border-4 border-white/10 shadow-2xl animate-fade-in-up">
          {/* Key changes to force re-render animation on slide change */}
          <Image
            key={`detail-${activeVilla.id}`}
            src={detailImage}
            alt={`${activeVilla.name} detail`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 160px, 224px"
          />
        </div>
      </div>

      {/* Custom Cursor */}
      <div
        className="fixed z-50 pointer-events-none hidden md:flex flex-col items-center justify-center gap-2 mix-blend-difference text-white transition-opacity duration-200"
        style={{
          left: mousePos.x,
          top: mousePos.y,
          transform: 'translate(-50%, -50%)',
          opacity: mousePos.x < 0 ? 0 : 1
        }}
      >
        <div className={`
            backdrop-blur-md bg-white/20 border border-white/30 rounded-full px-6 py-2 
            transition-all duration-300 ease-out
            ${cursorText === 'VIEW' ? 'scale-110 bg-white/30' : 'scale-100'}
        `}>
          <span className="font-sans text-xs font-bold tracking-widest">
            {cursorText}
          </span>
        </div>
      </div>
    </section>
  );
};