'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, X, ChevronRight, MapPin, Sparkles } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface SearchResult {
    id: string;
    title: string;
    category: 'Villa' | 'Experience';
    href: string;
    image?: string;
}

// Mock Data for Autocomplete
const MOCK_RESULTS: SearchResult[] = [
    { id: '1', title: 'Estate of Zen', category: 'Villa', href: '/villas/1' },
    { id: '2', title: 'Valley Horizons', category: 'Villa', href: '/villas/2' },
    { id: '3', title: 'The River House', category: 'Villa', href: '/villas/3' },
    { id: '4', title: 'Private Dining', category: 'Experience', href: '/#experiences' },
    { id: '5', title: 'Holistic Healing', category: 'Experience', href: '/#experiences' },
    { id: '6', title: 'Sacred Tours', category: 'Experience', href: '/#experiences' },
];

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const pathname = usePathname();

    // Reset on open
    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setResults([]);
            setTimeout(() => inputRef.current?.focus(), 100);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }, [isOpen]);

    // Close on route change
    useEffect(() => {
        onClose();
    }, [pathname, onClose]);

    // Filter Logic
    useEffect(() => {
        if (query.trim() === '') {
            setResults([]);
            return;
        }
        const filtered = MOCK_RESULTS.filter(item =>
            item.title.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered);
    }, [query]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-sand/95 backdrop-blur-xl animate-in fade-in duration-200">

            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-6 right-6 lg:top-12 lg:right-12 p-2 hover:bg-forest/5 rounded-full transition-colors"
            >
                <X className="w-8 h-8 text-forest" />
            </button>

            <div className="max-w-3xl mx-auto pt-32 px-6">

                {/* Search Input */}
                <div className="relative mb-12">
                    <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 text-forest/30" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search villas or experiences..."
                        className="w-full bg-transparent border-b-2 border-forest/10 py-6 pl-12 pr-4 text-3xl md:text-5xl font-serif text-forest placeholder:text-forest/20 focus:outline-none focus:border-forest/50 transition-colors"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>

                {/* Results or Suggestions */}
                <div className="space-y-2">

                    {/* Empty State / Suggestions */}
                    {query === '' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-in slide-in-from-bottom-4 duration-500">
                            <div>
                                <span className="text-xs font-sans uppercase tracking-[0.2em] text-forest/40 mb-6 block">Popular Villas</span>
                                <ul className="space-y-4">
                                    {MOCK_RESULTS.filter(r => r.category === 'Villa').slice(0, 3).map(item => (
                                        <li key={item.id}>
                                            <Link href={item.href} className="flex items-center gap-3 group">
                                                <MapPin className="w-4 h-4 text-forest/40 group-hover:text-forest transition-colors" />
                                                <span className="font-serif text-xl text-forest/70 group-hover:text-forest transition-colors">{item.title}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <span className="text-xs font-sans uppercase tracking-[0.2em] text-forest/40 mb-6 block">Experience Ubud</span>
                                <ul className="space-y-4">
                                    {MOCK_RESULTS.filter(r => r.category === 'Experience').slice(0, 3).map(item => (
                                        <li key={item.id}>
                                            <Link href={item.href} className="flex items-center gap-3 group">
                                                <Sparkles className="w-4 h-4 text-forest/40 group-hover:text-gold transition-colors" />
                                                <span className="font-serif text-xl text-forest/70 group-hover:text-forest transition-colors">{item.title}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* Live Results */}
                    {results.map((result, index) => (
                        <Link
                            key={result.id}
                            href={result.href}
                            className="flex items-center justify-between p-4 -mx-4 rounded-lg hover:bg-forest/5 group transition-colors animate-in slide-in-from-bottom-2"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-full ${result.category === 'Villa' ? 'bg-forest/5 text-forest' : 'bg-gold/10 text-gold-dark'}`}>
                                    {result.category === 'Villa' ? <MapPin size={16} /> : <Sparkles size={16} />}
                                </div>
                                <div>
                                    <p className="font-serif text-2xl text-forest">{result.title}</p>
                                    <p className="text-xs font-sans uppercase tracking-wider text-forest/40">{result.category}</p>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-forest/20 group-hover:text-forest transition-colors" />
                        </Link>
                    ))}

                    {query !== '' && results.length === 0 && (
                        <div className="text-center py-12">
                            <p className="font-serif text-xl text-forest/40 italic">No results found for "{query}"</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};
