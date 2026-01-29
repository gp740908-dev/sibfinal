import type { Metadata } from 'next';
import ScrollSequence from '@/components/ui/ScrollSequence';

export const metadata: Metadata = {
    title: 'Cinematic Villa Experience | StayinUBUD',
    description: 'Immerse yourself in the tranquility of our jungle villas.',
};

export default function ExperiencePage() {
    return (
        <main className="bg-black min-h-screen">

            {/* 1. Intro Section */}
            <section className="h-screen flex items-center justify-center relative z-10 bg-black text-white">
                <div className="text-center">
                    <h1 className="text-6xl md:text-8xl font-serif mb-6 animate-fade-in-up">
                        The Journey
                    </h1>
                    <p className="text-stone-400 max-w-md mx-auto text-lg mb-12">
                        Scroll to begin your immersive tour through the hidden valley of Ubud.
                    </p>
                    <div className="animate-bounce">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mx-auto text-white/50">
                            <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
                        </svg>
                    </div>
                </div>
            </section>

            {/* 2. Scroll Sequence */}
            <div className="relative z-0">
                <ScrollSequence
                    frameCount={240}
                    folderPath="/imgseq"
                    filePrefix="ezgif-frame-"
                    fileExtension="jpg"
                    scrollDistance="500%" // Longer scroll for 240 frames
                />

                {/* Overlay Content (Optional: Absolute positioned text that fades in/out over the sequence) */}
                {/* You can add ScrollTriggered text overlays here if needed */}
            </div>

            {/* 3. Outro / Call to Action */}
            <section className="h-screen flex items-center justify-center bg-white text-forest relative z-10">
                <div className="text-center px-6">
                    <h2 className="text-4xl md:text-6xl font-serif mb-8">
                        Experience Reality
                    </h2>
                    <p className="text-lg text-text-muted mb-8 max-w-xl mx-auto">
                        This is just a digital glimpse. The scent of frangipani and the sound of the river await you.
                    </p>
                    <a href="/villas" className="inline-block bg-forest text-white px-8 py-4 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-forest/90 transition-colors">
                        Book Your Stay
                    </a>
                </div>
            </section>

        </main>
    );
}
