
import React, { useState, useEffect } from 'react';
import { SmoothScroll } from './components/SmoothScroll';
import { Navbar } from './components/ui/Navbar';
import { Preloader } from './components/ui/Preloader';
import { Footer } from './components/ui/Footer';
import { SocialFab } from './components/ui/SocialFab'; // Imported SocialFab
import { Hero } from './components/home/Hero';
import { VillaShowcase } from './components/home/VillaShowcase';
import { LocationSection } from './components/home/LocationSection'; 
import { OurServices } from './components/home/OurServices'; 
import { RecentJournal } from './components/home/RecentJournal';
import { VideoParallax } from './components/home/VideoParallax';
import { GuestDiaries } from './components/home/GuestDiaries';
import { SignatureDetails } from './components/home/SignatureDetails';
import { Newsletter } from './components/home/Newsletter';
import { Journal } from './components/journal/Journal';
import { About } from './components/about/About';
import { Experiences } from './components/experiences/Experiences';
import { FAQ } from './components/faq/FAQ';
import { ThankYou } from './components/ThankYou';
import { PrivacyPolicy } from './components/legal/PrivacyPolicy';
import { TermsOfService } from './components/legal/TermsOfService';
import { VillaDetail } from './components/villa/VillaDetail';
import { VillasPage } from './components/villas/VillasPage';
import { NotFound } from './components/NotFound';
import { Villa } from './types';
import { supabase, isMock } from './lib/supabase';
import { Loader2, WifiOff, Database, AlertTriangle, KeyRound, Leaf } from 'lucide-react';

// Fallback Data in case Supabase fetch fails
const MOCK_VILLAS: Villa[] = [
  {
    id: '1',
    name: 'Royal Jungle Suite',
    description: 'A sanctuary of peace nestled in the rice terraces, offering refined luxury with a touch of Balinese heritage.',
    pricePerNight: 3500000,
    bedrooms: 2,
    guests: 4,
    imageUrl: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=1200',
    images: ['https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=1200', 'https://images.unsplash.com/photo-1515266591878-5a140887de73?auto=format&fit=crop&q=80&w=800'],
    features: ['Infinity Pool', 'Rice Field View', 'Private Chef'],
    land_area: 250, building_area: 180, levels: 1, bathrooms: 2, pantry: 1, pool_area: 1,
    latitude: -8.5069, longitude: 115.2625
  },
  {
    id: '2',
    name: 'Forest Canopy House',
    description: 'Suspended in the jungle canopy for ultimate privacy, featuring an open-air bath and morning yoga shala.',
    pricePerNight: 5200000,
    bedrooms: 3,
    guests: 6,
    imageUrl: 'https://images.unsplash.com/photo-1533759413974-9e15f3b745ac?auto=format&fit=crop&q=80&w=1200',
    images: ['https://images.unsplash.com/photo-1533759413974-9e15f3b745ac?auto=format&fit=crop&q=80&w=1200', 'https://images.unsplash.com/photo-1588693850720-e4b2d2f34842?auto=format&fit=crop&q=80&w=800'],
    features: ['Jungle View', 'Yoga Shala', 'Open Air Bath'],
    land_area: 400, building_area: 320, levels: 2, bathrooms: 3, pantry: 1, pool_area: 1,
    latitude: -8.4900, longitude: 115.2500
  },
  {
    id: '3',
    name: 'Estate of Zen',
    description: 'Traditional Balinese architecture meets modern luxury. Includes a private cinema and direct river access.',
    pricePerNight: 8500000,
    bedrooms: 5,
    guests: 10,
    imageUrl: 'https://images.unsplash.com/photo-1601369363069-425b09579de0?auto=format&fit=crop&q=80&w=1200',
    images: ['https://images.unsplash.com/photo-1601369363069-425b09579de0?auto=format&fit=crop&q=80&w=1200', 'https://images.unsplash.com/photo-1627947700021-38cb46995646?auto=format&fit=crop&q=80&w=800'],
    features: ['River Access', 'Spa Center', 'Cinema Room'],
    land_area: 900, building_area: 650, levels: 2, bathrooms: 6, pantry: 2, pool_area: 1,
    latitude: -8.5200, longitude: 115.2700
  },
  {
    id: '4',
    name: 'Valley Horizon',
    description: 'Perched on the edge of the Ayung river valley, offering breathtaking sunset views and infinity living.',
    pricePerNight: 4100000,
    bedrooms: 2,
    guests: 4,
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=1200',
    images: ['https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=1200', 'https://images.unsplash.com/photo-1574643156929-51fa098b0394?auto=format&fit=crop&q=80&w=800'],
    features: ['Sunset View', 'Infinity Pool', 'Butler Service'],
    land_area: 300, building_area: 210, levels: 1, bathrooms: 2, pantry: 1, pool_area: 1,
    latitude: -8.4850, longitude: 115.2400
  }
];

// Helper to safely parse coordinates
const safeFloat = (val: any): number => {
  if (val === null || val === undefined) return NaN;
  const num = Number(val);
  return isFinite(num) ? num : NaN;
};

// Mapper function
const mapDbToVilla = (v: any): Villa => ({
  id: v.id,
  name: v.name,
  description: v.description,
  pricePerNight: v.price_per_night,
  bedrooms: v.bedrooms,
  guests: v.guests,
  imageUrl: v.image_url,
  images: v.images || [],
  features: v.features || [],
  land_area: v.land_area,
  building_area: v.building_area,
  levels: v.levels,
  bathrooms: v.bathrooms,
  pantry: v.pantry,
  pool_area: v.pool_area,
  // Ensure latitude/longitude are strictly numbers or NaN (which gets filtered out later)
  latitude: safeFloat(v.latitude),
  longitude: safeFloat(v.longitude),
  amenities_detail: v.amenities_detail,
  house_rules: v.house_rules,
  proximity_list: v.proximity_list,
  sleeping_arrangements: v.sleeping_arrangements
});

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'villas' | 'journal' | 'about' | 'experiences' | 'faq' | 'thank-you' | 'privacy' | 'terms' | 'villa-detail' | 'not-found'>('home');
  const [selectedVillaId, setSelectedVillaId] = useState<string | null>(null);
  const [villas, setVillas] = useState<Villa[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'error' | 'table_missing' | 'auth_error' | 'mock'>('connected');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [seeding, setSeeding] = useState(false);

  // Fetch Villas from Supabase
  useEffect(() => {
    async function fetchVillas() {
      // Strictly enforce mock mode check
      if (isMock) {
        console.log("App running in DEMO MODE (isMock=true)");
        setVillas(MOCK_VILLAS);
        setConnectionStatus('mock');
        setIsLoading(false);
        return;
      }

      console.log("App attempting REAL CONNECTION...");
      try {
        const { data, error } = await supabase.from('villas').select('*');
        
        if (error) {
          console.error('Supabase Error:', JSON.stringify(error, null, 2));
          
          if (error.code === '42P01') {
            setConnectionStatus('table_missing');
            setErrorMessage('Tables Missing in DB');
          } else if (error.message?.includes('AbortError') || error.message?.includes('Failed to fetch')) {
             setConnectionStatus('error');
             setErrorMessage('Network/URL Error');
          } else if (error.code === 'PGRST301' || error.message?.includes('JWT')) {
             setConnectionStatus('auth_error');
             setErrorMessage('Invalid API Key');
          } else {
            setConnectionStatus('error');
            setErrorMessage(error.message || 'Connection Failed');
          }
          
          // Fallback to mock data on error, BUT status is NOT 'mock'
          setVillas(MOCK_VILLAS);
          return;
        }

        if (data && data.length > 0) {
          console.log("Data fetched successfully");
          setConnectionStatus('connected');
          setVillas(data.map(mapDbToVilla));
        } else {
          console.log('DB empty. Seeding initial data...');
          setSeeding(true);
          
          const seedData = MOCK_VILLAS.map(({ id, ...v }) => ({
            name: v.name,
            description: v.description,
            price_per_night: v.pricePerNight,
            bedrooms: v.bedrooms,
            guests: v.guests,
            image_url: v.imageUrl,
            images: v.images,
            features: v.features,
            land_area: v.land_area,
            building_area: v.building_area,
            levels: v.levels,
            bathrooms: v.bathrooms,
            pantry: v.pantry,
            pool_area: v.pool_area,
            latitude: v.latitude,
            longitude: v.longitude
          }));

          const { error: seedError } = await supabase.from('villas').insert(seedData);
          
          if (!seedError) {
             const { data: newData } = await supabase.from('villas').select('*');
             if (newData) setVillas(newData.map(mapDbToVilla));
             setConnectionStatus('connected');
          } else {
             console.error("Auto-seed failed:", JSON.stringify(seedError, null, 2));
             setConnectionStatus('error');
             setErrorMessage('Seeding Failed');
             setVillas(MOCK_VILLAS);
          }
          setSeeding(false);
        }
      } catch (err: any) {
        console.error('Unexpected error:', err);
        setConnectionStatus('error');
        setErrorMessage(err.message || 'Unknown Error');
        setVillas(MOCK_VILLAS);
      } finally {
        setIsLoading(false);
      }
    }

    fetchVillas();
  }, []);

  const handleVillaClick = (id: string) => {
    setSelectedVillaId(id);
    setCurrentView('villa-detail');
  };

  const renderView = () => {
    if (isLoading) {
      return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-sand text-forest relative overflow-hidden">
          {/* Subtle Texture/Gradient Background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(83,127,93,0.05)_0%,transparent_70%)]" />
          
          <div className="relative z-10 flex flex-col items-center">
            
            {/* Custom Luxury Loader */}
            <div className="relative mb-10">
              {/* Outer Slow Ring */}
              <div className="w-20 h-20 border-[1px] border-forest/10 rounded-full animate-[spin_10s_linear_infinite]" />
              
              {/* Inner Faster Segmented Ring */}
              <div className="absolute inset-2 border-[1px] border-forest/30 rounded-full border-t-transparent animate-[spin_3s_linear_infinite_reverse]" />
              
              {/* Pulsing Center Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Leaf size={20} className="text-forest opacity-80 animate-pulse" strokeWidth={1.5} />
              </div>
            </div>

            {/* Typography */}
            <h3 className="font-serif text-2xl md:text-3xl text-forest tracking-wide mb-3 italic">
              {seeding ? "Planting Seeds..." : "Summoning the Jungle"}
            </h3>
            
            <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-forest/50">
              Curating Luxury
            </p>
          </div>
        </div>
      );
    }

    if (currentView === 'not-found') {
      return <NotFound onReturnHome={() => setCurrentView('home')} />;
    }
    
    if (currentView === 'thank-you') {
      return <ThankYou onReturnHome={() => setCurrentView('home')} />;
    }

    if (currentView === 'villa-detail' && selectedVillaId) {
      const selectedVilla = villas.find(v => v.id === selectedVillaId);
      if (selectedVilla) {
        return (
          <VillaDetail 
            villa={selectedVilla} 
            allVillas={villas} 
            onNavigate={(view: string, id?: string) => {
              if (id) setSelectedVillaId(id);
              setCurrentView(view as any);
            }} 
          />
        );
      }
    }

    if (currentView === 'villas') {
      return <VillasPage villas={villas} onVillaClick={handleVillaClick} />;
    }

    if (currentView === 'journal') return <Journal />;
    if (currentView === 'about') return <About />;
    if (currentView === 'experiences') return <Experiences />;
    if (currentView === 'faq') return <FAQ />;
    if (currentView === 'privacy') return <PrivacyPolicy />;
    if (currentView === 'terms') return <TermsOfService />;

    // Home View
    return (
      <div className="flex flex-col w-full">
        {/* Hero Section */}
        <Hero onNavigate={setCurrentView} />

        {/* Intro Text */}
        <section id="about" className="py-24 md:py-32 px-6 md:px-12 max-w-7xl mx-auto flex flex-col md:flex-row gap-16 items-center">
          <div className="md:w-1/2">
            <h2 className="text-4xl md:text-6xl font-serif text-forest leading-tight mb-8">
              Where luxury meets <br/> <span className="italic text-accent">serenity.</span>
            </h2>
          </div>
          <div className="md:w-1/2">
            <p className="text-forest/80 font-sans text-lg leading-relaxed mb-6">
              Ubud is not just a destination; it is a feeling. At StayinUBUD, we select homes that breathe. 
              Our collection features villas that open up to the jungle, float above rice terraces, and offer 
              silence so profound you can hear your own thoughts.
            </p>
            <p className="text-forest/80 font-sans text-lg leading-relaxed">
              Every stay includes 24/7 personal concierge service to ensure your retreat is effortless.
            </p>
          </div>
        </section>

        {/* Villa Showcase Section */}
        <div id="villas">
          <VillaShowcase 
            villas={villas} 
            onNavigate={setCurrentView} 
            onVillaClick={handleVillaClick}
          />
          
          <div className="flex justify-center mt-8 gap-4 mb-20">
             {villas.map(v => (
               <button key={v.id} onClick={() => handleVillaClick(v.id)} className="text-xs uppercase tracking-widest border-b border-forest/20 pb-1 hover:border-forest">
                  View {v.name}
               </button>
             ))}
          </div>
        </div>

        {/* Sensory Video Break */}
        <VideoParallax />

        {/* Experience Section */}
        <div id="experiences">
           <OurServices />
        </div>

        {/* Guest Diaries Social Proof */}
        <GuestDiaries />

        {/* Signature Details (Sticky Scroll) */}
        <SignatureDetails />

        {/* Location Section */}
        <div id="locations">
          <LocationSection villas={villas} />
        </div>

        {/* Recent Journal Section */}
        <div id="journal">
          <RecentJournal onNavigate={setCurrentView} />
        </div>

        {/* Newsletter Section - Final CTA */}
        <Newsletter />
      </div>
    );
  };

  const isTransientView = currentView === 'not-found' || currentView === 'thank-you';

  return (
    <SmoothScroll>
      <Preloader />
      {!isTransientView && (
        <Navbar onNavigate={(view) => setCurrentView(view)} currentView={currentView === 'villa-detail' ? 'about' : currentView} />
      )}

      <div 
        className={`relative z-10 w-full bg-sand flex flex-col ${isTransientView ? 'mb-0' : 'mb-[450px] md:mb-[500px] shadow-[0_25px_50px_-12px_rgba(83,127,93,0.5)] rounded-b-[2rem] md:rounded-b-[3rem]'} overflow-hidden min-h-screen origin-top`}
      >
        {renderView()}
      </div>

      {!isTransientView && <Footer onNavigate={(view) => setCurrentView(view)} />}
      
      {/* Floating Social Button */}
      <SocialFab />

      {/* 
         --- DEBUGGING STATUS INDICATORS --- 
      */}
      
      {/* CASE 1: NETWORK/URL ERROR */}
      {connectionStatus === 'error' && (
        <div className="fixed bottom-4 left-4 z-[100] bg-red-500/90 text-white text-[10px] px-3 py-2 rounded-full flex items-center gap-2 shadow-lg backdrop-blur-sm group cursor-pointer hover:bg-red-600 transition-colors">
          <WifiOff size={12} />
          <span className="font-bold">Connection Failed</span>
          <span className="hidden group-hover:inline opacity-80 border-l border-white/20 pl-2 ml-1">
             {errorMessage} (Using Cached Data)
          </span>
        </div>
      )}

      {/* CASE 2: AUTH/KEY ERROR */}
      {connectionStatus === 'auth_error' && (
        <div className="fixed bottom-4 left-4 z-[100] bg-orange-500/90 text-white text-[10px] px-3 py-2 rounded-full flex items-center gap-2 shadow-lg backdrop-blur-sm group cursor-pointer hover:bg-orange-600 transition-colors">
          <KeyRound size={12} />
          <span className="font-bold">Auth Error</span>
          <span className="hidden group-hover:inline opacity-80 border-l border-white/20 pl-2 ml-1">
             Check API Key
          </span>
        </div>
      )}

      {/* CASE 3: TABLE MISSING */}
      {connectionStatus === 'table_missing' && (
        <div className="fixed bottom-4 left-4 z-[100] bg-yellow-500/90 text-white text-[10px] px-3 py-2 rounded-full flex items-center gap-2 shadow-lg backdrop-blur-sm group cursor-pointer hover:bg-yellow-600 transition-colors">
          <AlertTriangle size={12} />
          <span className="font-bold">Database Empty</span>
          <span className="hidden group-hover:inline opacity-80 border-l border-white/20 pl-2 ml-1">
             SQL Setup Required
          </span>
        </div>
      )}
      
      {/* CASE 4: CONNECTED SUCCESS */}
      {connectionStatus === 'connected' && !isLoading && (
         <div className="fixed bottom-4 left-4 z-[100] bg-forest/90 text-sand text-[10px] px-3 py-2 rounded-full flex items-center gap-2 shadow-lg backdrop-blur-sm pointer-events-none opacity-50 hover:opacity-100 transition-opacity">
          <Database size={12} />
          <span>Supabase Connected</span>
        </div>
      )}

      {/* CASE 5: MOCK MODE */}
      {connectionStatus === 'mock' && !isLoading && (
         <div className="fixed bottom-4 left-4 z-[100] bg-blue-500/90 text-white text-[10px] px-3 py-2 rounded-full flex items-center gap-2 shadow-lg backdrop-blur-sm pointer-events-none opacity-50 hover:opacity-100 transition-opacity">
          <Database size={12} />
          <span>Demo Mode</span>
        </div>
      )}

    </SmoothScroll>
  );
};

export default App;
