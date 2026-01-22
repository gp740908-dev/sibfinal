
import React from 'react';
import { Playfair_Display, Manrope } from 'next/font/google';
import { Metadata, Viewport } from 'next';
import './globals.css';
import 'leaflet/dist/leaflet.css';
import 'react-day-picker/dist/style.css';
import { JsonLd } from '@/components/seo/JsonLd';
import { ClientLayout } from '@/components/layout/ClientLayout';

// 1. Font Optimization (Zero Layout Shift)
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600'],
});

// 2. Viewport & Accessibility
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5, // Allow zooming for accessibility
  themeColor: '#537F5D',
};

// 3. Global Metadata & Open Graph
export const metadata: Metadata = {
  metadataBase: new URL('https://stayinubud.com'), // Replace with actual domain
  title: {
    template: '%s | StayinUBUD',
    default: 'StayinUBUD | Luxury Villas & Private Pool Rentals',
  },
  description: 'Experience the ultimate Bali getaway. Luxury private pool villas in the heart of the Ubud jungle. Personal concierge, yoga shalas, and authentic Balinese hospitality.',
  keywords: ['Luxury Villa Ubud', 'Bali Private Pool Villa', 'Ubud Jungle Rental', 'StayinUBUD', 'Bali Honeymoon', 'Rice Terrace Villa'],
  authors: [{ name: 'StayinUBUD Team' }],
  creator: 'StayinUBUD',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://stayinubud.com',
    title: 'StayinUBUD | Luxury Jungle Sanctuaries',
    description: 'Discover curated luxury homes in Ubud, Bali.',
    siteName: 'StayinUBUD',
    images: [
      {
        url: '/og-image.jpg', // Ensure this exists in public/
        width: 1200,
        height: 630,
        alt: 'StayinUBUD Infinity Pool overlooking Jungle',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StayinUBUD | Luxury Villas',
    description: 'Escape to the jungle.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: './',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'StayinUBUD',
    url: 'https://stayinubud.com',
    logo: 'https://stayinubud.com/logo.png',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+62-812-3456-7890',
      contactType: 'reservations',
      areaServed: 'ID',
      availableLanguage: ['English', 'Indonesian'],
    },
    sameAs: [
      'https://instagram.com/stayinubud',
      'https://facebook.com/stayinubud',
    ],
  };

  return (
    <html lang="en" className={`${playfair.variable} ${manrope.variable} scroll-smooth`}>
      <head>
        {/* Organization Schema for Knowledge Graph */}
        <JsonLd data={organizationSchema} />
      </head>
      <body className="bg-sand text-forest antialiased min-h-screen flex flex-col">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
