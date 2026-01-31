'use client';

import React, { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { differenceInCalendarDays, format, addDays } from 'date-fns';
import { Calendar } from './Calendar';
import { ChevronRight, ChevronLeft, Calendar as CalendarIcon, Users, Check, Loader2, Info } from 'lucide-react';
import { GuestFormData } from './GuestFormModal'; // Reuse existing types
import { submitBookingRequest } from '../../app/actions/booking';
import Link from 'next/link';

interface BookingWizardProps {
    pricePerNight: number;
    villaName: string;
    villaId: string;
    blockedDates?: Date[];
}

type Step = 'dates' | 'guests' | 'confirm';

export const BookingWizard: React.FC<BookingWizardProps> = ({
    pricePerNight,
    villaName,
    villaId,
    blockedDates = []
}) => {
    const [step, setStep] = useState<Step>('dates');
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [guests, setGuests] = useState(2);
    const [guestData, setGuestData] = useState<GuestFormData>({
        fullName: '',
        email: '',
        phone: '',
        specialRequests: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bookingResult, setBookingResult] = useState<{ success: boolean; whatsappUrl?: string } | null>(null);

    // Improvements: Add Breakfast/Pickup Options
    const [addons, setAddons] = useState({
        breakfast: false,
        airportPickup: false
    });

    const nightCount = dateRange?.from && dateRange?.to
        ? differenceInCalendarDays(dateRange.to, dateRange.from)
        : 0;

    const subTotal = nightCount * pricePerNight;
    const serviceFee = subTotal * 0.10;
    const addonTotal = (addons.breakfast ? 150000 * guests * nightCount : 0) + (addons.airportPickup ? 350000 : 0);
    const total = subTotal + serviceFee + addonTotal;

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
    };

    const handleNext = () => {
        if (step === 'dates' && dateRange?.from && dateRange?.to) {
            setStep('guests');
        } else if (step === 'guests') {
            setStep('confirm');
        }
    };

    const handleBack = () => {
        if (step === 'guests') setStep('dates');
        if (step === 'confirm') setStep('guests');
    };

    const handleSubmit = async () => {
        if (!dateRange?.from || !dateRange?.to) return;
        setIsSubmitting(true);

        // Append addons to special requests for WhatsApp message
        const finalRequests = `${guestData.specialRequests}\n\nAdd-ons: ${addons.breakfast ? 'Daily Breakfast' : ''} ${addons.airportPickup ? 'Airport Pickup' : ''}`;

        const finalGuestData = { ...guestData, specialRequests: finalRequests };

        try {
            const result = await submitBookingRequest(
                villaId,
                villaName,
                pricePerNight,
                dateRange.from,
                dateRange.to,
                guests,
                finalGuestData
            );

            if (result.success) {
                setBookingResult({ success: true, whatsappUrl: result.whatsappUrl });
                window.open(result.whatsappUrl, '_blank');
            } else {
                alert("Booking failed. Please try again.");
            }
        } catch (e) {
            alert("Network error.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- RENDER STEPS ---

    // --- RENDER CONTENT (Shared between Desktop & Mobile) ---
    const WizardContent = ({ isMobile = false, onClose }: { isMobile?: boolean, onClose?: () => void }) => (
        <div className={`bg-white ${isMobile ? 'h-full flex flex-col' : 'rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-forest-dark/10 relative max-h-[calc(100vh-10rem)] flex flex-col overflow-hidden'}`}>

            {/* Mobile Header with Close Button */}
            {isMobile && (
                <div className="flex justify-between items-center p-4 border-b border-forest/10 bg-sand/20">
                    <h3 className="font-serif text-lg text-forest-dark">Booking Request</h3>
                    <button onClick={onClose} className="p-2 hover:bg-forest/10 rounded-full transition-colors">
                        <Loader2 className="w-5 h-5 opacity-0 absolute" /> {/* Dummy impl for X icon usage if not imported, picking X from imports or using generic svg */}
                        <svg className="w-6 h-6 text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            )}

            {/* Progress Bar */}
            <div className="bg-sand-light/30 h-1 w-full flex shrink-0">
                <div className={`h-full bg-forest transition-all duration-500 ease-out ${step === 'dates' ? 'w-1/3' : step === 'guests' ? 'w-2/3' : 'w-full'}`} />
            </div>

            {/* Wizard Header (Price & Back) */}
            <div className="p-6 border-b border-forest/5 flex justify-between items-center bg-sand/10 shrink-0">
                <div>
                    <span className="font-serif text-2xl text-forest-dark">{formatPrice(pricePerNight)}</span>
                    <span className="text-xs text-text-muted ml-1">/ night</span>
                </div>
                {step !== 'dates' && !bookingResult && (
                    <button onClick={handleBack} className="text-forest/60 hover:text-forest text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                        <ChevronLeft size={14} /> Back
                    </button>
                )}
            </div>

            {/* Scrollable Content Area */}
            <div className="p-6 flex-1 overflow-y-auto min-h-0">

                {/* STEP 1: DATES */}
                {step === 'dates' && (
                    <div className="animate-in slide-in-from-right-4 duration-300">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-forest mb-6 flex items-center gap-2">
                            <CalendarIcon size={16} /> Select Dates
                        </h3>
                        <div className="flex justify-center mb-6">
                            <Calendar
                                selected={dateRange}
                                onSelect={setDateRange}
                                disabledDates={blockedDates}
                                numberOfMonths={1}
                                className="rounded-xl border border-forest/10 p-3"
                            />
                        </div>
                        {dateRange?.from && dateRange?.to && (
                            <div className="bg-forest/5 p-4 rounded-lg flex justify-between items-center mb-4 animate-in fade-in">
                                <span className="text-sm text-forest">
                                    {format(dateRange.from, 'dd MMM')} - {format(dateRange.to, 'dd MMM')}
                                </span>
                                <span className="font-bold text-forest">{nightCount} Nights</span>
                            </div>
                        )}
                        <button
                            onClick={handleNext}
                            disabled={!dateRange?.from || !dateRange?.to}
                            className="w-full bg-forest text-sand py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-forest-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            Continue
                        </button>
                    </div>
                )}

                {/* STEP 2: GUESTS & DETAILS */}
                {step === 'guests' && (
                    <div className="animate-in slide-in-from-right-4 duration-300">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-forest mb-6 flex items-center gap-2">
                            <Users size={16} /> Guest Details
                        </h3>

                        {/* Guest Count */}
                        <div className="mb-6">
                            <label className="block text-xs uppercase tracking-wider text-forest/60 mb-2">Number of Guests</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4].map(num => (
                                    <button
                                        key={num}
                                        onClick={() => setGuests(num)}
                                        className={`flex-1 py-3 rounded-lg border text-sm font-bold transition-all ${guests === num ? 'bg-forest text-sand border-forest' : 'bg-transparent text-forest border-forest/20 hover:border-forest'}`}
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Personal Info */}
                        <div className="space-y-4 mb-8">
                            <input
                                type="text"
                                placeholder="Full Name"
                                className="w-full bg-transparent border-b border-forest/20 py-3 text-forest focus:outline-none focus:border-forest transition-colors"
                                value={guestData.fullName}
                                onChange={e => setGuestData({ ...guestData, fullName: e.target.value })}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="w-full bg-transparent border-b border-forest/20 py-3 text-forest focus:outline-none focus:border-forest transition-colors"
                                    value={guestData.email}
                                    onChange={e => setGuestData({ ...guestData, email: e.target.value })}
                                />
                                <input
                                    type="tel"
                                    placeholder="WhatsApp"
                                    className="w-full bg-transparent border-b border-forest/20 py-3 text-forest focus:outline-none focus:border-forest transition-colors"
                                    value={guestData.phone}
                                    onChange={e => setGuestData({ ...guestData, phone: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Add-ons */}
                        <div className="space-y-3 mb-8">
                            <label className="flex items-center gap-3 p-3 border border-forest/10 rounded-lg cursor-pointer hover:bg-forest/5 transition-colors">
                                <input type="checkbox" checked={addons.breakfast} onChange={() => setAddons(p => ({ ...p, breakfast: !p.breakfast }))} className="accent-forest w-4 h-4" />
                                <div className="flex-1">
                                    <span className="text-sm font-medium text-forest block">Daily Floating Breakfast</span>
                                    <span className="text-xs text-forest/60">IDR 150k / person</span>
                                </div>
                            </label>
                            <label className="flex items-center gap-3 p-3 border border-forest/10 rounded-lg cursor-pointer hover:bg-forest/5 transition-colors">
                                <input type="checkbox" checked={addons.airportPickup} onChange={() => setAddons(p => ({ ...p, airportPickup: !p.airportPickup }))} className="accent-forest w-4 h-4" />
                                <div className="flex-1">
                                    <span className="text-sm font-medium text-forest block">Airport Pickup (SUV)</span>
                                    <span className="text-xs text-forest/60">IDR 350k / way</span>
                                </div>
                            </label>
                        </div>

                        <button
                            onClick={handleNext}
                            disabled={!guestData.fullName || !guestData.phone}
                            className="w-full bg-forest text-sand py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-forest-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            Review Booking
                        </button>
                    </div>
                )}

                {/* STEP 3: CONFIRM */}
                {step === 'confirm' && !bookingResult && (
                    <div className="animate-in slide-in-from-right-4 duration-300">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-forest mb-6 flex items-center gap-2">
                            <Check size={16} /> Confirm Details
                        </h3>

                        <div className="bg-sand/20 rounded-xl p-6 space-y-4 mb-8">
                            <div className="flex justify-between text-sm">
                                <span className="text-forest/60">Dates</span>
                                <span className="font-medium text-forest">{format(dateRange!.from!, 'dd MMM')} - {format(dateRange!.to!, 'dd MMM')}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-forest/60">Guests</span>
                                <span className="font-medium text-forest">{guests} Adult{guests > 1 ? 's' : ''}</span>
                            </div>
                            <div className="border-t border-forest/10 my-2"></div>
                            <div className="flex justify-between text-sm">
                                <span className="text-forest/60">{nightCount} Nights</span>
                                <span className="font-medium text-forest">{formatPrice(subTotal)}</span>
                            </div>
                            {addonTotal > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-forest/60">Add-ons</span>
                                    <span className="font-medium text-forest">{formatPrice(addonTotal)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-sm">
                                <span className="text-forest/60">Service Fee (10%)</span>
                                <span className="font-medium text-forest">{formatPrice(serviceFee)}</span>
                            </div>
                            <div className="border-t border-forest/10 my-2"></div>
                            <div className="flex justify-between text-xl font-serif text-forest">
                                <span>Total</span>
                                <span>{formatPrice(total)}</span>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-lg mb-8 text-xs text-blue-800">
                            <Info className="w-4 h-4 shrink-0 mt-0.5" />
                            <p>Clicking "Submit Request" will open WhatsApp with your booking details pre-filled. Our concierge will confirm availability instantly.</p>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="w-full bg-forest text-sand py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-forest-dark disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" /> : 'Submit Request'}
                        </button>
                    </div>
                )}

                {/* SUCCESS STATE */}
                {bookingResult && (
                    <div className="animate-in zoom-in-95 duration-500 text-center py-8">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Check className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-2xl font-serif text-forest mb-2">Request Sent!</h3>
                        <p className="text-forest/60 mb-8 max-w-xs mx-auto">
                            Check your WhatsApp. Our concierge is reviewing your request for <strong>{villaName}</strong>.
                        </p>
                        <button
                            onClick={() => {
                                setBookingResult(null);
                                setStep('dates');
                                setDateRange(undefined);
                            }}
                            className="text-xs font-bold uppercase tracking-widest text-forest underline hover:text-forest-dark"
                        >
                            Book Another Stay
                        </button>
                    </div>
                )}

            </div>

            {/* Footer info (Desktop Only) */}
            {!bookingResult && !isMobile && (
                <div className="bg-sand/30 p-4 text-center text-[10px] text-forest/40 uppercase tracking-wider font-bold">
                    Secure Booking • No Credit Card Required
                </div>
            )}
        </div>
    );

    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <>
            {/* DESKTOP VIEW */}
            <div className="hidden lg:block">
                <WizardContent />
            </div>

            {/* MOBILE VIEW */}
            <div className="lg:hidden">
                {/* Fixed Bottom Bar */}
                <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-forest/10 p-4 pb-6 flex items-center justify-between shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
                    <div>
                        <span className="text-xs text-text-muted">Start from</span>
                        <div className="font-serif text-xl text-forest-dark leading-none">{formatPrice(pricePerNight)}</div>
                        <span className="text-[10px] text-text-muted">/ night</span>
                    </div>
                    <button
                        onClick={() => setIsMobileOpen(true)}
                        className="bg-forest text-sand px-6 py-3 rounded-full font-bold uppercase tracking-widest text-sm shadow-lg hover:bg-forest-dark transition-colors"
                    >
                        Check Availability
                    </button>
                </div>

                {/* Mobile Full Screen Modal */}
                {isMobileOpen && (
                    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-in fade-in flex items-end md:items-center justify-center">
                        <div
                            className="bg-white w-full h-[90vh] md:h-auto md:max-w-md rounded-t-2xl md:rounded-2xl shadow-2xl relative overflow-hidden animate-in slide-in-from-bottom"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <WizardContent isMobile={true} onClose={() => setIsMobileOpen(false)} />
                        </div>
                        {/* Close on backdrop click */}
                        <div className="absolute inset-0 -z-10" onClick={() => setIsMobileOpen(false)} />
                    </div>
                )}
            </div>
        </>
    );
};
