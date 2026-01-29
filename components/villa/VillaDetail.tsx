'use client';

import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Villa } from '../../types';
import { BookingWidget } from '../booking/BookingWidget';
import {
  ArrowLeft, ArrowRight, Wifi, Wind, Waves, Coffee, Shield, X, Maximize2,
  MapPin, Clock, Ban, Cigarette, Dog, CheckCircle2, Bed, Tv, Utensils
} from 'lucide-react';

// Lazy load map with no SSR to prevent Leaflet window errors
const MapComponent = dynamic(() => import('../home/MapComponent'), {
  ssr: false,
  loading: () => <div className="bg-forest/5 w-full h-full flex items-center justify-center">Loading Map...</div>
});

interface VillaDetailProps {
  villa: Villa;
  allVillas: Villa[];
  blockedDates?: Date[];
}

const SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'amenities', label: 'Amenities' },
  { id: 'location', label: 'Location' },
  { id: 'rules', label: 'House Rules' },
];

export const VillaDetail: React.FC<VillaDetailProps> = ({
  villa,
  allVillas,
  blockedDates = []
}) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeSection, setActiveSection] = useState('overview');
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();

    // Cinematic Hero Entrance
    tl.from('.hero-bg', {
      scale: 1.1,
      duration: 2,
      ease: 'power2.out'
    })
      .from('.hero-content > *', {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out'
      }, "-=1.5");
  }, { scope: containerRef });

  // Fallback Data if DB is empty or missing JSON fields
  const amenitiesDetail: Record<string, string[]> = villa.amenities_detail || {
    "Bathroom": ["Hair dryer", "Bathtub", "Premium shampoo", "Hot water", "Bathrobes"],
    "Bedroom": ["King-size bed", "Cotton linens", "Safe", "Wardrobe", "Iron"],
    "Entertainment": ["HDTV with Netflix", "Bluetooth Speaker", "High-speed Wi-Fi"],
    "Kitchen": ["Microwave", "Refrigerator", "Coffee Maker", "Stove", "Water dispenser"],
    "Outdoor": ["Private Pool", "Sun loungers", "Terrace"]
  };

  const houseRules = villa.house_rules || {
    check_in: "14:00",
    check_out: "11:00",
    quiet_hours: "22:00 - 07:00",
    parties: false,
    smoking: false,
    pets: false,
    max_guests: 4
  };

  const sleepingArrangements = villa.sleeping_arrangements || [
    { room: "Bedroom 1", bed: "1 King Bed", view: "Jungle View" },
    { room: "Bedroom 2", bed: "2 Twin Beds", view: "Garden View" }
  ];

  const proximity = villa.proximity_list || [
    { name: "Ubud Center", distance: "15 min drive" },
    { name: "Monkey Forest", distance: "20 min drive" },
    { name: "Ngurah Rai Airport", distance: "90 min drive" }
  ];

  // Images
  const galleryImages = villa.images && villa.images.length > 0
    ? villa.images
    : [villa.imageUrl, villa.imageUrl, villa.imageUrl, villa.imageUrl, villa.imageUrl];

  const similarVillas = allVillas.filter(v => v.id !== villa.id).slice(0, 3);

  // Scroll Spy for Sticky Nav
  React.useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const section of SECTIONS) {
        const element = document.getElementById(section.id);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(section.id);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -140;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  return (
    <div ref={containerRef} className="bg-sand min-h-screen pb-20 text-forest-dark selection:bg-forest selection:text-sand-light">

      {/* 1. CINEMATIC HERO HEADER */}
      <header className="relative w-full h-[85vh] overflow-hidden">
        {/* Background Image with Parallax Scale Init */}
        <div className="hero-bg absolute inset-0 w-full h-full">
          <img
            src={galleryImages[0]}
            alt={villa.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>

        {/* Top Nav Overlay */}
        <div className="absolute top-0 left-0 right-0 p-6 md:p-12 z-20 flex justify-between items-start">
          <Link
            href="/villas"
            className="flex items-center gap-2 text-white/80 hover:text-white text-xs uppercase tracking-[0.2em] transition-colors border border-white/20 px-4 py-2 rounded-full backdrop-blur-sm hover:bg-white/10"
          >
            <ArrowLeft size={14} /> Back to Collection
          </Link>
        </div>

        {/* Hero Content */}
        <div className="hero-content absolute bottom-0 left-0 right-0 p-6 md:p-12 z-20 text-white pb-20 md:pb-24">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-end justify-between gap-8">
            <div className="max-w-3xl">
              <span className="block text-sand-light font-sans text-xs md:text-sm font-bold uppercase tracking-[0.2em] mb-4">
                Luxury Sanctuary in Ubud
              </span>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif mb-6 leading-[0.9]">
                {villa.name}
              </h1>
              <div className="flex flex-wrap gap-6 text-sm md:text-base font-medium opacity-90">
                <span className="flex items-center gap-2"><MapPin size={18} /> Ubud, Bali</span>
                <span className="flex items-center gap-2">{villa.guests} Guests</span>
                <span className="flex items-center gap-2">{villa.bedrooms} Bedrooms</span>
                <span className="flex items-center gap-2">{villa.building_area} m²</span>
              </div>
            </div>

            <button
              onClick={() => setLightboxOpen(true)}
              className="flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white px-6 py-4 rounded-lg uppercase tracking-widest text-xs font-bold transition-all group"
            >
              <Maximize2 size={16} />
              View All Photos
              <span className="bg-white text-black text-[10px] w-6 h-6 flex items-center justify-center rounded-full ml-2">
                {galleryImages.length}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* STICKY SUB-NAV */}
      <div className="bg-sand border-b border-forest/5 px-4 md:px-12 mb-12 transition-all">
        <div className="max-w-7xl mx-auto flex gap-8 md:gap-12 overflow-x-auto no-scrollbar">
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`py-6 text-xs font-bold uppercase tracking-widest whitespace-nowrap border-b-2 transition-all duration-300
                 ${activeSection === section.id ? 'border-forest-dark text-forest-dark' : 'border-transparent text-forest-dark/40 hover:text-forest-dark'}
               `}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="px-4 md:px-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-24">

        {/* LEFT COLUMN: Content */}
        <div className="lg:col-span-2 space-y-20">

          {/* SECTION: OVERVIEW */}
          <div id="overview" className="scroll-mt-48">
            <h2 className="text-3xl font-serif text-forest-dark mb-8">The Experience</h2>

            {/* Highlights - Modern Style */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {[
                { icon: Waves, label: "Private Pool", key: "pool" },
                { icon: Wifi, label: "Fast Wifi", key: "wifi" },
                { icon: Shield, label: "24/7 Service", key: "service" },
                { icon: Coffee, label: "Breakfast", key: "breakfast" },
                { icon: Wind, label: "AC", key: "ac" },
                { icon: Utensils, label: "Kitchen", key: "kitchen" }
              ]
                .filter(item => {
                  // Always show if no features list (fallback) or if feature keyword matches
                  if (!villa.features || villa.features.length === 0) return true;
                  return villa.features.some(f => f.toLowerCase().includes(item.key) || f.toLowerCase().includes(item.label.toLowerCase()));
                })
                .slice(0, 4) // Limit to 4 items max for grid
                .map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center justify-center p-6 border border-forest/10 rounded-xl hover:bg-forest/5 transition-colors text-center">
                    <item.icon size={24} className="text-forest-dark mb-3" />
                    <span className="text-xs uppercase tracking-wider font-bold text-forest-dark/80">{item.label}</span>
                  </div>
                ))}
            </div>

            {/* Narrative Description */}
            <div className="mb-10">
              <p className={`font-sans text-text-body text-lg leading-relaxed ${!isDescExpanded && 'line-clamp-4'}`}>
                {villa.description} Experience the true essence of Ubud in this curated sanctuary.
                Designed to blend traditional Balinese architecture with modern luxury, every corner tells a story.
                Wake up to the symphony of the jungle, enjoy a floating breakfast in your private infinity pool,
                and let our dedicated concierge team take care of your every need.
                The villa features open-plan living areas that invite the breeze, locally sourced sustainable materials, and art pieces from Ubud's finest craftsmen.
              </p>
              <button
                onClick={() => setIsDescExpanded(!isDescExpanded)}
                className="mt-4 text-xs font-bold uppercase tracking-widest border-b border-forest pb-0.5 hover:opacity-70"
              >
                {isDescExpanded ? 'Read Less' : 'Read More'}
              </button>
            </div>

            {/* Sleeping Arrangements */}
            <div className="bg-white/40 p-8 rounded-2xl border border-white/60">
              <h3 className="font-serif text-2xl mb-6">Sleeping Arrangements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sleepingArrangements.map((room, idx) => (
                  <div key={idx} className="flex gap-4 items-start p-4 bg-sand/30 rounded-xl border border-forest/5">
                    <div className="bg-white p-2 rounded-full text-forest-dark">
                      <Bed size={20} />
                    </div>
                    <div>
                      <span className="block font-bold text-base">{room.room}</span>
                      <span className="block text-sm opacity-80 mt-1">{room.bed}</span>
                      <span className="block text-xs opacity-60 mt-1 uppercase tracking-wider">{room.view}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION: AMENITIES */}
          <div id="amenities" className="scroll-mt-48 border-t border-forest/10 pt-16">
            <h2 className="text-3xl font-serif mb-10">Amenities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
              {Object.entries(amenitiesDetail).map(([category, items]) => (
                <div key={category}>
                  <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-3 text-forest-dark/40">
                    {category === 'Bathroom' && <Waves size={14} />}
                    {category === 'Entertainment' && <Tv size={14} />}
                    {category === 'Kitchen' && <Utensils size={14} />}
                    {category === 'Bedroom' && <Bed size={14} />}
                    {category === 'Family' && <Shield size={14} />}
                    {category === 'Outdoor' && <Wind size={14} />}
                    {category}
                  </h3>
                  <ul className="space-y-4">
                    {items.map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-forest-dark font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-forest/30"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION: LOCATION */}
          <div id="location" className="scroll-mt-48 border-t border-forest/10 pt-16">
            <h2 className="text-3xl font-serif mb-8">Location</h2>
            <div className="flex flex-col md:flex-row gap-8">

              {/* Map */}
              <div className="w-full md:w-2/3 h-[450px] rounded-2xl overflow-hidden border border-forest/10 relative z-0 shadow-lg">
                <MapComponent villas={[villa]} activeVillaId={villa.id} />
              </div>

              {/* Proximity List */}
              <div className="w-full md:w-1/3 flex flex-col gap-2 justify-center">
                <h3 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 mb-4 text-forest-dark/50">
                  <MapPin size={14} /> Nearby
                </h3>
                <div className="space-y-2">
                  {proximity.map((place, idx) => (
                    <div key={idx} className="flex items-center justify-between group p-4 bg-white/40 rounded-xl border border-transparent hover:border-forest/10 transition-all">
                      <span className="text-sm font-bold text-forest-dark">{place.name}</span>
                      <span className="text-xs opacity-70 whitespace-nowrap bg-white px-2 py-1 rounded-md">{place.distance}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* SECTION: HOUSE RULES */}
          <div id="rules" className="scroll-mt-48 border-t border-forest/10 pt-16 pb-12">
            <h2 className="text-3xl font-serif mb-8">Things to know</h2>
            <div className="bg-forest text-sand-light p-8 md:p-12 rounded-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">

                {/* Logistics */}
                <div className="space-y-6">
                  <h4 className="text-xs font-bold uppercase tracking-widest opacity-50 mb-6">Logistics</h4>
                  <div className="flex justify-between items-center border-b border-sand/10 pb-4">
                    <span className="font-serif text-xl">Check-in</span>
                    <span className="font-mono text-sm opacity-80">After {houseRules.check_in}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-sand/10 pb-4">
                    <span className="font-serif text-xl">Check-out</span>
                    <span className="font-mono text-sm opacity-80">Before {houseRules.check_out}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-sand/10 pb-4">
                    <span className="font-serif text-xl">Quiet Hours</span>
                    <span className="font-mono text-sm opacity-80">{houseRules.quiet_hours}</span>
                  </div>
                </div>

                {/* Policies */}
                <div className="space-y-6">
                  <h4 className="text-xs font-bold uppercase tracking-widest opacity-50 mb-6">House Rules</h4>
                  <div className="flex items-center gap-4 text-sm">
                    {houseRules.parties ? <CheckCircle2 size={20} className="text-accent" /> : <Ban size={20} className="text-sand/40" />}
                    <span className={houseRules.parties ? "" : "opacity-60"}>
                      {houseRules.parties ? "Parties allowed" : "No parties or events"}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    {houseRules.smoking ? <Cigarette size={20} className="text-accent" /> : <Ban size={20} className="text-sand/40" />}
                    <span className={houseRules.smoking ? "" : "opacity-60"}>
                      {houseRules.smoking ? "Smoking allowed" : "No smoking inside"}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    {houseRules.pets ? <Dog size={20} className="text-accent" /> : <Ban size={20} className="text-sand/40" />}
                    <span className={houseRules.pets ? "" : "opacity-60"}>
                      {houseRules.pets ? "Pets allowed" : "No pets allowed"}
                    </span>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Sticky Booking Widget (Desktop) */}
        <div className="lg:col-span-1 h-full">
          <div className="sticky top-32 z-30 w-full">
            <BookingWidget
              pricePerNight={villa.pricePerNight}
              villaName={villa.name}
              villaId={villa.id}
              blockedDates={blockedDates}
            />
          </div>
        </div>

      </div>

      {/* 3. SIMILAR VILLAS */}
      <section className="px-4 md:px-12 max-w-7xl mx-auto mt-24 pt-20 border-t border-forest/10">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-3xl md:text-5xl font-serif text-forest-dark">You may also like</h2>
          <Link href="/villas" className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:underline">
            View Collection <ArrowRight size={14} className="ArrowRight" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {similarVillas.map(v => (
            <Link key={v.id} href={`/villas/${v.id}`} className="group block">
              <div className="aspect-[4/3] overflow-hidden rounded-sm mb-6 relative">
                <img
                  src={v.imageUrl}
                  alt={v.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
              </div>
              <h3 className="font-serif text-2xl text-forest-dark mb-2 group-hover:text-forest-dark/70 transition-colors">{v.name}</h3>
              <p className="font-sans text-xs uppercase tracking-widest text-forest-dark/50">{v.bedrooms} Bedrooms • {v.guests} Guests</p>
            </Link>
          ))}
        </div>
      </section>

      {/* LIGHTBOX MODAL */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[100] bg-forest/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12 animate-fade-in">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-8 right-8 text-sand-light hover:text-white transition-colors"
          >
            <X size={40} />
          </button>

          <div className="w-full h-full max-w-6xl flex items-center justify-center relative">
            <img
              src={galleryImages[activeImageIndex]}
              alt="Full Screen"
              className="max-h-full max-w-full object-contain rounded-sm shadow-2xl"
            />

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {galleryImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${idx === activeImageIndex ? 'bg-sand w-4' : 'bg-sand/30 hover:bg-sand/60'}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
