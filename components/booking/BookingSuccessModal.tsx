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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal - Responsive sizing */}
            <div
                className="relative bg-white rounded-2xl sm:rounded-3xl w-full max-w-[95vw] sm:max-w-md max-h-[90vh] overflow-y-auto p-4 sm:p-6 md:p-8 shadow-2xl animate-in zoom-in-95 fade-in duration-300"
                role="dialog"
                aria-modal="true"
                aria-labelledby="success-modal-title"
                aria-describedby="success-modal-description"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 sm:top-4 sm:right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors z-10 focus-ring rounded-lg"
                    aria-label="Close confirmation modal"
                >
                    <X size={20} aria-hidden="true" />
                </button>

                {/* Success Icon - Responsive sizing */}
                <div className="flex justify-center mb-4 sm:mb-6" aria-hidden="true">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
                        <CheckCircle size={32} className="sm:hidden text-white" />
                        <CheckCircle size={40} className="hidden sm:block text-white" />
                    </div>
                </div>

                {/* Title - Responsive text */}
                <h2 id="success-modal-title" className="font-serif text-2xl sm:text-3xl text-center text-forest-dark mb-1 sm:mb-2">
                    Thank You!
                </h2>
                <p id="success-modal-description" className="text-center text-gray-500 text-sm sm:text-base mb-4 sm:mb-6">
                    Your booking request has been submitted
                </p>

                {/* Booking Summary Card */}
                <div className="bg-sand/30 rounded-xl sm:rounded-2xl p-3 sm:p-5 mb-4 sm:mb-6">
                    <div className="text-center mb-3 sm:mb-4">
                        <p className="text-[10px] sm:text-xs uppercase tracking-widest text-gold font-semibold mb-1">Reservation</p>
                        <p className="font-serif text-lg sm:text-xl text-forest-dark truncate">{bookingDetails.villaName}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
                        <div>
                            <p className="text-gray-400 text-[10px] sm:text-xs uppercase tracking-wide">Check-in</p>
                            <p className="text-forest-dark font-medium truncate">{bookingDetails.checkIn}</p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-[10px] sm:text-xs uppercase tracking-wide">Check-out</p>
                            <p className="text-forest-dark font-medium truncate">{bookingDetails.checkOut}</p>
                        </div>
                    </div>

                    <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-forest/10 flex justify-between items-center">
                        <span className="text-gray-500 text-sm">Total</span>
                        <span className="font-serif text-lg sm:text-xl text-forest-dark">{bookingDetails.totalPrice}</span>
                    </div>
                </div>

                {/* What's Next - Responsive text */}
                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                    <p className="text-xs sm:text-sm font-semibold text-forest-dark">What happens next?</p>
                    <div className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
                        <MessageCircle size={16} className="sm:w-[18px] sm:h-[18px] text-green-500 mt-0.5 shrink-0" aria-hidden="true" />
                        <p>Our team will contact you via WhatsApp within 24 hours.</p>
                    </div>
                    <div className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
                        <Mail size={16} className="sm:w-[18px] sm:h-[18px] text-blue-500 mt-0.5 shrink-0" aria-hidden="true" />
                        <p>A confirmation email has been sent to your inbox.</p>
                    </div>
                </div>

                {/* Close Button - Responsive */}
                <button
                    onClick={onClose}
                    className="w-full bg-forest-dark text-white py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold uppercase tracking-widest text-xs sm:text-sm hover:bg-forest-dark/90 transition-colors focus-ring"
                    autoFocus
                >
                    Got it, Thanks!
                </button>

                {/* Brand */}
                <p className="text-center text-[10px] sm:text-xs text-gray-400 mt-3 sm:mt-4">
                    Stayin<span className="italic text-gold">UBUD</span> · Bali Luxury Villas
                </p>
            </div>
        </div>
    );
};
