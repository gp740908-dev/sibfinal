'use client';

import React, { useState, useId } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    helperText?: string;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    helperText,
    className = '',
    ...props
}) => {
    const id = useId();
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = props.value !== undefined && props.value !== '';

    return (
        <div className={`relative ${className}`}>
            <input
                id={id}
                className={`
          peer w-full bg-transparent
          border-b-2 pt-6 pb-2 px-0
          text-forest-dark font-sans text-base
          placeholder-transparent
          transition-colors duration-300
          focus:outline-none
          ${error
                        ? 'border-red-500 focus:border-red-600'
                        : 'border-forest/20 focus:border-forest'
                    }
        `}
                placeholder={label}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                {...props}
            />
            <label
                htmlFor={id}
                className={`
          absolute left-0 transition-all duration-300 pointer-events-none font-sans
          ${isFocused || hasValue
                        ? 'top-0 text-xs text-forest'
                        : 'top-5 text-base text-forest/50'
                    }
          ${error ? 'text-red-500' : ''}
        `}
            >
                {label}
            </label>
            {(error || helperText) && (
                <p className={`mt-2 text-xs ${error ? 'text-red-500' : 'text-forest/50'}`}>
                    {error || helperText}
                </p>
            )}
        </div>
    );
};

// Textarea variant
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    error?: string;
    helperText?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
    label,
    error,
    helperText,
    className = '',
    ...props
}) => {
    const id = useId();
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = props.value !== undefined && props.value !== '';

    return (
        <div className={`relative ${className}`}>
            <textarea
                id={id}
                className={`
          peer w-full bg-transparent
          border-2 rounded-lg pt-8 pb-3 px-4
          text-forest-dark font-sans text-base
          placeholder-transparent resize-none
          transition-colors duration-300
          focus:outline-none min-h-[120px]
          ${error
                        ? 'border-red-500 focus:border-red-600'
                        : 'border-forest/20 focus:border-forest'
                    }
        `}
                placeholder={label}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                {...props}
            />
            <label
                htmlFor={id}
                className={`
          absolute left-4 transition-all duration-300 pointer-events-none font-sans
          ${isFocused || hasValue
                        ? 'top-2 text-xs text-forest'
                        : 'top-5 text-base text-forest/50'
                    }
          ${error ? 'text-red-500' : ''}
        `}
            >
                {label}
            </label>
            {(error || helperText) && (
                <p className={`mt-2 text-xs ${error ? 'text-red-500' : 'text-forest/50'}`}>
                    {error || helperText}
                </p>
            )}
        </div>
    );
};

export default Input;
