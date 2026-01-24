'use client';

import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Villa } from '../../types';

interface MapComponentProps {
  villas: Villa[];
  activeVillaId: string;
}

// Helper to check for valid coordinates
const isValidLatLng = (lat: any, lng: any): boolean => {
  const isValid = typeof lat === 'number' && typeof lng === 'number' && !isNaN(lat) && !isNaN(lng);
  return isValid;
};

// 1. Controller Component to handle "Fly To" animation
const MapController: React.FC<{ center: [number, number], zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    // Only fly if coordinates are valid numbers
    if (map && isValidLatLng(center[0], center[1])) {
      try {
        map.flyTo(center, zoom, {
          duration: 2, // Slow, cinematic pan
          easeLinearity: 0.25
        });
      } catch (e) {
        console.warn("Map flyTo error:", e);
      }
    }
  }, [center, zoom, map]);
  return null;
};

// 2. Custom Marker Icon
const createCustomIcon = (isActive: boolean) => {
  return L.divIcon({
    className: 'custom-icon',
    html: `
      <div class="w-8 h-8 rounded-full border-2 border-[#D3D49F] flex items-center justify-center shadow-lg transition-all duration-500 ${isActive ? 'bg-[#537F5D] scale-125' : 'bg-[#537F5D]/80'}">
        <div class="w-2 h-2 rounded-full bg-[#D3D49F]"></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16], // Center point
    popupAnchor: [0, -20]
  });
};

const MapComponent: React.FC<MapComponentProps> = ({ villas, activeVillaId }) => {
  // Default to Ubud Center
  const DEFAULT_CENTER: [number, number] = [-8.5069, 115.2625];

  // Filter valid villas first
  const validVillas = useMemo(() => {
    return (villas || []).filter(v => isValidLatLng(v.latitude, v.longitude));
  }, [villas]);

  // Determine center position safely
  const centerPosition = useMemo((): [number, number] => {
    const activeVilla = validVillas.find(v => v.id === activeVillaId) || validVillas[0];

    if (activeVilla && isValidLatLng(activeVilla.latitude, activeVilla.longitude)) {
      return [activeVilla.latitude, activeVilla.longitude];
    }

    return DEFAULT_CENTER;
  }, [validVillas, activeVillaId]);

  return (
    <div className="h-full w-full relative isolation-auto">
      {/* CSS to tint the map tiles to match the Sand/Forest theme */}
      <style>{`
        .leaflet-tile-pane {
          filter: sepia(0.6) hue-rotate(40deg) contrast(0.9) brightness(0.95);
        }
        .leaflet-popup-content-wrapper {
          background: #D3D49F;
          color: #537F5D;
          border-radius: 0px;
          border: 1px solid #537F5D;
          font-family: 'Manrope', sans-serif;
        }
        .leaflet-popup-tip {
          background: #537F5D;
        }
        .leaflet-container a.leaflet-popup-close-button {
          color: #537F5D;
        }
        .leaflet-div-icon {
          background: transparent;
          border: none;
        }
      `}</style>

      {/* 
        Key prop forces re-render if center changes significantly if needed, 
        but MapController handles smooth panning.
        We ensure centerPosition is never NaN here.
      */}
      <MapContainer
        center={centerPosition}
        zoom={13}
        scrollWheelZoom={false}
        className="h-full w-full z-10 bg-[#e3e4b6]" // Set background color to match tiles
        zoomControl={false} // Minimalist look
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        <MapController center={centerPosition} zoom={13} />

        {validVillas.map((villa) => (
          <Marker
            key={villa.id}
            position={[villa.latitude, villa.longitude]}
            icon={createCustomIcon(villa.id === activeVillaId)}
          >
            <Popup>
              <div className="flex flex-col gap-2 min-w-[150px]">
                <img src={villa.imageUrl} alt={villa.name} className="w-full h-24 object-cover" />
                <h4 className="font-serif text-lg font-bold leading-none">{villa.name}</h4>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${villa.latitude},${villa.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] uppercase tracking-widest underline hover:text-white transition-colors"
                >
                  Get Directions
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Decorative Overlay to blend map edges into the page background if needed */}
      <div className="absolute inset-0 pointer-events-none border-[20px] border-[#D3D49F]/20 z-20 hidden md:block"></div>
    </div>
  );
};

export default MapComponent;