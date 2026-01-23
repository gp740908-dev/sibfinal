'use client';

import React from 'react';
import { X, CheckCircle, MessageCircle, Mail } from 'lucide-react';

interface BookingSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    bookingDetails: {
        villaName: string;
        guestName: string;
        checkIn: string;
        checkOut: string;
        totalPrice: string;
    };
}

export const BookingSuccessModal: React.FC<BookingSuccessModalProps> = ({
    isOpen,
    onClose,
    bookingDetails
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl animate-in zoom-in-95 fade-in duration-300">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X size={20} />
                </button>

                {/* Success Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
                        <CheckCircle size={40} className="text-white" />
                    </div>
                </div>

                {/* Title */}
                <h2 className="font-serif text-3xl text-center text-forest mb-2">
                    Thank You!
                </h2>
                <p className="text-center text-gray-500 mb-6">
                    Your booking request has been submitted
                </p>

                {/* Booking Summary Card */}
                <div className="bg-sand/30 rounded-2xl p-5 mb-6">
                    <div className="text-center mb-4">
                        <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-1">Reservation</p>
                        <p className="font-serif text-xl text-forest">{bookingDetails.villaName}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-gray-400 text-xs uppercase tracking-wide">Check-in</p>
                            <p className="text-forest font-medium">{bookingDetails.checkIn}</p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-xs uppercase tracking-wide">Check-out</p>
                            <p className="text-forest font-medium">{bookingDetails.checkOut}</p>
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-forest/10 flex justify-between items-center">
                        <span className="text-gray-500">Total</span>
                        <span className="font-serif text-xl text-forest">{bookingDetails.totalPrice}</span>
                    </div>
                </div>

                {/* What's Next */}
                <div className="space-y-3 mb-6">
                    <p className="text-sm font-semibold text-forest">What happens next?</p>
                    <div className="flex items-start gap-3 text-sm text-gray-600">
                        <MessageCircle size={18} className="text-green-500 mt-0.5 shrink-0" />
                        <p>Our team will contact you via WhatsApp within 24 hours to confirm availability and payment.</p>
                    </div>
                    <div className="flex items-start gap-3 text-sm text-gray-600">
                        <Mail size={18} className="text-blue-500 mt-0.5 shrink-0" />
                        <p>A confirmation email has been sent to your inbox.</p>
                    </div>
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="w-full bg-forest text-white py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-forest/90 transition-colors"
                >
                    Got it, Thanks!
                </button>

                {/* Brand */}
                <p className="text-center text-xs text-gray-400 mt-4">
                    Stayin<span className="italic text-gold">UBUD</span> · Bali Luxury Villas
                </p>
            </div>
        </div>
    );
};
