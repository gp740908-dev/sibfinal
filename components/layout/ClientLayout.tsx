'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from '../ui/Navbar';
import { Footer } from '../ui/Footer';
import { Preloader } from '../ui/Preloader';
import { SocialFab } from '../ui/SocialFab';
import { SmoothScroll } from '../SmoothScroll';

interface ClientLayoutProps {
    children: React.ReactNode;
}

export const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
    const pathname = usePathname();

    // Pages that should not show Navbar/Footer
    const isTransientPage = pathname === '/thank-you' || pathname === '/not-found';

    // Determine current view for Navbar styling
    const getCurrentView = () => {
        if (pathname === '/') return 'home';
        if (pathname.startsWith('/villas')) return 'villas';
        if (pathname.startsWith('/journal')) return 'journal';
        if (pathname === '/about') return 'about';
        if (pathname === '/experiences') return 'experiences';
        if (pathname === '/faq') return 'faq';
        if (pathname === '/privacy') return 'privacy';
        if (pathname === '/terms') return 'terms';
        return 'home';
    };

    return (
        <SmoothScroll>
            <Preloader />

            {!isTransientPage && (
                <Navbar currentView={getCurrentView()} />
            )}

            <div
                className={`relative z-10 w-full bg-sand flex flex-col ${isTransientPage
                        ? 'mb-0'
                        : 'mb-[450px] md:mb-[500px] shadow-[0_25px_50px_-12px_rgba(83,127,93,0.5)] rounded-b-[2rem] md:rounded-b-[3rem]'
                    } overflow-hidden min-h-screen origin-top`}
            >
                {children}
            </div>

            {!isTransientPage && <Footer />}

            <SocialFab />
        </SmoothScroll>
    );
};
