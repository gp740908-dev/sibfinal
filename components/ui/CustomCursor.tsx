'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';

interface CursorPosition {
    x: number;
    y: number;
}

export const CustomCursor: React.FC = () => {
    const [position, setPosition] = useState<CursorPosition>({ x: 0, y: 0 });
    const [followerPosition, setFollowerPosition] = useState<CursorPosition>({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [isClicking, setIsClicking] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isTouchDevice, setIsTouchDevice] = useState(true); // Default true to hide initially

    const rafRef = useRef<number | null>(null);
    const targetPosition = useRef<CursorPosition>({ x: 0, y: 0 });

    // Check for touch device and reduced motion
    useEffect(() => {
        const isTouchCapable = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        setIsTouchDevice(isTouchCapable || prefersReducedMotion);
    }, []);

    // Smooth follower animation using requestAnimationFrame
    const animateFollower = useCallback(() => {
        const lerp = (start: number, end: number, factor: number) => {
            return start + (end - start) * factor;
        };

        setFollowerPosition(prev => ({
            x: lerp(prev.x, targetPosition.current.x, 0.1),
            y: lerp(prev.y, targetPosition.current.y, 0.1)
        }));

        rafRef.current = requestAnimationFrame(animateFollower);
    }, []);

    useEffect(() => {
        if (isTouchDevice) return;

        rafRef.current = requestAnimationFrame(animateFollower);
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [animateFollower, isTouchDevice]);

    // Mouse move handler
    const handleMouseMove = useCallback((e: MouseEvent) => {
        const { clientX, clientY } = e;
        setPosition({ x: clientX, y: clientY });
        targetPosition.current = { x: clientX, y: clientY };
        setIsVisible(true);
    }, []);

    // Hover detection
    const handleMouseOver = useCallback((e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const isInteractive =
            target.closest('a') ||
            target.closest('button') ||
            target.closest('[role="button"]') ||
            target.closest('.magnetic-button') ||
            target.closest('input') ||
            target.closest('textarea') ||
            target.closest('[data-cursor-hover]');

        setIsHovering(!!isInteractive);
    }, []);

    // Click handlers
    const handleMouseDown = useCallback(() => setIsClicking(true), []);
    const handleMouseUp = useCallback(() => setIsClicking(false), []);

    // Hide when leaving window
    const handleMouseLeave = useCallback(() => setIsVisible(false), []);
    const handleMouseEnter = useCallback(() => setIsVisible(true), []);

    useEffect(() => {
        if (isTouchDevice) return;

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseover', handleMouseOver);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        document.documentElement.addEventListener('mouseleave', handleMouseLeave);
        document.documentElement.addEventListener('mouseenter', handleMouseEnter);

        // Add custom cursor style to body
        document.body.style.cursor = 'none';

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseover', handleMouseOver);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
            document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
            document.body.style.cursor = '';
        };
    }, [handleMouseMove, handleMouseOver, handleMouseDown, handleMouseUp, handleMouseLeave, handleMouseEnter, isTouchDevice]);

    // Don't render on touch devices
    if (isTouchDevice) return null;

    return (
        <>
            {/* Main cursor dot */}
            <div
                className={`fixed pointer-events-none z-[9999] transition-transform duration-75 mix-blend-difference ${isVisible ? 'opacity-100' : 'opacity-0'
                    }`}
                style={{
                    left: position.x,
                    top: position.y,
                    transform: `translate(-50%, -50%) scale(${isClicking ? 0.8 : isHovering ? 0.5 : 1})`,
                }}
            >
                <div
                    className={`w-3 h-3 rounded-full bg-sand transition-all duration-200 ${isHovering ? 'scale-150' : 'scale-100'
                        }`}
                />
            </div>

            {/* Follower blob */}
            <div
                className={`fixed pointer-events-none z-[9998] transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'
                    }`}
                style={{
                    left: followerPosition.x,
                    top: followerPosition.y,
                    transform: `translate(-50%, -50%)`,
                }}
            >
                <div
                    className={`rounded-full border border-sand/40 transition-all duration-500 ease-out ${isHovering
                            ? 'w-16 h-16 bg-sand/5'
                            : isClicking
                                ? 'w-6 h-6'
                                : 'w-10 h-10'
                        }`}
                    style={{
                        backdropFilter: isHovering ? 'blur(4px)' : 'none',
                    }}
                />
            </div>

            {/* Global cursor hide style */}
            <style jsx global>{`
        * {
          cursor: none !important;
        }
        a, button, [role="button"], input, textarea, select {
          cursor: none !important;
        }
      `}</style>
        </>
    );
};

export default CustomCursor;
