'use client';

import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

interface ScrollSequenceProps {
    frameCount: number;
    folderPath: string;
    filePrefix: string;
    fileExtension?: string;
    scrollDistance?: string;
    className?: string; // Additional classes for the container
}

export default function ScrollSequence({
    frameCount,
    folderPath,
    filePrefix,
    fileExtension = 'jpg',
    scrollDistance = '300%', // Default scroll distance
    className = '',
}: ScrollSequenceProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const imagesRef = useRef<HTMLImageElement[]>([]);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);

    // 1. Preload Images
    useEffect(() => {
        const preloadImages = async () => {
            const promises = [];
            const loadedImages: HTMLImageElement[] = [];

            for (let i = 1; i <= frameCount; i++) {
                const promise = new Promise<void>((resolve, reject) => {
                    const img = new Image();
                    const formattedIndex = i.toString().padStart(3, '0');
                    img.src = `${folderPath}/${filePrefix}${formattedIndex}.${fileExtension}`;

                    img.onload = () => {
                        loadedImages[i - 1] = img; // Maintain order
                        setProgress((prev) => prev + (1 / frameCount) * 100);
                        resolve();
                    };
                    img.onerror = () => {
                        console.error(`Failed to load frame ${i}`);
                        resolve(); // Verify failure doesn't break entire sequence, maybe placeholders?
                    };
                });
                promises.push(promise);
            }

            await Promise.all(promises);
            imagesRef.current = loadedImages;
            setIsLoading(false);
        };

        preloadImages();
    }, [frameCount, folderPath, filePrefix, fileExtension]);


    // 2. Render Logic (Canvas + Object Fit Cover)
    const renderFrame = (index: number) => {
        const canvas = canvasRef.current;
        const ctx = contextRef.current;
        const img = imagesRef.current[index];

        if (!canvas || !ctx || !img) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Object-Fit: Cover Logic
        // Calculate the scale needed to cover the canvas
        const scale = Math.max(canvas.width / img.width, canvas.height / img.height);

        // Calculate centered position
        const x = (canvas.width / 2) - (img.width / 2) * scale;
        const y = (canvas.height / 2) - (img.height / 2) * scale;

        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
    };


    // 3. Setup Canvas & Resize Listener
    useEffect(() => {
        if (!canvasRef.current) return;

        contextRef.current = canvasRef.current.getContext('2d');

        const handleResize = () => {
            if (canvasRef.current) {
                canvasRef.current.width = window.innerWidth;
                canvasRef.current.height = window.innerHeight;
                // Re-render current frame on resize (if loaded)
                if (imagesRef.current.length > 0) {
                    // We might need access to current playhead here, but usually it's fine 
                    // providing we re-render inside the GSAP loop or separate global state.
                    // For now, let GSAP handle the next tick or just render frame 0 if static.
                }
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Init size

        return () => window.removeEventListener('resize', handleResize);
    }, []);


    // 4. GSAP Animation
    useGSAP(() => {
        if (isLoading || imagesRef.current.length === 0) return;

        const playhead = { frame: 0 };

        const anim = gsap.to(playhead, {
            frame: frameCount - 1,
            snap: 'frame', // Snaps to integer frames
            ease: 'none',
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top top',
                end: `bottom+=${scrollDistance} bottom`, // Pin duration
                scrub: 0.5, // Smooth scrubbing
                pin: true,
                // markers: true, // Debug markers
            },
            onUpdate: () => {
                renderFrame(Math.round(playhead.frame));
            },
        });

        // Initial Render
        renderFrame(0);

    }, { scope: containerRef, dependencies: [isLoading, frameCount, scrollDistance] });


    return (
        <div ref={containerRef} className={`relative w-full h-[100vh] bg-black overflow-hidden ${className}`}>

            {/* Canvas Layer */}
            <canvas
                ref={canvasRef}
                className="block fixed top-0 left-0 w-full h-full object-cover"
                style={{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.5s ease-in-out' }}
            />

            {/* Loading Overlay */}
            {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-50 bg-black">
                    <p className="mb-4 font-serif text-xl tracking-widest animate-pulse">LOADING EXPERIENCE</p>
                    <div className="w-64 h-1 bg-white/20 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-white transition-all duration-100 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <p className="mt-2 text-xs font-mono text-white/50">{Math.round(progress)}%</p>
                </div>
            )}

            {/* Optional: Overlay Content Slot via Children? Or just pure sequence */}
        </div>
    );
}
