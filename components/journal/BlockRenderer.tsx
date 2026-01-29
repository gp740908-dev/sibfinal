
import React from 'react';

// Reusing the type definition
type BlockType = 'paragraph' | 'h2' | 'h3' | 'image' | 'quote';
interface Block {
    id: string;
    type: BlockType;
    content: string;
    caption?: string;
}

interface BlockRendererProps {
    content: string; // The raw content string (JSON or HTML)
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({ content }) => {
    let blocks: Block[] = [];
    let isLegacyHTML = false;

    try {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
            blocks = parsed;
        } else {
            isLegacyHTML = true;
        }
    } catch (e) {
        isLegacyHTML = true;
    }

    if (isLegacyHTML) {
        return (
            <div
                className="font-sans text-text leading-relaxed space-y-6"
                dangerouslySetInnerHTML={{ __html: content || '' }}
            />
        );
    }

    return (
        <div className="space-y-8 font-sans text-forest-dark leading-relaxed">
            {blocks.map((block, index) => {
                const isFirstParagraph = index === 0 && block.type === 'paragraph'; // Naive check, usually first block is p

                switch (block.type) {
                    case 'h2':
                        return (
                            <div key={block.id} className="max-w-2xl mx-auto w-full">
                                <h2 className="text-3xl md:text-4xl font-serif text-forest-dark mt-16 mb-6 leading-tight">{block.content}</h2>
                            </div>
                        );
                    case 'h3':
                        return (
                            <div key={block.id} className="max-w-2xl mx-auto w-full">
                                <h3 className="text-2xl font-serif text-forest-dark mt-10 mb-4">{block.content}</h3>
                            </div>
                        );
                    case 'image':
                        return (
                            <figure key={block.id} className="my-16 w-full max-w-5xl mx-auto">
                                <img
                                    src={block.content}
                                    alt={block.caption || 'Blog Image'}
                                    className="w-full rounded-sm shadow-lg"
                                />
                                {block.caption && (
                                    <figcaption className="text-center text-xs uppercase tracking-widest text-forest-dark/50 mt-4 max-w-2xl mx-auto">
                                        {block.caption}
                                    </figcaption>
                                )}
                            </figure>
                        );
                    case 'quote':
                        return (
                            <blockquote key={block.id} className="max-w-3xl mx-auto w-full my-16 text-center">
                                <p className="font-serif text-3xl md:text-4xl italic text-forest-dark leading-snug">
                                    "{block.content}"
                                </p>
                            </blockquote>
                        );
                    default: // paragraph
                        return (
                            <div key={block.id} className="max-w-2xl mx-auto w-full">
                                <p className={`text-lg md:text-xl leading-loose text-forest-dark/90 
                                    ${isFirstParagraph ? 'first-letter:text-7xl first-letter:font-serif first-letter:text-forest first-letter:float-left first-letter:mr-4 first-letter:leading-none' : ''}
                                `}>
                                    {block.content}
                                </p>
                            </div>
                        );
                }
            })}
        </div>
    );
};
