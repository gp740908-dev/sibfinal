'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import ScrollSequence from '@/components/ui/ScrollSequence';

gsap.registerPlugin(ScrollTrigger);

export const HomeScrollExperience: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // Animate text elements based on scroll progress of the pinned container
        // The ScrollSequence pins the container for '300%' distance (default) or whatever we pass
        // We can use a separate ScrollTrigger on the same trigger to animate opacity

        const texts = gsap.utils.toArray('.scroll-text');

        // Timeline attached to the scroll of the container
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top top',
                end: 'bottom+=500% bottom', // Matching scale with ScrollSequence (500%)
                scrub: true,
            }
        });

        // Sequence of text appearances
        // 0-20%: Fade in Text 1
        // 20-30%: Fade out Text 1
        // 30-50%: Fade in Text 2 ... etc

        tl.to(texts[0], { opacity: 1, y: 0, duration: 1, ease: 'power2.out' })
            .to(texts[0], { opacity: 0, y: -20, duration: 1, delay: 2 })

            .to(texts[1], { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }, "+=0.5")
            .to(texts[1], { opacity: 0, y: -20, duration: 1, delay: 2 })

            .to(texts[2], { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }, "+=0.5")
            .to(texts[2], { opacity: 0, y: -20, duration: 1, delay: 2 })

            .to(texts[3], { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }, "+=0.5")
            .to(texts[3], { opacity: 0, y: -20, duration: 1, delay: 2 });

    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="relative bg-black">
            <ScrollSequence
                frameCount={240}
                folderPath="/imgseq"
                filePrefix="ezgif-frame-"
                fileExtension="jpg"
                scrollDistance="500%"
            >
                <div className="absolute inset-0 flex items-center justify-center text-center text-white p-4">

                    {/* Text 1 */}
                    <div className="scroll-text absolute opacity-0 translate-y-10 max-w-lg">
                        <h3 className="text-4xl md:text-6xl font-serif mb-4">Hidden in the Jungle</h3>
                        <p className="text-lg md:text-xl font-sans text-white/80">
                            Discover a sanctuary where the forest embraces our architecture.
                        </p>
                    </div>

                    {/* Text 2 */}
                    <div className="scroll-text absolute opacity-0 translate-y-10 max-w-lg">
                        <h3 className="text-4xl md:text-6xl font-serif mb-4">Sacred Silence</h3>
                        <p className="text-lg md:text-xl font-sans text-white/80">
                            Far from the crowds, the only soundtrack is the rhythm of nature.
                        </p>
                    </div>

                    {/* Text 3 */}
                    <div className="scroll-text absolute opacity-0 translate-y-10 max-w-lg">
                        <h3 className="text-4xl md:text-6xl font-serif mb-4">Timeless Rituals</h3>
                        <p className="text-lg md:text-xl font-sans text-white/80">
                            Experience ancient Balinese traditions woven into modern luxury.
                        </p>
                    </div>

                    {/* Text 4 */}
                    <div className="scroll-text absolute opacity-0 translate-y-10 max-w-lg">
                        <h3 className="text-4xl md:text-6xl font-serif mb-4">Welcome Home</h3>
                        <p className="text-lg md:text-xl font-sans text-white/80">
                            Your private escape awaits in the heart of Ubud.
                        </p>
                    </div>

                </div>
            </ScrollSequence>
        </div>
    );
};
