'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface KineticTextProps {
    text: string;
    className?: string;
    baseDelay?: number;
    letterDelay?: number;
}

export const KineticText: React.FC<KineticTextProps> = ({
    text,
    className = '',
    baseDelay = 0,
    letterDelay = 0.05,
}) => {
    // Split text into words to handle spacing correctly
    const words = text.split(' ');

    const letterVariants = {
        hidden: { y: '100%' },
        visible: (i: number) => ({
            y: 0,
            transition: {
                delay: baseDelay + i * letterDelay,
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1] as any, // Custom cubic-bezier for "luxury" feel
            },
        }),
    };

    return (
        <span className={`inline-flex flex-wrap overflow-hidden ${className}`} aria-label={text}>
            {text.split('').map((char, index) => (
                <span key={index} className="inline-block overflow-hidden" aria-hidden="true">
                    <motion.span
                        custom={index}
                        variants={letterVariants}
                        initial="hidden"
                        animate="visible"
                        className="inline-block"
                        whileHover={{
                            y: -5,
                            transition: { duration: 0.3, ease: 'easeOut' }
                        }}
                    >
                        {char === ' ' ? '\u00A0' : char}
                    </motion.span>
                </span>
            ))}
        </span>
    );
};
