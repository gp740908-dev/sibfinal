'use client';

import React, { useState, useEffect } from 'react';
import { User, MapPin } from 'lucide-react';

const LOCATIONS = ['London', 'Sydney', 'Jakarta', 'Singapore', 'Melbourne', 'New York', 'Paris', 'Dubai'];
const VILLAS = ['Estate of Zen', 'Valley Horizons', 'Royal Jungle Suite', 'Forest Canopy'];
const TIMES = ['2 mins ago', '15 mins ago', 'Just now', '5 mins ago', '1 hour ago'];

export const BookingNotification: React.FC = () => {
    const [visible, setVisible] = useState(false);
    const [data, setData] = useState({ location: '', villa: '', time: '' });

    useEffect(() => {
        // Initial delay before showing first notification
        const initialTimer = setTimeout(() => {
            showNotification();
        }, 8000); // 8 seconds delay

        return () => clearTimeout(initialTimer);
    }, []);

    const showNotification = () => {
        // Randomize Content
        setData({
            location: LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)],
            villa: VILLAS[Math.floor(Math.random() * VILLAS.length)],
            time: TIMES[Math.floor(Math.random() * TIMES.length)],
        });

        setVisible(true);

        // Hide after 6 seconds
        setTimeout(() => {
            setVisible(false);

            // Schedule next notification (random between 15-30s)
            setTimeout(showNotification, Math.random() * 15000 + 15000);
        }, 6000);
    };

    if (!visible) return null;

    return (
        <div className="fixed bottom-4 left-4 z-40 animate-slide-up">
            <div className="bg-white/95 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-sand/20 rounded-lg p-4 max-w-[300px] flex items-center gap-4 transition-all hover:scale-[1.02]">
                <div className="w-10 h-10 rounded-full bg-forest/10 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-forest" />
                </div>
                <div>
                    <p className="text-sm font-medium text-forest-dark font-serif leading-tight">
                        Someone from <span className="font-bold">{data.location}</span>
                    </p>
                    <p className="text-xs text-text-muted mt-0.5 flex items-center gap-1">
                        booked <span className="text-forest font-semibold">{data.villa}</span>
                    </p>
                    <span className="text-[10px] text-text-subtle mt-1 block uppercase tracking-wider opacity-60">
                        {data.time}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default BookingNotification;
