import { Villa } from '@/types';

export const MOCK_VILLAS: Villa[] = [
    {
        id: '1',
        name: 'Royal Jungle Suite',
        description: 'A sanctuary of peace nestled in the rice terraces, offering refined luxury with a touch of Balinese heritage.',
        pricePerNight: 3500000,
        bedrooms: 2,
        guests: 4,
        imageUrl: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=1200',
        images: ['https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=1200'],
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
        images: ['https://images.unsplash.com/photo-1533759413974-9e15f3b745ac?auto=format&fit=crop&q=80&w=1200'],
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
        images: ['https://images.unsplash.com/photo-1601369363069-425b09579de0?auto=format&fit=crop&q=80&w=1200'],
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
        images: ['https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=1200'],
        features: ['Sunset View', 'Infinity Pool', 'Butler Service'],
        land_area: 300, building_area: 210, levels: 1, bathrooms: 2, pantry: 1, pool_area: 1,
        latitude: -8.4850, longitude: 115.2400
    }
];
