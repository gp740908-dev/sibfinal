'use client';

import React from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    href?: string;
    external?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
    primary: `
    bg-forest text-sand border border-forest
    hover:bg-forest-dark hover:border-forest-dark
    active:scale-[0.98] shadow-md hover:shadow-lg
  `,
    secondary: `
    bg-transparent text-forest border border-forest
    hover:bg-forest hover:text-sand
    active:scale-[0.98]
  `,
    ghost: `
    bg-transparent text-forest border-none
    hover:text-accent underline-offset-4 hover:underline
  `,
    outline: `
    bg-transparent text-sand border border-sand/50
    hover:bg-sand/10 hover:border-sand
    active:scale-[0.98]
  `,
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: 'px-4 py-2 text-xs tracking-wider',
    md: 'px-6 py-3 text-sm tracking-widest',
    lg: 'px-10 py-4 text-sm tracking-[0.2em]',
};

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    href,
    external,
    children,
    className = '',
    disabled,
    ...props
}) => {
    const baseStyles = `
    inline-flex items-center justify-center gap-2
    font-sans uppercase font-medium
    transition-all duration-300
    disabled:opacity-50 disabled:pointer-events-none
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2
  `;

    const combinedStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

    const content = (
        <>
            {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                leftIcon
            )}
            {children}
            {!isLoading && rightIcon}
        </>
    );

    // Render as Link if href is provided
    if (href) {
        if (external) {
            return (
                <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={combinedStyles}
                >
                    {content}
                </a>
            );
        }
        return (
            <Link href={href} className={combinedStyles}>
                {content}
            </Link>
        );
    }

    return (
        <button
            className={combinedStyles}
            disabled={disabled || isLoading}
            {...props}
        >
            {content}
        </button>
    );
};

export default Button;
