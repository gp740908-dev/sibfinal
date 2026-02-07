'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { DateRange } from 'react-day-picker';
import { differenceInCalendarDays, format, isWeekend } from 'date-fns';
import { Calendar } from './Calendar';
import {
    ChevronLeft, Calendar as CalendarIcon, Users, Check, Loader2, Info, AlertCircle, X,
    Shield, Lock, Clock, Minus, Plus, Baby, User, Star, UserCheck
} from 'lucide-react';
import { GuestFormData } from './GuestFormModal';
import { submitBookingRequest } from '../../app/actions/booking';

interface BookingWizardProps {
    pricePerNight: number;
    villaName: string;
    villaId: string;
    blockedDates?: Date[];
    maxGuests?: number;
    // Social Proof
    rating?: number;          // e.g., 4.9
    reviewCount?: number;     // e.g., 127
    guestsHosted?: number;    // e.g., 850
    // Calendar enhancements
    minimumStay?: number;     // Minimum nights
    weekendPriceMultiplier?: number; // e.g., 1.15 for 15% weekend premium
}

type Step = 'dates' | 'guests' | 'confirm';

// Validation rules - ported from GuestFormModal for consistency
const validators = {
    fullName: (value: string): string | null => {
        if (!value.trim()) return "Please enter your full name";
        if (value.trim().length < 3) return "Name should be at least 3 characters";
        return null;
    },
    email: (value: string): string | null => {
        if (!value.trim()) return "Please enter your email address";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Please enter a valid email (e.g., name@example.com)";
        return null;
    },
    phone: (value: string): string | null => {
        if (!value.trim()) return "Please enter your phone number";
        const digits = value.replace(/\D/g, '');
        if (digits.length < 8) return "Phone number should be at least 8 digits";
        if (digits.length > 15) return "Phone number is too long";
        return null;
    }
};

// Alias for whatsapp field validation
const fieldToValidator: Record<string, keyof typeof validators> = {
    fullName: 'fullName',
    email: 'email',
    whatsapp: 'phone'
};

// Step Indicator Component with ARIA
const StepIndicator: React.FC<{
    currentStep: Step;
    steps: { id: Step; label: string }[];
}> = ({ currentStep, steps }) => {
    const stepOrder: Step[] = ['dates', 'guests', 'confirm'];
    const currentIndex = stepOrder.indexOf(currentStep);

    return (
        <nav
            aria-label="Booking progress"
            className="flex items-center justify-between px-4 py-4 bg-sand/20 border-b border-forest/5"
        >
            <ol className="flex items-center w-full" role="list">
                {steps.map((step, idx) => {
                    const isCompleted = idx < currentIndex;
                    const isCurrent = idx === currentIndex;

                    return (
                        <li
                            key={step.id}
                            className="flex items-center flex-1"
                            aria-current={isCurrent ? 'step' : undefined}
                        >
                            <div className="flex flex-col items-center flex-1">
                                {/* Step Circle */}
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${isCompleted
                                        ? 'bg-forest-dark text-sand'
                                        : isCurrent
                                            ? 'border-2 border-forest-dark text-forest-dark bg-white'
                                            : 'border border-text-subtle text-text-subtle bg-white'
                                        }`}
                                    aria-hidden="true"
                                >
                                    {isCompleted ? (
                                        <Check size={16} className="text-sand" />
                                    ) : (
                                        idx + 1
                                    )}
                                </div>
                                {/* Step Label */}
                                <span
                                    className={`mt-2 text-[10px] uppercase tracking-widest font-bold transition-colors ${isCompleted || isCurrent ? 'text-forest-dark' : 'text-text-subtle'
                                        }`}
                                >
                                    {step.label}
                                    <span className="sr-only">
                                        {isCompleted ? ' (completed)' : isCurrent ? ' (current)' : ''}
                                    </span>
                                </span>
                            </div>
                            {/* Connector Line */}
                            {idx < steps.length - 1 && (
                                <div
                                    className={`h-0.5 flex-1 mx-2 transition-colors duration-300 ${idx < currentIndex ? 'bg-forest-dark' : 'bg-text-subtle/30'
                                        }`}
                                    aria-hidden="true"
                                />
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

// Valid Indicator Component
const ValidIndicator: React.FC<{ isValid: boolean }> = ({ isValid }) => {
    if (!isValid) return null;
    return (
        <span className="absolute right-0 bottom-3 text-forest animate-fade-in" aria-hidden="true">
            <Check size={16} />
        </span>
    );
};

// Error Banner Component
const ErrorBanner: React.FC<{
    message: string;
    onDismiss: () => void;
    onRetry?: () => void;
}> = ({ message, onDismiss, onRetry }) => (
    <div
        role="alert"
        aria-live="assertive"
        className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 animate-in fade-in slide-in-from-top-2"
    >
        <div className="flex items-start gap-3">
            <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} aria-hidden="true" />
            <div className="flex-1 min-w-0">
                <p className="font-medium text-red-800 text-sm">Submission Failed</p>
                <p className="text-xs text-red-600 mt-1">{message}</p>
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="text-xs text-red-700 underline mt-2 hover:text-red-900 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded"
                    >
                        Try Again
                    </button>
                )}
            </div>
            <button
                onClick={onDismiss}
                className="text-red-400 hover:text-red-600 transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                aria-label="Dismiss error"
            >
                <X size={16} />
            </button>
        </div>
    </div>
);

// Guest Stepper Component with Adults/Children split
const GuestStepper: React.FC<{
    label: string;
    description: string;
    icon: React.ReactNode;
    value: number;
    min: number;
    max: number;
    onChange: (value: number) => void;
}> = ({ label, description, icon, value, min, max, onChange }) => (
    <div className="flex items-center justify-between py-3">
        <div className="flex items-center gap-3">
            <span className="text-forest-dark/60" aria-hidden="true">{icon}</span>
            <div>
                <span className="font-medium text-forest-dark text-sm">{label}</span>
                <p className="text-[10px] text-text-muted">{description}</p>
            </div>
        </div>
        <div className="flex items-center gap-3" role="group" aria-label={`${label} count`}>
            <button
                type="button"
                onClick={() => onChange(Math.max(min, value - 1))}
                disabled={value <= min}
                className="w-8 h-8 rounded-full border border-forest/30 flex items-center justify-center text-forest-dark hover:bg-forest/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-forest focus:ring-offset-2"
                aria-label={`Decrease ${label.toLowerCase()}`}
            >
                <Minus size={14} />
            </button>
            <span
                className="w-6 text-center font-bold text-forest-dark"
                aria-live="polite"
                aria-atomic="true"
            >
                {value}
            </span>
            <button
                type="button"
                onClick={() => onChange(Math.min(max, value + 1))}
                disabled={value >= max}
                className="w-8 h-8 rounded-full border border-forest/30 flex items-center justify-center text-forest-dark hover:bg-forest/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-forest focus:ring-offset-2"
                aria-label={`Increase ${label.toLowerCase()}`}
            >
                <Plus size={14} />
            </button>
        </div>
    </div>
);

// Trust Badges Component
const TrustBadges: React.FC<{ compact?: boolean }> = ({ compact = false }) => (
    <div className={`${compact ? 'py-3' : 'py-4'} border-t border-forest/5`}>
        <div className={`flex ${compact ? 'justify-center gap-4' : 'flex-wrap justify-center gap-4'}`}>
            <div className="flex items-center gap-1.5 text-[10px] text-text-muted">
                <Shield size={12} className="text-forest" aria-hidden="true" />
                <span>48h Free Cancellation</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-text-muted">
                <Lock size={12} className="text-forest" aria-hidden="true" />
                <span>Secure Booking</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-text-muted">
                <Clock size={12} className="text-forest" aria-hidden="true" />
                <span>Instant Confirmation</span>
            </div>
        </div>
        {!compact && (
            <p className="text-[9px] text-center text-text-muted mt-2 opacity-70">
                No credit card required • Pay on arrival
            </p>
        )}
    </div>
);

// Social Proof Badge Component
const SocialProofBadge: React.FC<{
    rating?: number;
    reviewCount?: number;
    guestsHosted?: number;
}> = ({ rating, reviewCount, guestsHosted }) => {
    if (!rating && !guestsHosted) return null;

    return (
        <div className="flex items-center justify-center gap-4 py-3 px-4 bg-gradient-to-r from-forest/5 to-transparent border-b border-forest/5">
            {rating && (
                <div className="flex items-center gap-1.5">
                    <Star size={14} className="text-amber-500 fill-amber-500" aria-hidden="true" />
                    <span className="font-bold text-forest-dark text-sm">{rating.toFixed(1)}</span>
                    {reviewCount && (
                        <span className="text-[10px] text-text-muted">({reviewCount} reviews)</span>
                    )}
                </div>
            )}
            {guestsHosted && (
                <div className="flex items-center gap-1.5 text-[10px] text-text-muted">
                    <UserCheck size={12} className="text-forest" aria-hidden="true" />
                    <span>{guestsHosted.toLocaleString()}+ guests hosted</span>
                </div>
            )}
        </div>
    );
};

export const BookingWizard: React.FC<BookingWizardProps> = ({
    pricePerNight,
    villaName,
    villaId,
    blockedDates = [],
    maxGuests = 8,
    rating,
    reviewCount,
    guestsHosted,
    minimumStay = 2,
    weekendPriceMultiplier
}) => {
    const [step, setStep] = useState<Step>('dates');
    const [dateRange, setDateRange] = useState<DateRange | undefined>();

    // Enhanced guest state with Adults/Children split
    const [adults, setAdults] = useState(2);
    const [children, setChildren] = useState(0);
    const [infants, setInfants] = useState(0);

    const [guestData, setGuestData] = useState<GuestFormData>({
        fullName: '',
        email: '',
        whatsapp: '',
        specialRequest: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bookingResult, setBookingResult] = useState<{ success: boolean; whatsappUrl?: string } | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);

    // Validation state
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [errors, setErrors] = useState<Partial<Record<keyof GuestFormData, string>>>({});

    // Add-ons
    const [addons, setAddons] = useState({
        breakfast: false,
        airportPickup: false
    });

    // Refs for focus management
    const stepContainerRef = useRef<HTMLDivElement>(null);
    const firstInputRef = useRef<HTMLInputElement>(null);

    // Focus management when step changes
    useEffect(() => {
        if (step === 'guests' && firstInputRef.current) {
            // Small delay to allow animation
            setTimeout(() => firstInputRef.current?.focus(), 100);
        }
    }, [step]);

    // Step configuration
    const stepConfig = [
        { id: 'dates' as Step, label: 'Dates' },
        { id: 'guests' as Step, label: 'Details' },
        { id: 'confirm' as Step, label: 'Confirm' }
    ];

    const totalGuests = adults + children;
    const nightCount = dateRange?.from && dateRange?.to
        ? differenceInCalendarDays(dateRange.to, dateRange.from)
        : 0;

    const subTotal = nightCount * pricePerNight;
    const serviceFee = subTotal * 0.10;
    const addonTotal = (addons.breakfast ? 150000 * totalGuests * nightCount : 0) + (addons.airportPickup ? 350000 : 0);
    const total = subTotal + serviceFee + addonTotal;

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
    };

    // Validation functions
    const validateField = useCallback((field: keyof typeof validators, value: string): string | null => {
        return validators[field](value);
    }, []);

    const handleBlur = (field: keyof GuestFormData) => {
        const validatorKey = fieldToValidator[field];
        if (!validatorKey) return;

        setTouched(prev => ({ ...prev, [field]: true }));
        const value = guestData[field] || '';
        const error = validators[validatorKey](value);
        setErrors(prev => ({ ...prev, [field]: error || undefined }));
    };

    const handleChange = (field: keyof GuestFormData, value: string) => {
        setGuestData(prev => ({ ...prev, [field]: value }));

        // Live validation if field was already touched
        const validatorKey = fieldToValidator[field];
        if (touched[field] && validatorKey) {
            const error = validators[validatorKey](value);
            setErrors(prev => ({ ...prev, [field]: error || undefined }));
        }
    };

    const validateAllFields = (): boolean => {
        const newErrors: Partial<Record<keyof GuestFormData, string>> = {};

        (['fullName', 'email', 'whatsapp'] as const).forEach(field => {
            const validatorKey = fieldToValidator[field];
            if (validatorKey) {
                const value = guestData[field] || '';
                const error = validators[validatorKey](value);
                if (error) newErrors[field] = error;
            }
        });

        setErrors(newErrors);
        setTouched({ fullName: true, email: true, whatsapp: true });
        return Object.keys(newErrors).length === 0;
    };

    const getInputClasses = (field: keyof GuestFormData) => {
        const wasTouched = touched[field];
        const hasError = errors[field];
        const hasValue = (guestData[field] || '').trim().length > 0;
        const isValid = wasTouched && hasValue && !hasError;

        return `w-full bg-transparent border-b py-3 text-forest-dark focus:outline-none focus:ring-0 transition-all duration-300 placeholder:text-forest-dark/40 ${hasError
            ? 'border-red-400 focus:border-red-500'
            : isValid
                ? 'border-forest focus:border-forest'
                : 'border-forest/20 focus:border-forest-dark'
            }`;
    };

    const isFieldValid = (field: keyof GuestFormData): boolean => {
        const wasTouched = touched[field];
        const hasError = errors[field];
        const hasValue = (guestData[field] || '').trim().length > 0;
        return wasTouched && hasValue && !hasError;
    };

    const handleNext = () => {
        if (step === 'dates' && dateRange?.from && dateRange?.to) {
            setStep('guests');
        } else if (step === 'guests') {
            if (validateAllFields()) {
                setStep('confirm');
            }
        }
    };

    const handleBack = () => {
        setSubmitError(null);
        if (step === 'guests') setStep('dates');
        if (step === 'confirm') setStep('guests');
    };

    // Keyboard navigation for steps
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && step !== 'confirm') {
            e.preventDefault();
            handleNext();
        }
    };

    const handleSubmit = async () => {
        if (!dateRange?.from || !dateRange?.to) return;
        setIsSubmitting(true);
        setSubmitError(null);

        // Build guest summary with Adults/Children
        const guestSummary = `${adults} Adult${adults > 1 ? 's' : ''}${children > 0 ? `, ${children} Child${children > 1 ? 'ren' : ''}` : ''}${infants > 0 ? `, ${infants} Infant${infants > 1 ? 's' : ''}` : ''}`;
        const addonSummary = [
            addons.breakfast ? 'Daily Breakfast' : '',
            addons.airportPickup ? 'Airport Pickup' : ''
        ].filter(Boolean).join(', ');

        const finalRequests = `Guests: ${guestSummary}\n${addonSummary ? `Add-ons: ${addonSummary}\n` : ''}${guestData.specialRequest}`.trim();
        const finalGuestData = { ...guestData, specialRequest: finalRequests };

        try {
            const result = await submitBookingRequest(
                villaId,
                villaName,
                pricePerNight,
                dateRange.from,
                dateRange.to,
                totalGuests,
                finalGuestData
            );

            if (result.success) {
                setBookingResult({ success: true, whatsappUrl: result.whatsappUrl });
                window.open(result.whatsappUrl, '_blank');
            } else {
                setSubmitError("Booking failed. Please check your details and try again.");
            }
        } catch (e) {
            setSubmitError("Connection failed. Please check your internet and try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- RENDER CONTENT ---
    // Note: This is a render FUNCTION, not a component, to prevent remounting on state changes
    const renderWizardContent = (isMobile = false, onClose?: () => void) => (
        <div
            className={`bg-white ${isMobile ? 'h-full flex flex-col' : 'rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-forest-dark/10 relative max-h-[calc(100vh-10rem)] flex flex-col'}`}
            onKeyDown={handleKeyDown}
        >

            {/* Mobile Header with Close Button */}
            {isMobile && (
                <div className="flex justify-between items-center p-4 border-b border-forest/10 bg-sand/20">
                    <h2 className="font-serif text-lg text-forest-dark">Booking Request</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-forest/10 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-forest"
                        aria-label="Close booking modal"
                    >
                        <X size={24} className="text-forest" />
                    </button>
                </div>
            )}

            {/* Step Indicator */}
            {!bookingResult && (
                <StepIndicator currentStep={step} steps={stepConfig} />
            )}

            {/* Social Proof Badge */}
            {!bookingResult && (rating || guestsHosted) && (
                <SocialProofBadge rating={rating} reviewCount={reviewCount} guestsHosted={guestsHosted} />
            )}

            {/* Wizard Header (Price & Back) */}
            <div className="p-6 border-b border-forest/5 flex justify-between items-center bg-sand/10 shrink-0">
                <div>
                    <span className="font-serif text-2xl text-forest-dark">{formatPrice(pricePerNight)}</span>
                    <span className="text-xs text-text-muted ml-1">/ night</span>
                </div>
                {step !== 'dates' && !bookingResult && (
                    <button
                        onClick={handleBack}
                        className="text-forest-dark/70 hover:text-forest-dark text-xs font-bold uppercase tracking-wider flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-forest rounded px-2 py-1"
                        aria-label={`Go back to ${step === 'confirm' ? 'details' : 'dates'} step`}
                    >
                        <ChevronLeft size={14} aria-hidden="true" /> Back
                    </button>
                )}
            </div>

            {/* Scrollable Content Area */}
            <div ref={stepContainerRef} className="p-6 flex-1 overflow-y-auto min-h-0 overscroll-contain">

                {/* Error Banner */}
                {submitError && (
                    <ErrorBanner
                        message={submitError}
                        onDismiss={() => setSubmitError(null)}
                        onRetry={handleSubmit}
                    />
                )}

                {/* STEP 1: DATES */}
                {step === 'dates' && (
                    <div className="animate-in slide-in-from-right-4 duration-300" role="region" aria-label="Step 1: Select dates">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-forest-dark mb-6 flex items-center gap-2">
                            <CalendarIcon size={16} aria-hidden="true" /> Select Dates
                        </h3>
                        <div className="flex justify-center mb-6">
                            <Calendar
                                selected={dateRange}
                                onSelect={setDateRange}
                                disabledDates={blockedDates}
                                numberOfMonths={1}
                            />
                        </div>
                        {dateRange?.from && dateRange?.to && (
                            <div className="bg-forest/5 p-4 rounded-lg flex justify-between items-center mb-4 animate-in fade-in" role="status">
                                <span className="text-sm text-forest-dark">
                                    {format(dateRange.from, 'dd MMM')} - {format(dateRange.to, 'dd MMM')}
                                </span>
                                <span className="font-bold text-forest-dark">{nightCount} Nights</span>
                            </div>
                        )}

                        {/* Minimum Stay & Weekend Pricing Hints */}
                        <div className="flex flex-wrap gap-3 mb-4 text-[10px]">
                            {minimumStay > 1 && (
                                <div className="flex items-center gap-1.5 text-text-muted">
                                    <CalendarIcon size={10} aria-hidden="true" />
                                    <span>Min. {minimumStay} nights</span>
                                </div>
                            )}
                            {weekendPriceMultiplier && weekendPriceMultiplier > 1 && (
                                <div className="flex items-center gap-1.5 text-text-muted">
                                    <Info size={10} aria-hidden="true" />
                                    <span>Weekend rates +{Math.round((weekendPriceMultiplier - 1) * 100)}%</span>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={handleNext}
                            disabled={!dateRange?.from || !dateRange?.to}
                            className="w-full bg-forest-dark text-sand py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all focus:outline-none focus:ring-2 focus:ring-forest focus:ring-offset-2"
                            aria-describedby={!dateRange?.from || !dateRange?.to ? 'dates-hint' : undefined}
                        >
                            Continue
                        </button>
                        {(!dateRange?.from || !dateRange?.to) && (
                            <p id="dates-hint" className="sr-only">Please select check-in and check-out dates first</p>
                        )}
                    </div>
                )}

                {/* STEP 2: GUESTS & DETAILS */}
                {step === 'guests' && (
                    <div className="animate-in slide-in-from-right-4 duration-300" role="region" aria-label="Step 2: Guest details">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-forest-dark mb-6 flex items-center gap-2">
                            <Users size={16} aria-hidden="true" /> Guest Details
                        </h3>

                        {/* Guest Count with Adults/Children Split */}
                        <div className="mb-6 border border-forest/10 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs uppercase tracking-wider text-text-muted font-bold">Guests</span>
                                <span className="text-[10px] text-text-muted">Max {maxGuests} guests</span>
                            </div>
                            <div className="divide-y divide-forest/10">
                                <GuestStepper
                                    label="Adults"
                                    description="Ages 13+"
                                    icon={<User size={16} />}
                                    value={adults}
                                    min={1}
                                    max={maxGuests - children}
                                    onChange={setAdults}
                                />
                                <GuestStepper
                                    label="Children"
                                    description="Ages 2-12"
                                    icon={<Users size={16} />}
                                    value={children}
                                    min={0}
                                    max={maxGuests - adults}
                                    onChange={setChildren}
                                />
                                <GuestStepper
                                    label="Infants"
                                    description="Under 2"
                                    icon={<Baby size={16} />}
                                    value={infants}
                                    min={0}
                                    max={3}
                                    onChange={setInfants}
                                />
                            </div>
                        </div>

                        {/* Personal Info with Inline Validation */}
                        <fieldset className="space-y-4 mb-8">
                            <legend className="sr-only">Contact Information</legend>

                            {/* Full Name */}
                            <div className="space-y-1">
                                <label htmlFor="fullName" className="text-[10px] uppercase tracking-widest text-text-muted font-bold">
                                    Full Name <span className="text-red-500" aria-hidden="true">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        ref={firstInputRef}
                                        id="fullName"
                                        type="text"
                                        placeholder="e.g. Elena Rossi"
                                        className={getInputClasses('fullName')}
                                        value={guestData.fullName}
                                        onChange={e => handleChange('fullName', e.target.value)}
                                        onBlur={() => handleBlur('fullName')}
                                        aria-invalid={!!errors.fullName}
                                        aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                                        required
                                    />
                                    <ValidIndicator isValid={isFieldValid('fullName')} />
                                </div>
                                {errors.fullName && (
                                    <span id="fullName-error" role="alert" className="text-xs text-red-500 animate-fade-in">{errors.fullName}</span>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Email */}
                                <div className="space-y-1">
                                    <label htmlFor="email" className="text-[10px] uppercase tracking-widest text-text-muted font-bold">
                                        Email <span className="text-red-500" aria-hidden="true">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="email"
                                            type="email"
                                            placeholder="your@email.com"
                                            className={getInputClasses('email')}
                                            value={guestData.email}
                                            onChange={e => handleChange('email', e.target.value)}
                                            onBlur={() => handleBlur('email')}
                                            aria-invalid={!!errors.email}
                                            aria-describedby={errors.email ? 'email-error' : undefined}
                                            required
                                        />
                                        <ValidIndicator isValid={isFieldValid('email')} />
                                    </div>
                                    {errors.email && (
                                        <span id="email-error" role="alert" className="text-xs text-red-500 animate-fade-in">{errors.email}</span>
                                    )}
                                </div>

                                {/* Phone/WhatsApp */}
                                <div className="space-y-1">
                                    <label htmlFor="phone" className="text-[10px] uppercase tracking-widest text-text-muted font-bold">
                                        WhatsApp <span className="text-red-500" aria-hidden="true">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="whatsapp"
                                            type="tel"
                                            placeholder="+62 812 xxxx xxxx"
                                            className={getInputClasses('whatsapp')}
                                            value={guestData.whatsapp}
                                            onChange={e => handleChange('whatsapp', e.target.value)}
                                            onBlur={() => handleBlur('whatsapp')}
                                            aria-invalid={!!errors.whatsapp}
                                            aria-describedby={errors.whatsapp ? 'whatsapp-error' : undefined}
                                            required
                                        />
                                        <ValidIndicator isValid={isFieldValid('whatsapp')} />
                                    </div>
                                    {errors.whatsapp && (
                                        <span id="whatsapp-error" role="alert" className="text-xs text-red-500 animate-fade-in">{errors.whatsapp}</span>
                                    )}
                                </div>
                            </div>

                            {/* Special Requests */}
                            <div className="space-y-1 pt-2">
                                <label htmlFor="specialRequests" className="text-[10px] uppercase tracking-widest text-text-muted font-bold">
                                    Special Requests (Optional)
                                </label>
                                <textarea
                                    id="specialRequests"
                                    placeholder="Late check-in, dietary restrictions, honeymoon arrangement..."
                                    rows={2}
                                    className="w-full bg-transparent border-b border-forest/20 py-3 text-forest-dark focus:outline-none focus:border-forest-dark transition-colors placeholder:text-forest-dark/40 resize-none"
                                    value={guestData.specialRequest}
                                    onChange={e => handleChange('specialRequest', e.target.value)}
                                />
                            </div>
                        </fieldset>

                        {/* Add-ons */}
                        <fieldset className="space-y-3 mb-8">
                            <legend className="sr-only">Optional Add-ons</legend>
                            <label className="flex items-center gap-3 p-3 border border-forest/10 rounded-lg cursor-pointer hover:bg-forest/5 transition-colors focus-within:ring-2 focus-within:ring-forest">
                                <input
                                    type="checkbox"
                                    checked={addons.breakfast}
                                    onChange={() => setAddons(p => ({ ...p, breakfast: !p.breakfast }))}
                                    className="accent-forest-dark w-4 h-4 focus:ring-2 focus:ring-forest"
                                    aria-describedby="breakfast-price"
                                />
                                <div className="flex-1">
                                    <span className="text-sm font-medium text-forest-dark block">Daily Floating Breakfast</span>
                                    <span id="breakfast-price" className="text-xs text-text-muted">IDR 150k / person / night</span>
                                </div>
                            </label>
                            <label className="flex items-center gap-3 p-3 border border-forest/10 rounded-lg cursor-pointer hover:bg-forest/5 transition-colors focus-within:ring-2 focus-within:ring-forest">
                                <input
                                    type="checkbox"
                                    checked={addons.airportPickup}
                                    onChange={() => setAddons(p => ({ ...p, airportPickup: !p.airportPickup }))}
                                    className="accent-forest-dark w-4 h-4 focus:ring-2 focus:ring-forest"
                                    aria-describedby="pickup-price"
                                />
                                <div className="flex-1">
                                    <span className="text-sm font-medium text-forest-dark block">Airport Pickup (SUV)</span>
                                    <span id="pickup-price" className="text-xs text-text-muted">IDR 350k / way</span>
                                </div>
                            </label>
                        </fieldset>

                        <button
                            onClick={handleNext}
                            className="w-full bg-forest-dark text-sand py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-forest focus:ring-offset-2"
                        >
                            Review Booking
                        </button>
                    </div>
                )}

                {/* STEP 3: CONFIRM */}
                {step === 'confirm' && !bookingResult && (
                    <div className="animate-in slide-in-from-right-4 duration-300" role="region" aria-label="Step 3: Confirm booking">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-forest-dark mb-6 flex items-center gap-2">
                            <Check size={16} aria-hidden="true" /> Confirm Details
                        </h3>

                        <div className="bg-sand/20 rounded-xl p-6 space-y-4 mb-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-text-muted">Dates</span>
                                <span className="font-medium text-forest-dark">{format(dateRange!.from!, 'dd MMM')} - {format(dateRange!.to!, 'dd MMM')}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-text-muted">Guests</span>
                                <span className="font-medium text-forest-dark">
                                    {adults} Adult{adults > 1 ? 's' : ''}
                                    {children > 0 && `, ${children} Child${children > 1 ? 'ren' : ''}`}
                                    {infants > 0 && `, ${infants} Infant${infants > 1 ? 's' : ''}`}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-text-muted">Guest Name</span>
                                <span className="font-medium text-forest-dark">{guestData.fullName}</span>
                            </div>
                            <div className="border-t border-forest/10 my-2" role="separator"></div>
                            <div className="flex justify-between text-sm">
                                <span className="text-text-muted">{nightCount} Nights × {formatPrice(pricePerNight)}</span>
                                <span className="font-medium text-forest-dark">{formatPrice(subTotal)}</span>
                            </div>
                            {addonTotal > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-text-muted">Add-ons</span>
                                    <span className="font-medium text-forest-dark">{formatPrice(addonTotal)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-sm">
                                <span className="text-text-muted">Service Fee (10%)</span>
                                <span className="font-medium text-forest-dark">{formatPrice(serviceFee)}</span>
                            </div>
                            <div className="border-t border-forest/10 my-2" role="separator"></div>
                            <div className="flex justify-between text-xl font-serif text-forest-dark">
                                <span>Total</span>
                                <span>{formatPrice(total)}</span>
                            </div>
                        </div>

                        {/* Cancellation Policy Notice */}
                        <div className="flex items-start gap-3 bg-forest/5 p-4 rounded-lg mb-4 text-xs text-forest-dark border border-forest/10">
                            <Shield className="w-4 h-4 shrink-0 mt-0.5 text-forest" aria-hidden="true" />
                            <div>
                                <p className="font-bold mb-1">Free Cancellation Policy</p>
                                <p className="text-text-muted">Cancel for free up to 48 hours before check-in. After that, cancellation is subject to a 50% fee.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 bg-sand/30 p-4 rounded-lg mb-6 text-xs text-forest-dark">
                            <Info className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                            <p>Clicking "Submit Request" will open WhatsApp with your booking details pre-filled. Our concierge will confirm availability instantly.</p>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="w-full bg-forest-dark text-sand py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-forest focus:ring-offset-2"
                            aria-busy={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="animate-spin" size={16} aria-hidden="true" />
                                    <span>Opening WhatsApp...</span>
                                </>
                            ) : (
                                'Submit Request via WhatsApp'
                            )}
                        </button>
                    </div>
                )}

                {/* SUCCESS STATE */}
                {bookingResult && (
                    <div className="animate-in zoom-in-95 duration-500 text-center py-8" role="status" aria-live="polite">
                        <div className="w-16 h-16 bg-[#537F5D]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Check className="w-8 h-8 text-[#537F5D]" aria-hidden="true" />
                        </div>
                        <h3 className="text-2xl font-serif text-forest-dark mb-2">Request Sent!</h3>
                        <p className="text-text-muted mb-8 max-w-xs mx-auto">
                            Check your WhatsApp. Our concierge is reviewing your request for <strong>{villaName}</strong>.
                        </p>
                        <button
                            onClick={() => {
                                setBookingResult(null);
                                setStep('dates');
                                setDateRange(undefined);
                                setAdults(2);
                                setChildren(0);
                                setInfants(0);
                                setGuestData({ fullName: '', email: '', whatsapp: '', specialRequest: '' });
                                setTouched({});
                                setErrors({});
                                setAddons({ breakfast: false, airportPickup: false });
                            }}
                            className="text-xs font-bold uppercase tracking-widest text-forest-dark underline hover:text-black focus:outline-none focus:ring-2 focus:ring-forest rounded px-2 py-1"
                        >
                            Book Another Stay
                        </button>
                    </div>
                )}

            </div>

            {/* Trust Badges Footer */}
            {!bookingResult && !isMobile && (
                <TrustBadges />
            )}
        </div>
    );

    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <>
            {/* DESKTOP VIEW */}
            <div className="hidden lg:block max-h-[calc(100vh-8rem)]">
                {renderWizardContent()}
            </div>

            {/* MOBILE VIEW */}
            <div className="lg:hidden">
                {/* Fixed Bottom Bar - Added safe area padding */}
                <div
                    className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-forest/10 p-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] flex items-center justify-between shadow-[0_-5px_20px_rgba(0,0,0,0.05)]"
                    role="region"
                    aria-label="Booking quick action"
                >
                    <div>
                        <span className="text-xs text-text-muted">Start from</span>
                        <div className="font-serif text-xl text-forest-dark leading-none">{formatPrice(pricePerNight)}</div>
                        <span className="text-[10px] text-text-muted">/ night</span>
                    </div>
                    <button
                        onClick={() => setIsMobileOpen(true)}
                        className="bg-forest-dark text-sand px-6 py-3 font-bold uppercase tracking-widest text-sm shadow-lg hover:opacity-90 transition-colors focus:outline-none focus:ring-2 focus:ring-forest focus:ring-offset-2"
                        aria-haspopup="dialog"
                    >
                        Check Availability
                    </button>
                </div>

                {/* Mobile Full Screen Modal */}
                {isMobileOpen && (
                    <div
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-in fade-in flex items-end md:items-center justify-center"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Booking wizard"
                    >
                        <div
                            className="bg-white w-full h-[90vh] md:h-auto md:max-w-md rounded-t-2xl md:rounded-2xl shadow-2xl relative overflow-hidden animate-in slide-in-from-bottom"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {renderWizardContent(true, () => setIsMobileOpen(false))}
                            {/* Mobile Trust Badges */}
                            {!bookingResult && <TrustBadges compact />}
                        </div>
                        {/* Close on backdrop click */}
                        <div className="absolute inset-0 -z-10" onClick={() => setIsMobileOpen(false)} aria-hidden="true" />
                    </div>
                )}
            </div>
        </>
    );
};
