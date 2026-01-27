'use client';

import React from 'react';

interface TocItem {
  id: string;
  label: string;
}

interface LegalLayoutProps {
  title: string;
  subtitle: string;
  lastUpdated: string;
  toc: TocItem[];
  children: React.ReactNode;
}

export const LegalLayout: React.FC<LegalLayoutProps> = ({ title, subtitle, lastUpdated, toc, children }) => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 120; // Header height + padding
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="bg-sand min-h-screen pt-32 pb-20 px-6 md:px-12 text-forest-dark">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-16 md:mb-24 border-b border-forest-dark/10 pb-12">
          <span className="block font-sans text-xs uppercase tracking-[0.2em] text-forest-dark/60 mb-4">Legal</span>
          <h1 className="text-4xl md:text-6xl font-serif mb-6">{title}</h1>
          <p className="font-sans text-lg text-forest-dark/80 max-w-2xl mb-4 leading-relaxed">{subtitle}</p>
          <p className="font-sans text-xs uppercase tracking-widest text-forest-dark/50">Last Updated: {lastUpdated}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-24">

          {/* Sidebar (TOC) */}
          <div className="lg:col-span-1 hidden lg:block">
            <div className="sticky top-32">
              <span className="block font-serif text-lg italic mb-6 text-forest-dark/50">Contents</span>
              <nav className="flex flex-col gap-3 border-l border-forest-dark/10 pl-4">
                {toc.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="text-left font-sans text-xs uppercase tracking-widest text-forest-dark/60 hover:opacity-100 hover:text-accent transition-colors py-1"
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="legal-content font-sans text-forest-dark/80 leading-relaxed space-y-16">
              {children}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};