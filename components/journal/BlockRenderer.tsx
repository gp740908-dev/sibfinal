
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
            {blocks.map((block) => {
                switch (block.type) {
                    case 'h2':
                        return <h2 key={block.id} className="text-3xl font-serif text-forest-dark mt-12 mb-6">{block.content}</h2>;
                    case 'h3':
                        return <h3 key={block.id} className="text-2xl font-serif text-forest-dark mt-8 mb-4">{block.content}</h3>;
                    case 'image':
                        return (
                            <figure key={block.id} className="my-12">
                                <img src={block.content} alt={block.caption || 'Blog Image'} className="w-full rounded-xl" />
                                {block.caption && <figcaption className="text-center text-sm text-forest-dark/50 mt-4 italic">{block.caption}</figcaption>}
                            </figure>
                        );
                    case 'quote':
                        return (
                            <blockquote key={block.id} className="border-l-4 border-forest-dark pl-6 py-2 my-12 italic text-xl text-forest-dark/80 font-serif bg-sand/30 p-6 rounded-r-xl">
                                "{block.content}"
                            </blockquote>
                        );
                    default: // paragraph
                        return <p key={block.id} className="text-lg leading-loose">{block.content}</p>;
                }
            })}
        </div>
    );
};
