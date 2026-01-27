
import React, { useState } from 'react';
import { X, Loader2, User, Mail, Phone, MessageSquare } from 'lucide-react';
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
  const [errors, setErrors] = useState<Partial<GuestFormData>>({});

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Partial<GuestFormData> = {};
    if (formData.fullName.length < 3) newErrors.fullName = "Name is required";
    if (!formData.email.includes('@')) newErrors.email = "Valid email is required";
    if (formData.whatsapp.length < 8) newErrors.whatsapp = "Valid phone number is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      await onSubmit(formData);
    }
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
        <div className="bg-[#D3D49F]/20 p-6 border-b border-forest-dark/10">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-serif text-2xl text-forest-dark">Complete your Request</h3>
            <button onClick={onClose} className="text-forest-dark/60 hover:text-forest-dark transition-colors">
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
        <form onSubmit={handleSubmit} className="p-6 space-y-6">

          {/* Name */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest text-forest-dark/60 font-bold flex items-center gap-2">
              <User size={12} /> Full Name
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="e.g. Elena Rossi"
              className={`w-full border-b py-2 bg-transparent outline-none transition-all placeholder:text-gray-300 font-serif text-lg
                ${errors.fullName ? 'border-red-400' : 'border-gray-200 focus:border-forest-dark'}
              `}
            />
            {errors.fullName && <span className="text-xs text-red-400">{errors.fullName}</span>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-forest-dark/60 font-bold flex items-center gap-2">
                <Mail size={12} /> Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="elena@example.com"
                className={`w-full border-b py-2 bg-transparent outline-none transition-all placeholder:text-gray-300 font-sans text-sm
                  ${errors.email ? 'border-red-400' : 'border-gray-200 focus:border-forest-dark'}
                `}
              />
              {errors.email && <span className="text-xs text-red-400">{errors.email}</span>}
            </div>

            {/* WhatsApp */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-forest-dark/60 font-bold flex items-center gap-2">
                <Phone size={12} /> WhatsApp / Phone
              </label>
              <input
                type="tel"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                placeholder="+62 ..."
                className={`w-full border-b py-2 bg-transparent outline-none transition-all placeholder:text-gray-300 font-sans text-sm
                  ${errors.whatsapp ? 'border-red-400' : 'border-gray-200 focus:border-forest-dark'}
                `}
              />
              {errors.whatsapp && <span className="text-xs text-red-400">{errors.whatsapp}</span>}
            </div>
          </div>

          {/* Special Request */}
          <div className="space-y-1 pt-2">
            <label className="text-[10px] uppercase tracking-widest text-forest-dark/60 font-bold flex items-center gap-2">
              <MessageSquare size={12} /> Special Requests (Optional)
            </label>
            <textarea
              value={formData.specialRequest}
              onChange={(e) => setFormData({ ...formData, specialRequest: e.target.value })}
              placeholder="Late check-in, dietary restrictions, honeymoon arrangement..."
              rows={2}
              className="w-full border-b border-gray-200 focus:border-forest-dark py-2 bg-transparent outline-none transition-all placeholder:text-gray-300 font-sans text-sm resize-none"
            />
          </div>

          {/* Action Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-forest-dark text-sand-light py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-forest-dark/90 shadow-lg hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  <span>Processing...</span>
                </>
              ) : (
                'Continue to WhatsApp'
              )}
            </button>
            <p className="text-center text-[10px] text-gray-400 mt-3">
              We'll redirect you to WhatsApp to confirm details with our concierge.
            </p>
          </div>

        </form>
      </div>
    </div>
  );
};
