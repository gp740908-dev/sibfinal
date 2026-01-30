'use client';

import React from 'react';
import { Leaf } from 'lucide-react';

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    eyebrow?: string;
    centered?: boolean;
    showDivider?: boolean;
    className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
    title,
    subtitle,
    eyebrow,
    centered = true,
    showDivider = true,
    className = '',
}) => {
    // Split title by asterisks for italic emphasis: "Featured *Villas*"
    const renderTitle = () => {
        const parts = title.split(/\*(.*?)\*/);
        return parts.map((part, i) =>
            i % 2 === 1 ? (
                <span key={i} className="italic font-light">
                    {part}
                </span>
            ) : (
                <span key={i}>{part}</span>
            )
        );
    };

    return (
        <div className={`${centered ? 'text-center' : ''} mb-16 ${className}`}>
            {eyebrow && (
                <span className="text-xs uppercase tracking-[0.3em] text-forest/50 mb-4 block font-sans">
                    {eyebrow}
                </span>
            )}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-forest leading-tight">
                {renderTitle()}
            </h2>
            {subtitle && (
                <p className="mt-4 text-text-body font-sans text-lg max-w-2xl mx-auto leading-relaxed">
                    {subtitle}
                </p>
            )}
            {showDivider && (
                <div className={`flex items-center gap-4 mt-8 ${centered ? 'justify-center' : ''}`}>
                    <span className="w-12 h-px bg-forest/20" />
                    <Leaf className="w-4 h-4 text-forest/30" />
                    <span className="w-12 h-px bg-forest/20" />
                </div>
            )}
        </div>
    );
};

export default SectionHeader;
