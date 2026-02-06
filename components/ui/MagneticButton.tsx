'use client';

import React, { useRef, useState, useEffect, useCallback, ReactNode } from 'react';

interface MagneticButtonProps {
    children: ReactNode;
    className?: string;
    strength?: number; // How much the button moves (default: 0.3 = 30% of distance)
    as?: 'button' | 'a' | 'div';
    href?: string;
    onClick?: () => void;
    disabled?: boolean;
    [key: string]: any; // Allow any additional props
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
    children,
    className = '',
    strength = 0.3,
    as: Component = 'button',
    href,
    onClick,
    disabled,
    ...props
}) => {
    const buttonRef = useRef<HTMLElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);
    const [isReducedMotion, setIsReducedMotion] = useState(false);
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    // Check for reduced motion preference and touch device
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setIsReducedMotion(mediaQuery.matches);

        const handleChange = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
        mediaQuery.addEventListener('change', handleChange);

        // Check for touch device
        setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);

        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!buttonRef.current || isReducedMotion || isTouchDevice) return;

        const rect = buttonRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const distanceX = e.clientX - centerX;
        const distanceY = e.clientY - centerY;

        setPosition({
            x: distanceX * strength,
            y: distanceY * strength
        });
    }, [strength, isReducedMotion, isTouchDevice]);

    const handleMouseEnter = useCallback(() => {
        if (!isReducedMotion && !isTouchDevice) {
            setIsHovered(true);
        }
    }, [isReducedMotion, isTouchDevice]);

    const handleMouseLeave = useCallback(() => {
        setIsHovered(false);
        setPosition({ x: 0, y: 0 });
    }, []);

    const style = {
        transform: isHovered ? `translate(${position.x}px, ${position.y}px)` : 'translate(0, 0)',
        transition: isHovered
            ? 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)'
            : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
    };

    const commonProps = {
        ref: buttonRef as any,
        className: `magnetic-button ${className}`,
        style,
        onMouseMove: handleMouseMove,
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
        onClick,
        disabled,
        ...props
    };

    if (Component === 'a' && href) {
        return (
            <a href={href} {...commonProps}>
                {children}
            </a>
        );
    }

    return (
        <Component {...commonProps}>
            {children}
        </Component>
    );
};

export default MagneticButton;
