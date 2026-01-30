'use client';

import React from 'react';
import { Heart } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';

interface WishlistButtonProps {
    villaId: string;
    className?: string;
}

export const WishlistButton: React.FC<WishlistButtonProps> = ({ villaId, className = '' }) => {
    const { toggleWishlist, isInWishlist } = useWishlist();
    const isActive = isInWishlist(villaId);

    return (
        <button
            onClick={(e) => {
                e.preventDefault(); // Prevent link navigation
                e.stopPropagation();
                toggleWishlist(villaId);
            }}
            className={`group relative p-2 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 ${className}`}
            aria-label={isActive ? "Remove from wishlist" : "Add to wishlist"}
        >
            <div className={`absolute inset-0 bg-white/20 backdrop-blur-sm rounded-full transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />

            <Heart
                className={`relative z-10 w-5 h-5 transition-colors duration-300 ${isActive
                        ? 'fill-red-500 text-red-500'
                        : 'text-white fill-transparent group-hover:text-red-500'
                    }`}
            />
        </button>
    );
}; 
