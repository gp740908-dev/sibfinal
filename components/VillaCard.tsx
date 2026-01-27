import React from 'react';
import { Villa } from '../types';

interface VillaCardProps {
  villa: Villa;
}

export const VillaCard: React.FC<VillaCardProps> = ({ villa }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
  };

  return (
    <div className="group relative flex flex-col cursor-pointer">
      <div className="overflow-hidden aspect-[3/4] md:aspect-[4/5] relative bg-forest-dark/10 rounded-sm">
        <img
          src={villa.imageUrl}
          alt={villa.name}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-forest-dark/0 group-hover:bg-forest-dark/10 transition-colors duration-500" />
      </div>

      <div className="mt-6 flex justify-between items-start">
        <div>
          <h3 className="text-2xl font-serif text-forest-dark mb-1">{villa.name}</h3>
          <p className="text-forest-dark/70 font-sans text-sm tracking-wide mb-3">{villa.bedrooms} Bedrooms • Up to {villa.guests} Guests</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {villa.features.slice(0, 3).map((feat, idx) => (
              <span key={idx} className="text-xs border border-forest-dark/30 text-forest-dark/70 px-2 py-1 rounded-full">{feat}</span>
            ))}
          </div>
        </div>
        <div className="text-right">
          <span className="block text-xl font-serif text-forest-dark font-medium">{formatPrice(villa.pricePerNight)}</span>
          <span className="text-xs text-forest-dark/60 font-sans uppercase tracking-wider">Per Night</span>
        </div>
      </div>

      <button className="mt-2 w-full py-3 bg-transparent border-t border-b border-forest-dark/20 text-forest-dark font-sans uppercase text-xs tracking-[0.2em] hover:bg-forest-dark hover:text-sand-light transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0">
        View Details
      </button>
    </div>
  );
};