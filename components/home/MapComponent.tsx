'use client';

import React, { useMemo } from 'react';
import { Villa } from '../../types';
import { ExternalLink, MapPin } from 'lucide-react';

interface MapComponentProps {
  villas: Villa[];
  activeVillaId: string;
}

// Helper to check for valid coordinates
const isValidLatLng = (lat: any, lng: any): boolean => {
  return typeof lat === 'number' && typeof lng === 'number' && !isNaN(lat) && !isNaN(lng);
};

const MapComponent: React.FC<MapComponentProps> = ({ villas, activeVillaId }) => {
  // Default to Ubud Center
  const DEFAULT_CENTER: [number, number] = [-8.5069, 115.2625];

  // Find active villa or first valid one
  const activeVilla = useMemo(() => {
    const validVillas = (villas || []).filter(v => isValidLatLng(v.latitude, v.longitude));
    return validVillas.find(v => v.id === activeVillaId) || validVillas[0];
  }, [villas, activeVillaId]);

  // Get coordinates
  const lat = activeVilla?.latitude ?? DEFAULT_CENTER[0];
  const lng = activeVilla?.longitude ?? DEFAULT_CENTER[1];
  const villaName = activeVilla?.name || 'Villa Location';

  // Google Maps Embed URL (free, no API key needed)
  const embedUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid`;

  // Direct link to Google Maps
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  return (
    <div className="h-full w-full relative bg-sand/50 rounded-xl overflow-hidden">
      {/* Google Maps Embed with Custom "High-End" Filter */}
      <iframe
        src={embedUrl}
        width="100%"
        height="100%"
        style={{
          border: 0,
          minHeight: '400px',
          // Filter to remove "Google Blue" and blend with Sand Theme
          filter: 'grayscale(100%) invert(0%) sepia(20%) contrast(1.1) brightness(0.95)'
        }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={`Map showing ${villaName}`}
        // Using mix-blend-multiply to let the bg-sand/50 texture bleed through
        className="w-full h-full opacity-80 mix-blend-multiply transition-all duration-700 hover:opacity-100 hover:filter-none"
      />

      {/* Villa Info Overlay */}
      <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-auto">
        <div className="bg-sand-light shadow-2xl rounded-sm p-4 md:p-5 border border-forest/5 max-w-xs">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-forest/10 rounded-lg shrink-0">
              <MapPin size={18} className="text-forest" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-serif text-base md:text-lg text-forest-dark font-bold truncate">
                {villaName}
              </h4>
              <p className="text-xs text-text-muted mt-0.5">
                Ubud, Bali
              </p>
            </div>
          </div>
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-forest-dark text-sand text-[10px] font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-forest transition-colors"
          >
            <ExternalLink size={14} />
            Open in Google Maps
          </a>
        </div>

        {/* Decorative overlay */}
        <div className="absolute inset-0 pointer-events-none border-[1px] border-forest/10 rounded-xl" />
      </div>
    </div>
  );
};

export default MapComponent;