import React from 'react';
import { Metadata } from 'next';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';

export const metadata: Metadata = {
    title: 'Contact Us | StayinUBUD',
    description: 'Get in touch with our concierge team to plan your perfect Ubud getaway.',
};

export default function ContactPage() {
    return (
        <main className="bg-sand-light min-h-screen pt-32 pb-20">
            <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
                <h1 className="text-4xl md:text-6xl font-serif text-forest mb-8">Contact Us</h1>
                <p className="text-forest-dark/80 text-lg mb-12">
                    We are here to assist with your reservations and inquiries.
                </p>

                <div className="bg-white p-8 rounded-lg shadow-sm border border-forest/10 max-w-xl mx-auto">
                    <p className="mb-4">
                        <strong>WhatsApp / Phone:</strong> <br />
                        <a href="https://wa.me/6282269128232" className="text-accent hover:underline">+62 822-6912-8232</a>
                    </p>
                    <p className="mb-4">
                        <strong>Email:</strong> <br />
                        <a href="mailto:host@stayinubud.com" className="text-accent hover:underline">host@stayinubud.com</a>
                    </p>
                    <p>
                        <strong>Address:</strong> <br />
                        Jl. Raya Ubud, Bali, Indonesia 80571
                    </p>
                </div>
            </div>
        </main>
    );
}
