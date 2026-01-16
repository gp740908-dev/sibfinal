import React from 'react';

interface NotFoundProps {
  onReturnHome: () => void;
}

export const NotFound: React.FC<NotFoundProps> = ({ onReturnHome }) => {
  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center bg-forest overflow-hidden">
      
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1448375240586-dfd8d395ea6c?auto=format&fit=crop&q=80&w=1920" 
          alt="Misty Jungle Forest" 
          className="w-full h-full object-cover opacity-60"
        />
        {/* Darkening Overlay */}
        <div className="absolute inset-0 bg-forest/80 mix-blend-multiply" />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-xl animate-fade-in">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-sand mb-8 tracking-tight leading-none drop-shadow-2xl">
          LOST IN THE <br/> <span className="italic font-light opacity-80">JUNGLE?</span>
        </h1>
        
        <div className="w-px h-16 bg-sand/30 mx-auto mb-8"></div>

        <p className="font-sans text-sand/90 text-lg md:text-xl mb-12 leading-relaxed tracking-wide font-light">
          The path you are looking for has been <br/> reclaimed by nature.
        </p>
        
        <button 
          onClick={onReturnHome}
          className="group relative px-8 py-3 overflow-hidden rounded-full border border-sand/40 hover:border-sand transition-colors duration-300"
        >
          <span className="relative z-10 font-sans text-xs uppercase tracking-[0.2em] text-sand group-hover:text-forest transition-colors duration-300 font-bold">
            Return to Sanctuary
          </span>
          <div className="absolute inset-0 bg-sand transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left ease-out" />
        </button>
      </div>

    </div>
  );
};