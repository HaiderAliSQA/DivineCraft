import React from 'react';
import { Link } from 'react-router-dom';

const HeroBanner: React.FC = () => {
  return (
    <section className="relative w-full bg-artisan-bg overflow-hidden py-20 md:py-28 lg:py-36 border-b border-artisan-subtle/5">
      {/* Background Subtle Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0 mix-blend-overlay" 
           style={{ backgroundImage: 'radial-gradient(#1C1C1C 1px, transparent 1px)', backgroundSize: '16px 16px' }} />

      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* LEFT: Large Editorial Text */}
          <div className="w-full lg:w-1/2 flex flex-col items-start text-left animate-fade-up">
            <span className="text-[11px] font-artisan-body font-bold uppercase tracking-[0.25em] text-artisan-highlight mb-4">
              HANDMADE HERITAGE
            </span>
            
            <h1 className="font-artisan-heading text-4xl md:text-5xl lg:text-6.5xl font-normal text-artisan-primary leading-[1.15] mb-6">
              Unveiling the Soul of <br />
              <span className="italic font-light">Handmade Artistry</span>
            </h1>
            
            <p className="font-artisan-body text-artisan-subtle text-base md:text-lg max-w-lg mb-10 leading-relaxed">
              Discover unique, slow-crafted accents sculpted by local hands. Bring warmth, intention, and stories into your living space.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/products" 
                className="bg-artisan-primary hover:bg-artisan-highlight text-white font-artisan-body text-[11px] font-bold uppercase tracking-[0.2em] px-10 py-4.5 rounded-none transition-all duration-300 shadow-sm inline-flex items-center gap-2 group hover:scale-[1.02] active:scale-[0.98]"
              >
                EXPLORE COLLECTION 
                <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
              </Link>
            </div>
          </div>

          {/* RIGHT: Lifestyle Image */}
          <div className="w-full lg:w-1/2 relative h-[380px] sm:h-[450px] lg:h-[520px] flex items-center justify-center">
            {/* Background gold glow accent */}
            <div className="absolute w-[80%] aspect-square bg-artisan-accent/10 blur-[80px] rounded-full z-0 pointer-events-none"></div>
            
            {/* Image Container with editorial thin frame */}
            <div className="relative w-full max-w-lg aspect-[4/5] overflow-hidden border border-artisan-primary/10 shadow-sm z-10 transition-transform duration-500 hover:scale-[1.01]">
              <img 
                src="/images/hero_lifestyle_crafts.png" 
                alt="DivineCraft Lifestyle Decor" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-artisan-primary/5 mix-blend-overlay pointer-events-none"></div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
