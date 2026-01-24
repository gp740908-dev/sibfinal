
'use client';

import React, { useState, Suspense, lazy, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Link from 'next/link';
import { Villa } from '../../types';
import { BookingWidget } from '../booking/BookingWidget';
import {
  ArrowLeft, Wifi, Wind, Waves, Coffee, Shield, X, Maximize2,
  MapPin, Clock, Ban, Cigarette, Dog, CheckCircle2, Bed, Tv, Utensils
} from 'lucide-react';

// Lazy load map
const MapComponent = lazy(() => import('../home/MapComponent'));

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

    // Hero Gallery Entrance
    tl.from('.hero-gallery-item', {
      y: 100,
      opacity: 0,
      duration: 1.2,
      stagger: 0.1,
      ease: 'power3.out'
    })
      .from('.villa-title', {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      }, "-=0.8")
      .from('.villa-meta', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out'
      }, "-=0.6");
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
    <div ref={containerRef} className="bg-sand min-h-screen pt-24 pb-20 text-forest">

      {/* 1. HERO GALLERY (Bento Grid) */}
      <section className="px-4 md:px-12 max-w-7xl mx-auto mb-8">
        <Link
          href="/villas"
          className="flex items-center gap-2 text-forest/60 hover:text-forest text-xs uppercase tracking-widest mb-6 transition-colors inline-block"
        >
          <ArrowLeft size={14} /> Back to Collection
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-2 h-[50vh] md:h-[60vh] rounded-2xl overflow-hidden relative group">
          <div className="hero-gallery-item md:col-span-2 md:row-span-2 relative cursor-pointer overflow-hidden" onClick={() => { setActiveImageIndex(0); setLightboxOpen(true); }}>
            <img src={galleryImages[0]} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" alt="Main View" />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors" />
          </div>
          {galleryImages.slice(1, 5).map((img, idx) => (
            <div key={idx} className="hero-gallery-item hidden md:block relative cursor-pointer overflow-hidden" onClick={() => { setActiveImageIndex(idx + 1); setLightboxOpen(true); }}>
              <img src={img} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" alt={`Gallery ${idx}`} />
              <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors" />
            </div>
          ))}
          <button
            onClick={() => setLightboxOpen(true)}
            className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md text-forest px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest shadow-lg hover:bg-white transition-all flex items-center gap-2"
          >
            <Maximize2 size={14} /> View Photos
          </button>
        </div>
      </section>

      {/* STICKY SUB-NAV */}
      <div className="sticky top-[72px] md:top-[88px] z-40 bg-sand/95 backdrop-blur-md border-b border-forest/10 px-4 md:px-12 mb-12 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto flex gap-6 md:gap-10 overflow-x-auto no-scrollbar">
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`py-4 text-xs md:text-sm uppercase tracking-widest whitespace-nowrap border-b-2 transition-colors duration-300
                 ${activeSection === section.id ? 'border-forest text-forest font-bold' : 'border-transparent text-forest/50 hover:text-forest'}
               `}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="px-4 md:px-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20">

        {/* LEFT COLUMN: Content */}
        <div className="lg:col-span-2 space-y-20">

          {/* SECTION: OVERVIEW */}
          <div id="overview" className="scroll-mt-48">
            <h1 className="villa-title text-4xl md:text-5xl font-serif mb-4">{villa.name}</h1>
            <div className="villa-meta flex flex-wrap gap-4 text-sm font-sans text-forest/70 uppercase tracking-wider mb-8">
              <span>{villa.guests} Guests</span> • <span>{villa.bedrooms} Bedrooms</span> • <span>{villa.bathrooms} Baths</span> • <span>{villa.building_area} m²</span>
            </div>

            {/* Highlights */}
            <div className="flex flex-wrap gap-6 mb-8 border-y border-forest/10 py-6">
              <div className="flex items-center gap-3"><Waves size={20} className="text-forest/70" /> <span className="text-sm text-neutral-700">Private Pool</span></div>
              <div className="flex items-center gap-3"><Wifi size={20} className="text-forest/70" /> <span className="text-sm text-neutral-700">Fast Wifi (100Mbps)</span></div>
              <div className="flex items-center gap-3"><Shield size={20} className="text-forest/70" /> <span className="text-sm text-neutral-700">24/7 Security</span></div>
              <div className="flex items-center gap-3"><Coffee size={20} className="text-forest/70" /> <span className="text-sm text-neutral-700">Daily Breakfast</span></div>
            </div>

            {/* Narrative Description */}
            <div className="mb-10">
              <p className={`font-sans text-neutral-800 text-lg leading-relaxed ${!isDescExpanded && 'line-clamp-4'}`}>
                {villa.description} Experience the true essence of Ubud in this curated sanctuary.
                Designed to blend traditional Balinese architecture with modern luxury, every corner tells a story.
                Wake up to the symphony of the jungle, enjoy a floating breakfast in your private infinity pool,
                and let our dedicated concierge team take care of your every need.
                The villa features open-plan living areas that invite the breeze, locally sourced sustainable materials, and art pieces from Ubud's finest craftsmen.
              </p>
              <button
                onClick={() => setIsDescExpanded(!isDescExpanded)}
                className="mt-2 text-xs font-bold uppercase tracking-widest border-b border-forest pb-0.5 hover:opacity-70"
              >
                {isDescExpanded ? 'Read Less' : 'Read More'}
              </button>
            </div>

            {/* Sleeping Arrangements */}
            <div className="bg-white/40 p-6 rounded-2xl border border-white/60">
              <h3 className="font-serif text-xl mb-4">Sleeping Arrangements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sleepingArrangements.map((room, idx) => (
                  <div key={idx} className="flex gap-4 items-start p-3 bg-sand/30 rounded-lg">
                    <Bed size={24} className="mt-1 text-forest/70" />
                    <div>
                      <span className="block font-bold text-sm">{room.room}</span>
                      <span className="block text-sm opacity-80">{room.bed}</span>
                      <span className="block text-xs opacity-60 mt-1">{room.view}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION: AMENITIES */}
          <div id="amenities" className="scroll-mt-48 border-t border-forest/10 pt-12">
            <h2 className="text-3xl font-serif mb-8">What this place offers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
              {Object.entries(amenitiesDetail).map(([category, items]) => (
                <div key={category}>
                  <h3 className="text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                    {category === 'Bathroom' && <Waves size={16} />}
                    {category === 'Entertainment' && <Tv size={16} />}
                    {category === 'Kitchen' && <Utensils size={16} />}
                    {category === 'Bedroom' && <Bed size={16} />}
                    {category === 'Family' && <Shield size={16} />}
                    {category === 'Outdoor' && <Wind size={16} />}
                    {category}
                  </h3>
                  <ul className="space-y-3">
                    {items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-neutral-800 text-sm">
                        <CheckCircle2 size={16} className="mt-0.5 text-forest/40 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION: LOCATION */}
          <div id="location" className="scroll-mt-48 border-t border-forest/10 pt-12">
            <h2 className="text-3xl font-serif mb-8">Where you'll be</h2>
            <div className="flex flex-col md:flex-row gap-8">

              {/* Map */}
              <div className="w-full md:w-2/3 h-[400px] rounded-2xl overflow-hidden border border-forest/10 relative z-0">
                <Suspense fallback={<div className="bg-forest/5 w-full h-full flex items-center justify-center">Loading Map...</div>}>
                  <MapComponent villas={[villa]} activeVillaId={villa.id} />
                </Suspense>
              </div>

              {/* Proximity List */}
              <div className="w-full md:w-1/3 flex flex-col gap-6 justify-center">
                <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                  <MapPin size={16} /> Nearby
                </h3>
                <div className="space-y-6">
                  {proximity.map((place, idx) => (
                    <div key={idx} className="flex items-center justify-between group">
                      <span className="text-sm font-medium">{place.name}</span>
                      <div className="flex-1 border-b border-dashed border-forest/20 mx-4 relative top-1"></div>
                      <span className="text-xs opacity-70 whitespace-nowrap">{place.distance}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* SECTION: HOUSE RULES */}
          <div id="rules" className="scroll-mt-48 border-t border-forest/10 pt-12 pb-12">
            <h2 className="text-3xl font-serif mb-8">Things to know</h2>
            <div className="bg-white/30 border border-white/60 p-8 rounded-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">

                {/* Logistics */}
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Clock className="mt-1 text-forest/70" />
                    <div>
                      <span className="block font-bold text-sm">Check-in</span>
                      <span className="text-sm opacity-80">After {houseRules.check_in}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Clock className="mt-1 text-forest/70" />
                    <div>
                      <span className="block font-bold text-sm">Check-out</span>
                      <span className="text-sm opacity-80">Before {houseRules.check_out}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Wind className="mt-1 text-forest/70" />
                    <div>
                      <span className="block font-bold text-sm">Quiet Hours</span>
                      <span className="text-sm opacity-80">{houseRules.quiet_hours}</span>
                    </div>
                  </div>
                </div>

                {/* Policies */}
                <div className="space-y-6">
                  <div className="flex items-center gap-4 text-sm">
                    {houseRules.parties ? <CheckCircle2 size={20} /> : <Ban size={20} className="text-forest/60" />}
                    <span className={houseRules.parties ? "" : "opacity-80"}>
                      {houseRules.parties ? "Parties allowed" : "No parties or events"}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    {houseRules.smoking ? <Cigarette size={20} /> : <Ban size={20} className="text-forest/60" />}
                    <span className={houseRules.smoking ? "" : "opacity-80"}>
                      {houseRules.smoking ? "Smoking allowed" : "No smoking inside"}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    {houseRules.pets ? <Dog size={20} /> : <Ban size={20} className="text-forest/60" />}
                    <span className={houseRules.pets ? "" : "opacity-80"}>
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
          <BookingWidget
            pricePerNight={villa.pricePerNight}
            villaName={villa.name}
            villaId={villa.id}
            blockedDates={blockedDates}
          />
        </div>

      </div>

      {/* 3. SIMILAR VILLAS */}
      <section className="px-4 md:px-12 max-w-7xl mx-auto mt-24 pt-12 border-t border-forest/10">
        <h2 className="text-3xl md:text-4xl font-serif text-forest mb-12">More Sanctuaries</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {similarVillas.map(v => (
            <Link key={v.id} href={`/villas/${v.id}`} className="group">
              <div className="aspect-[4/3] overflow-hidden rounded-xl mb-4">
                <img
                  src={v.imageUrl}
                  alt={v.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <h3 className="font-serif text-xl text-forest mb-1 group-hover:underline">{v.name}</h3>
              <p className="font-sans text-sm text-forest/60">{v.bedrooms} Bedrooms • {v.guests} Guests</p>
            </Link>
          ))}
        </div>
      </section>

      {/* LIGHTBOX MODAL */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[100] bg-forest/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12 animate-fade-in">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-8 right-8 text-sand hover:text-white transition-colors"
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
