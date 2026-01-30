'use client';

import React from 'react';
import { ShieldCheck, Clock, Award, RefreshCw } from 'lucide-react';

export const TrustBar: React.FC = () => {
    return (
        <section className="bg-sand/30 border-b border-forest/5 py-6 md:py-8">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="flex flex-wrap justify-center md:justify-between items-center gap-6 md:gap-8">

                    <TrustItem
                        icon={<ShieldCheck size={20} />}
                        label="Secure Booking"
                    />

                    <div className="hidden md:block w-px h-8 bg-forest/10"></div>

                    <TrustItem
                        icon={<Clock size={20} />}
                        label="24/7 Concierge"
                    />

                    <div className="hidden md:block w-px h-8 bg-forest/10"></div>

                    <TrustItem
                        icon={<Award size={20} />}
                        label="Verified Host"
                    />

                    <div className="hidden md:block w-px h-8 bg-forest/10"></div>

                    <TrustItem
                        icon={<RefreshCw size={20} />}
                        label="Free Cancellation*"
                    />

                </div>
            </div>
        </section>
    );
};

const TrustItem: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
    <div className="flex items-center gap-3 opacity-70 hover:opacity-100 transition-opacity cursor-default group">
        <div className="text-forest group-hover:text-accent-default transition-colors">
            {icon}
        </div>
        <span className="font-sans text-xs uppercase tracking-widest text-forest font-medium">
            {label}
        </span>
    </div>
);

export default TrustBar;
