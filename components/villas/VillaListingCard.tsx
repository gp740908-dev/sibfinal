import React from 'react';
import { Villa } from '../../types';
import { BedDouble, Users, Maximize } from 'lucide-react';

interface VillaListingCardProps {
  villa: Villa;
  onClick: () => void;
}

export const VillaListingCard: React.FC<VillaListingCardProps> = ({ villa, onClick }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
  };

  return (
    <div 
      onClick={onClick}
      className="group cursor-pointer flex flex-col gap-6 w-full"
    >
      {/* Image Container - 4:5 Aspect Ratio for Luxury Feel */}
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-forest/5">
        <div className="absolute inset-0 bg-forest/0 group-hover:bg-forest/10 transition-colors duration-700 z-10" />
        <img 
          src={villa.imageUrl} 
          alt={villa.name} 
          className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Floating Tag (Optional) */}
        <div className="absolute top-4 left-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
           <span className="bg-sand/90 backdrop-blur text-forest px-3 py-1 text-[10px] uppercase tracking-widest font-bold">
             View Details
           </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col items-center text-center px-4">
        {/* Title */}
        <h3 className="font-serif text-3xl text-forest uppercase tracking-wide mb-2 group-hover:text-accent transition-colors duration-300">
          {villa.name}
        </h3>

        {/* Specs Row */}
        <div className="flex items-center gap-4 text-forest/60 mb-4">
          <div className="flex items-center gap-1">
             <BedDouble size={14} />
             <span className="font-sans text-xs uppercase tracking-widest">{villa.bedrooms} BR</span>
          </div>
          <div className="w-px h-3 bg-forest/20"></div>
          <div className="flex items-center gap-1">
             <Users size={14} />
             <span className="font-sans text-xs uppercase tracking-widest">Up to {villa.guests}</span>
          </div>
          <div className="w-px h-3 bg-forest/20"></div>
          <div className="flex items-center gap-1">
             <Maximize size={14} />
             <span className="font-sans text-xs uppercase tracking-widest">{villa.land_area} m²</span>
          </div>
        </div>

        {/* Price */}
        <div className="flex flex-col items-center gap-1">
          <span className="font-serif text-xl text-forest font-medium">
            {formatPrice(villa.pricePerNight)}
          </span>
          <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-forest/40">
            Per Night
          </span>
        </div>
      </div>
    </div>
  );
};