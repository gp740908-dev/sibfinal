import React from 'react';
import Link from 'next/link';

interface NotFoundProps {
  onReturnHome?: () => void;
}

export const NotFound: React.FC<NotFoundProps> = () => {
  return (
    <div className="relative h-[100dvh] w-full flex flex-col items-center justify-center bg-forest overflow-hidden selection:bg-sand selection:text-forest">

      {/* 1. Background Layer */}
      <div className="absolute inset-0 z-0">
        {/* Noise Texture for 'Organic' Feel */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-soft-light bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />

        {/* Subtle Gradient Spot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-sand/5 blur-[120px] rounded-full pointer-events-none" />
      </div>

      {/* 2. Content */}
      <div className="relative z-10 text-center px-6 flex flex-col items-center">

        {/* Giant 404 */}
        <div className="font-serif text-[12rem] md:text-[20rem] leading-[0.8] text-sand opacity-10 tracking-tighter select-none animate-slide-up [animation-duration:1s] [animation-fill-mode:backwards]">
          404
        </div>

        {/* Message */}
        <div className="mt-8 md:-mt-12 space-y-6 max-w-lg">
          <h1 className="text-3xl md:text-5xl font-serif text-sand tracking-tight animate-fade-in [animation-delay:200ms] [animation-fill-mode:backwards]">
            Into the Void
          </h1>

          <div className="w-px h-12 bg-sand/30 mx-auto animate-scale-y [animation-delay:400ms] [animation-fill-mode:backwards] origin-top" />

          <p className="font-sans text-sand/80 text-sm md:text-base leading-relaxed tracking-widest uppercase animate-fade-in [animation-delay:600ms] [animation-fill-mode:backwards]">
            The page you seek has been <br className="hidden md:block" /> reclaimed by the jungle.
          </p>
        </div>

        {/* Action */}
        <div className="mt-12 animate-fade-in [animation-delay:800ms] [animation-fill-mode:backwards]">
          <Link
            href="/"
            className="group relative inline-flex items-center justify-center px-10 py-4 overflow-hidden rounded-full border border-sand/30 hover:border-sand transition-all duration-500"
          >
            <span className="relative z-10 font-sans text-xs uppercase tracking-[0.25em] text-sand group-hover:text-forest transition-colors duration-500 font-medium">
              Return to Sanctuary
            </span>
            {/* Magnetic Fill Effect */}
            <div className="absolute inset-0 bg-sand transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]" />
          </Link>
        </div>

      </div>

      {/* Footer / Copyright */}
      <div className="absolute bottom-8 text-[10px] uppercase tracking-widest text-sand/40 font-sans animate-fade-in [animation-delay:1000ms] [animation-fill-mode:backwards]">
        StayinUbud
      </div>

    </div>
  );
};