'use client';

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils'; // Assuming you have a utils file for class mixing

interface OptimizedImageProps extends Omit<ImageProps, 'src'> {
    src: string;
    containerClassName?: string;
}

export function OptimizedImage({
    src,
    alt,
    className,
    containerClassName,
    ...props
}: OptimizedImageProps) {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div className={cn('relative overflow-hidden', containerClassName)}>
            <Image
                src={src}
                alt={alt}
                className={cn(
                    'duration-700 ease-in-out',
                    isLoading ? 'scale-105 blur-lg grayscale' : 'scale-100 blur-0 grayscale-0',
                    className
                )}
                onLoad={() => setIsLoading(false)}
                {...props}
            />
        </div>
    );
}
