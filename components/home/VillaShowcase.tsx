import React, { useState, useEffect } from 'react';
import { Villa } from '../../types';
import { 
  Maximize, 
  Home, 
  Building, 
  BedDouble, 
  Bath, 
  Armchair, 
  Waves, 
  Utensils, 
  ChevronLeft, 
  ChevronRight,
  Phone,
  Loader2,
  ArrowRight
} from 'lucide-react';

interface VillaShowcaseProps {
  villas: Villa[];
  onNavigate: (view: 'villas') => void;
  onVillaClick: (id: string) => void;
}

export const VillaShowcase: React.FC<VillaShowcaseProps> = ({ villas, onNavigate, onVillaClick }) => {
  const [activeTabId, setActiveTabId] = useState<string>('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Sync active tab when data arrives
  useEffect(() => {
    if (villas.length > 0 && !activeTabId) {
      setActiveTabId(villas[0].id);
    }
  }, [villas, activeTabId]);

  const activeVilla = villas.find(v => v.id === activeTabId) || villas[0];

  // Mock carousel images (repeating the main image for demo purposes if no gallery)
  const carouselImages = activeVilla 
    ? (activeVilla.images && activeVilla.images.length > 0 ? activeVilla.images : [activeVilla.imageUrl, activeVilla.imageUrl]) 
    : [];

  const handleNextImage = () => {
    if (carouselImages.length === 0) return;
    setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
  };

  const handlePrevImage = () => {
    if (carouselImages.length === 0) return;
    setCurrentImageIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  const handleTabClick = (id: string) => {
    setActiveTabId(id);
    setCurrentImageIndex(0); // Reset carousel on tab change
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price).replace('Rp', 'Rp ').replace(',00', ',-');
  };

  return (
    <section className="py-20 px-4 md:px-12 bg-[#D3D49F] relative z-20">
      <div className="max-w-7xl mx-auto">
        
        {/* A. Section Header - Always visible to maintain layout */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-5xl font-serif text-forest tracking-tight">FEATURED VILLAS</h2>
          <div className="h-1 w-20 bg-forest mx-auto mt-4 opacity-20"></div>
        </div>

        {/* Loading / Empty State */}
        {(!villas || villas.length === 0) ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-50 space-y-4">
             <Loader2 className="animate-spin text-forest" />
             <span className="font-serif italic text-forest">Summoning sanctuaries...</span>
          </div>
        ) : (
          <>
            {/* B. The Tabs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-forest/20 border border-forest/20 mb-8 rounded-sm overflow-hidden">
              {villas.map((villa) => {
                const isActive = activeTabId === villa.id;
                return (
                  <button
                    key={villa.id}
                    onClick={() => handleTabClick(villa.id)}
                    className={`py-4 px-2 text-center text-xs md:text-sm font-sans uppercase tracking-widest transition-all duration-300 h-full flex items-center justify-center
                      ${isActive 
                        ? 'bg-forest text-sand font-bold shadow-inner' 
                        : 'bg-[#D3D49F] text-forest hover:bg-forest/10'}
                    `}
                  >
                    {villa.name}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col lg:flex-row gap-12 animate-fade-in">
              
              {/* C. Image Carousel */}
              <div className="lg:w-1/2 relative group">
                {activeVilla && (
                  <div className="aspect-[4/3] w-full overflow-hidden rounded-sm shadow-2xl relative">
                    <img 
                      src={carouselImages[currentImageIndex]} 
                      alt={activeVilla.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out transform scale-100 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest/40 to-transparent opacity-60"></div>
                    
                    {/* Carousel Controls */}
                    {carouselImages.length > 1 && (
                      <>
                        <button 
                          onClick={handlePrevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-sand/80 text-forest rounded-full flex items-center justify-center hover:bg-white transition-colors"
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <button 
                          onClick={handleNextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-sand/80 text-forest rounded-full flex items-center justify-center hover:bg-white transition-colors"
                        >
                          <ChevronRight size={20} />
                        </button>

                        {/* Carousel Dots */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                          {carouselImages.map((_, idx) => (
                            <div 
                              key={idx} 
                              className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-sand w-4' : 'bg-sand/50'}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* D & E. Info & Specs */}
              <div className="lg:w-1/2 flex flex-col justify-between">
                
                {activeVilla && (
                  <>
                    {/* Main Info */}
                    <div className="mb-8 border-b border-forest/10 pb-6">
                      <h3 className="text-4xl md:text-5xl font-serif text-forest mb-4 uppercase leading-none">
                        {activeVilla.name}
                      </h3>
                      <p className="text-forest/80 font-sans text-lg leading-relaxed mb-6">
                        {activeVilla.description}
                      </p>
                      
                      <div className="flex items-end gap-2">
                        <span className="text-forest/60 font-sans text-sm uppercase tracking-wider mb-2">Start From</span>
                        <span className="text-3xl md:text-4xl font-serif text-forest font-bold">
                          {formatPrice(activeVilla.pricePerNight)}
                        </span>
                      </div>
                    </div>

                    {/* Specifications Grid */}
                    <div className="mb-8">
                      <h4 className="text-forest font-sans text-xs tracking-[0.2em] uppercase font-bold mb-6 opacity-70">
                        Specifications
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">
                        <SpecItem icon={<Maximize size={18}/>} label="Land Area" value={`${activeVilla.land_area} sqm`} />
                        <SpecItem icon={<Home size={18}/>} label="Building Area" value={`${activeVilla.building_area} sqm`} />
                        <SpecItem icon={<Building size={18}/>} label="Levels" value={`${activeVilla.levels} Floors`} />
                        <SpecItem icon={<BedDouble size={18}/>} label="Bedrooms" value={`${activeVilla.bedrooms} Rooms`} />
                        <SpecItem icon={<Bath size={18}/>} label="Bathrooms" value={`${activeVilla.bathrooms} Rooms`} />
                        <SpecItem icon={<Armchair size={18}/>} label="Living Room" value="1 Room" />
                        <SpecItem icon={<Waves size={18}/>} label="Pool" value="Private" />
                        <SpecItem icon={<Utensils size={18}/>} label="Pantry" value={`${activeVilla.pantry} Kitchen`} />
                      </div>
                    </div>

                    {/* F. Footer CTA */}
                    <div className="flex flex-col gap-3 items-start w-full">
                      
                      {/* 1. Primary Action: View Details */}
                      <button 
                        onClick={() => onVillaClick(activeVilla.id)}
                        className="bg-forest border border-forest text-sand px-8 py-3 uppercase tracking-widest text-sm font-bold hover:bg-forest/90 transition-all duration-300 w-full md:w-auto shadow-lg flex items-center justify-center gap-2"
                      >
                        View Details <ArrowRight size={16} />
                      </button>

                      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center w-full md:w-auto">
                        {/* 2. Secondary Action: Explore All */}
                        <button 
                          onClick={() => onNavigate('villas')}
                          className="bg-transparent border border-forest text-forest px-8 py-3 uppercase tracking-widest text-sm font-bold hover:bg-forest hover:text-sand transition-colors duration-300 w-full md:w-auto"
                        >
                          Explore All Villas
                        </button>
                        
                        {/* 3. Contact Action */}
                        <button className="flex items-center gap-2 text-forest font-sans text-sm uppercase tracking-wider hover:text-accent transition-colors py-2 md:py-0">
                          <div className="w-10 h-10 rounded-full border border-forest flex items-center justify-center">
                            <Phone size={18} />
                          </div>
                          <span>Contact Agent</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}

              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

// Helper Component for Specs
const SpecItem: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="flex flex-col gap-1 group">
    <div className="text-forest/70 group-hover:text-forest transition-colors">{icon}</div>
    <span className="text-[10px] uppercase tracking-widest text-forest/50">{label}</span>
    <span className="text-forest font-serif text-lg leading-none">{value}</span>
  </div>
);