
import React, { useState, useCallback } from 'react';
import { X, Loader2, User, Mail, Phone, MessageSquare, Check } from 'lucide-react';
import { format } from 'date-fns';

interface GuestFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: GuestFormData) => Promise<void>;
  bookingSummary: {
    villaName: string;
    checkIn: Date;
    checkOut: Date;
    totalPrice: string;
    nights: number;
    guests: number;
  };
  isSubmitting: boolean;
}

export interface GuestFormData {
  fullName: string;
  email: string;
  whatsapp: string;
  specialRequest: string;
}

// Validation rules with descriptive messages
const validators = {
  fullName: (value: string): string | null => {
    if (!value.trim()) return "Please enter your full name";
    if (value.trim().length < 3) return "Name should be at least 3 characters";
    if (!/^[a-zA-Z\s'-]+$/.test(value)) return "Please use only letters, spaces, and hyphens";
    return null;
  },
  email: (value: string): string | null => {
    if (!value.trim()) return "Please enter your email address";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Please enter a valid email (e.g., name@example.com)";
    return null;
  },
  whatsapp: (value: string): string | null => {
    if (!value.trim()) return "Please enter your phone number";
    const digits = value.replace(/\D/g, '');
    if (digits.length < 8) return "Phone number should be at least 8 digits";
    if (digits.length > 15) return "Phone number is too long";
    return null;
  }
};

export const GuestFormModal: React.FC<GuestFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  bookingSummary,
  isSubmitting
}) => {
  const [formData, setFormData] = useState<GuestFormData>({
    fullName: '',
    email: '',
    whatsapp: '',
    specialRequest: ''
  });

  // Track which fields have been touched (for on-blur validation)
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Partial<GuestFormData>>({});

  if (!isOpen) return null;

  // Validate a single field
  const validateField = useCallback((field: keyof typeof validators, value: string): string | null => {
    return validators[field](value);
  }, []);

  // Handle blur - mark as touched and validate
  const handleBlur = (field: keyof GuestFormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));

    if (field in validators) {
      const error = validateField(field as keyof typeof validators, formData[field]);
      setErrors(prev => ({ ...prev, [field]: error || undefined }));
    }
  };

  // Handle input change with live validation after touched
  const handleChange = (field: keyof GuestFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Only show live validation if field was already touched
    if (touched[field] && field in validators) {
      const error = validateField(field as keyof typeof validators, value);
      setErrors(prev => ({ ...prev, [field]: error || undefined }));
    }
  };

  // Validate all fields on submit
  const validate = (): boolean => {
    const newErrors: Partial<GuestFormData> = {};

    (Object.keys(validators) as Array<keyof typeof validators>).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);
    // Mark all fields as touched
    setTouched({ fullName: true, email: true, whatsapp: true });
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      await onSubmit(formData);
    }
  };

  // Helper to get input state classes
  const getInputClasses = (field: keyof GuestFormData, baseFont: string = 'font-sans text-sm') => {
    const wasTouched = touched[field];
    const hasError = errors[field];
    const hasValue = formData[field].trim().length > 0;
    const isValid = wasTouched && hasValue && !hasError;

    return `w-full border-b py-2 bg-transparent outline-none transition-all duration-300 placeholder:text-text-subtle ${baseFont}
      ${hasError ? 'border-red-400 focus:border-red-500' :
        isValid ? 'border-forest focus:border-forest' :
          'border-text-subtle focus:border-forest-dark'}
    `;
  };

  // Valid indicator component
  const ValidIndicator = ({ field }: { field: keyof GuestFormData }) => {
    const wasTouched = touched[field];
    const hasError = errors[field];
    const hasValue = formData[field].trim().length > 0;
    const isValid = wasTouched && hasValue && !hasError;

    if (!isValid) return null;

    return (
      <span className="absolute right-0 bottom-3 text-forest animate-fade-in">
        <Check size={16} aria-hidden="true" />
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-forest-dark/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        {/* Header with Summary */}
        <div className="bg-sand/20 p-6 border-b border-forest-dark/10">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-serif text-2xl text-forest-dark">Complete your Request</h3>
            <button
              onClick={onClose}
              className="text-forest-dark/60 hover:text-forest-dark transition-colors p-1 rounded-lg hover:bg-forest-dark/5"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
          </div>

          {/* Micro Summary */}
          <div className="flex justify-between items-center text-xs md:text-sm font-sans text-forest-dark/80 bg-white/50 p-3 rounded-lg border border-forest-dark/5">
            <div>
              <span className="block font-bold">{bookingSummary.villaName}</span>
              <span>{format(bookingSummary.checkIn, 'dd MMM')} - {format(bookingSummary.checkOut, 'dd MMM')} ({bookingSummary.nights} nights)</span>
            </div>
            <div className="text-right">
              <span className="block font-bold">{bookingSummary.totalPrice}</span>
              <span>{bookingSummary.guests} Guests</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6" aria-label="Guest booking information form" noValidate>

          {/* Name */}
          <div className="space-y-1">
            <label htmlFor="guest-name" className="text-[10px] uppercase tracking-widest text-forest-dark/60 font-bold flex items-center gap-2">
              <User size={12} aria-hidden="true" /> Full Name <span className="text-red-500" aria-label="required">*</span>
            </label>
            <div className="relative">
              <input
                id="guest-name"
                type="text"
                value={formData.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                onBlur={() => handleBlur('fullName')}
                placeholder="e.g. Elena Rossi"
                required
                autoComplete="name"
                aria-required="true"
                aria-invalid={!!errors.fullName}
                aria-describedby={errors.fullName ? "name-error" : touched.fullName ? "name-hint" : undefined}
                className={getInputClasses('fullName', 'font-serif text-lg')}
              />
              <ValidIndicator field="fullName" />
            </div>
            {errors.fullName ? (
              <span id="name-error" role="alert" className="text-xs text-red-500 flex items-center gap-1 animate-fade-in">
                {errors.fullName}
              </span>
            ) : touched.fullName && !formData.fullName && (
              <span id="name-hint" className="text-xs text-text-muted">Enter your name as it appears on your ID</span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div className="space-y-1">
              <label htmlFor="guest-email" className="text-[10px] uppercase tracking-widest text-forest-dark/60 font-bold flex items-center gap-2">
                <Mail size={12} aria-hidden="true" /> Email Address <span className="text-red-500" aria-label="required">*</span>
              </label>
              <div className="relative">
                <input
                  id="guest-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  placeholder="elena@example.com"
                  required
                  autoComplete="email"
                  aria-required="true"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className={getInputClasses('email')}
                />
                <ValidIndicator field="email" />
              </div>
              {errors.email && (
                <span id="email-error" role="alert" className="text-xs text-red-500 animate-fade-in">
                  {errors.email}
                </span>
              )}
            </div>

            {/* WhatsApp */}
            <div className="space-y-1">
              <label htmlFor="guest-whatsapp" className="text-[10px] uppercase tracking-widest text-forest-dark/60 font-bold flex items-center gap-2">
                <Phone size={12} aria-hidden="true" /> WhatsApp / Phone <span className="text-red-500" aria-label="required">*</span>
              </label>
              <div className="relative">
                <input
                  id="guest-whatsapp"
                  type="tel"
                  value={formData.whatsapp}
                  onChange={(e) => handleChange('whatsapp', e.target.value)}
                  onBlur={() => handleBlur('whatsapp')}
                  placeholder="+62 812 3456 7890"
                  required
                  autoComplete="tel"
                  aria-required="true"
                  aria-invalid={!!errors.whatsapp}
                  aria-describedby={errors.whatsapp ? "whatsapp-error" : "whatsapp-hint"}
                  className={getInputClasses('whatsapp')}
                />
                <ValidIndicator field="whatsapp" />
              </div>
              {errors.whatsapp ? (
                <span id="whatsapp-error" role="alert" className="text-xs text-red-500 animate-fade-in">
                  {errors.whatsapp}
                </span>
              ) : (
                <span id="whatsapp-hint" className="text-xs text-text-muted">Include country code for international numbers</span>
              )}
            </div>
          </div>

          {/* Special Request */}
          <div className="space-y-1 pt-2">
            <label htmlFor="guest-request" className="text-[10px] uppercase tracking-widest text-forest-dark/60 font-bold flex items-center gap-2">
              <MessageSquare size={12} aria-hidden="true" /> Special Requests (Optional)
            </label>
            <textarea
              id="guest-request"
              value={formData.specialRequest}
              onChange={(e) => handleChange('specialRequest', e.target.value)}
              placeholder="Late check-in, dietary restrictions, honeymoon arrangement..."
              rows={2}
              className="w-full border-b border-text-subtle focus:border-forest-dark py-2 bg-transparent outline-none transition-all duration-300 placeholder:text-text-subtle font-sans text-sm resize-none"
            />
          </div>

          {/* Action Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-forest-dark text-sand-light py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-forest-dark/90 shadow-lg hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed focus-ring"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={16} aria-hidden="true" />
                  <span>Processing...</span>
                </>
              ) : (
                'Continue to WhatsApp'
              )}
            </button>
            <p className="text-center text-[10px] text-text-subtle mt-3">
              We'll redirect you to WhatsApp to confirm details with our concierge.
            </p>
          </div>

        </form>
      </div>
    </div>
  );
};
