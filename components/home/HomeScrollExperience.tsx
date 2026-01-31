'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import ScrollSequence from '@/components/ui/ScrollSequence';

// Luxury Easing
const LUXURY_EASE = [0.16, 1, 0.3, 1];

const CHAPTERS = [
    {
        label: "Chapter I",
        title: "Hidden in the Jungle",
        description: "Discover a sanctuary where the forest embraces our architecture."
    },
    {
        label: "Chapter II",
        title: "Sacred Silence",
        description: "Far from the crowds, the only soundtrack is the rhythm of nature."
    },
    {
        label: "Chapter III",
        title: "Timeless Rituals",
        description: "Experience ancient Balinese traditions woven into modern luxury."
    },
    {
        label: "Arrival",
        title: "Welcome Home",
        description: "Your private escape awaits in the heart of Ubud."
    }
];

export const HomeScrollExperience: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    // Scroll progress for the entire container
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Calculate which text to show based on scroll progress (0-1)
    // Divide into 4 segments: 0-0.25, 0.25-0.5, 0.5-0.75, 0.75-1
    const text1Opacity = useTransform(scrollYProgress, [0, 0.1, 0.2, 0.25], [0, 1, 1, 0]);
    const text1Y = useTransform(scrollYProgress, [0, 0.1, 0.2, 0.25], [30, 0, 0, -20]);

    const text2Opacity = useTransform(scrollYProgress, [0.25, 0.35, 0.45, 0.5], [0, 1, 1, 0]);
    const text2Y = useTransform(scrollYProgress, [0.25, 0.35, 0.45, 0.5], [30, 0, 0, -20]);

    const text3Opacity = useTransform(scrollYProgress, [0.5, 0.6, 0.7, 0.75], [0, 1, 1, 0]);
    const text3Y = useTransform(scrollYProgress, [0.5, 0.6, 0.7, 0.75], [30, 0, 0, -20]);

    const text4Opacity = useTransform(scrollYProgress, [0.75, 0.85, 0.95, 1], [0, 1, 1, 0]);
    const text4Y = useTransform(scrollYProgress, [0.75, 0.85, 0.95, 1], [30, 0, 0, -20]);

    const textConfigs = [
        { opacity: text1Opacity, y: text1Y },
        { opacity: text2Opacity, y: text2Y },
        { opacity: text3Opacity, y: text3Y },
        { opacity: text4Opacity, y: text4Y }
    ];

    return (
        <div ref={containerRef} className="relative">
            <ScrollSequence
                frameCount={150}
                folderPath="/imgseq"
                filePrefix="ezgif-frame-"
                fileExtension="jpg"
                scrollDistance="500%"
            >
                <div className="absolute inset-0 flex items-center justify-center text-center p-4">
                    {CHAPTERS.map((chapter, index) => (
                        <motion.div
                            key={index}
                            className="absolute max-w-lg"
                            style={{
                                opacity: textConfigs[index].opacity,
                                y: textConfigs[index].y
                            }}
                        >
                            <motion.span
                                className="block font-sans text-xs sm:text-sm font-bold uppercase tracking-[0.3em] text-sand/60 mb-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                {chapter.label}
                            </motion.span>
                            <h3 className="text-4xl md:text-6xl font-serif mb-6 text-sand drop-shadow-lg">
                                {chapter.title}
                            </h3>
                            <p className="text-lg md:text-xl font-sans text-sand/80 font-light leading-relaxed max-w-md mx-auto">
                                {chapter.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </ScrollSequence>

            {/* Scroll Progress Indicator */}
            <motion.div
                className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-forest/80 backdrop-blur-sm px-4 py-2 rounded-full"
                style={{ opacity: useTransform(scrollYProgress, [0, 0.05, 0.95, 1], [0, 1, 1, 0]) }}
            >
                <span className="text-sand/60 text-xs uppercase tracking-widest">Scroll</span>
                <div className="w-16 h-1 bg-sand/20 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-accent rounded-full"
                        style={{ width: useTransform(scrollYProgress, [0, 1], ['0%', '100%']) }}
                    />
                </div>
            </motion.div>
        </div>
    );
};

export default HomeScrollExperience;
