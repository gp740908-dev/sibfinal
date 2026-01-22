import React from 'react';
import { BlogPost } from '../../types';
import { ArrowUpRight } from 'lucide-react';


interface JournalCardProps {
  post: BlogPost;
  onClick?: (slug: string) => void; // ← Tambah prop
}

export const JournalCard: React.FC<JournalCardProps> = ({ post, onClick }) => {
  return (
    <div 
      className="group cursor-pointer flex flex-col gap-4"
      onClick={() => onClick?.(post.slug)}
    >
      {/* Image Container */}
      <div className="overflow-hidden aspect-[3/4] relative bg-forest/5">
        <img 
          src={post.imageUrl} 
          alt={post.title} 
          className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 group-hover:brightness-90"
          loading="lazy"
        />
        {/* Hover Icon Overlay */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
           <div className="w-8 h-8 rounded-full bg-sand flex items-center justify-center text-forest">
             <ArrowUpRight size={16} />
           </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 text-[10px] font-sans uppercase tracking-widest text-forest/60">
          <span>{post.category}</span>
          <span className="w-1 h-1 rounded-full bg-forest/40"></span>
          <span>{post.publishedAt}</span>
        </div>
        
        <h3 className="font-serif text-2xl text-forest leading-tight group-hover:underline decoration-forest/30 underline-offset-4 transition-all">
          {post.title}
        </h3>
        
        <p className="font-sans text-forest/70 text-sm leading-relaxed line-clamp-2">
          {post.excerpt}
        </p>
      </div>
    </div>
  );
};
