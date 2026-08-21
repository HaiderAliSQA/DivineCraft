import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HeroBanner: React.FC = () => {
  const [currentGroup, setCurrentGroup] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGroup((prev) => (prev === 0 ? 1 : 0));
    }, 3500); // cycle every 3.5 seconds
    return () => clearInterval(interval);
  }, []);

  const imagePairs = [
    ['/images/wooden_ware_1.png', '/images/wooden_ware_7.png'], // Bowl / Jewelry Box
    ['/images/wooden_ware_2.png', '/images/wooden_ware_8.png'], // Utensils / Truck Art
    ['/images/wooden_ware_3.png', '/images/wooden_ware_5.png'], // Tray / Lamp
    ['/images/wooden_ware_4.png', '/images/wooden_ware_6.png'], // Vase / Chess Set
    ['/images/wooden_ware_5.png', '/images/wooden_ware_1.png'], // Lamp / Bowl
    ['/images/wooden_ware_6.png', '/images/wooden_ware_2.png'], // Chess Set / Utensils
  ];

  return (
    <section className="relative w-full bg-artisan-bg overflow-hidden pt-4 pb-0 md:py-14 lg:py-16 border-b border-artisan-subtle/5">
      {/* Dynamic Floating & Fade-in Keyframe Animations */}
      <style>{`
        @keyframes float-up-down {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .float-card-0 { animation: float-up-down 6s ease-in-out infinite; }
        .float-card-1 { animation: float-up-down 6s ease-in-out infinite 1s; }
        .float-card-2 { animation: float-up-down 6s ease-in-out infinite 2s; }
        .float-card-3 { animation: float-up-down 6s ease-in-out infinite 3s; }
        .float-card-4 { animation: float-up-down 6s ease-in-out infinite 4s; }
        .float-card-5 { animation: float-up-down 6s ease-in-out infinite 5s; }
        
        .animate-hero-title {
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-hero-desc {
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s forwards;
          opacity: 0;
        }
        .animate-hero-btn {
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards;
          opacity: 0;
        }
      `}</style>

      {/* Background Subtle Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0 mix-blend-overlay" 
           style={{ backgroundImage: 'radial-gradient(#1C1C1C 1px, transparent 1px)', backgroundSize: '16px 16px' }} />

      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-10">
          
          {/* LEFT: Large Editorial Text (Orange Box - Complete & Large) */}
          <div className="hidden lg:flex w-full lg:w-[38%] flex-col items-start text-left pt-2 lg:pt-0">
            <span className="text-[12px] md:text-[13px] font-artisan-body font-bold uppercase tracking-[0.3em] text-artisan-highlight mb-3">
              HANDMADE HERITAGE
            </span>
            
            <h1 className="font-artisan-heading text-4xl md:text-5xl lg:text-6.5xl font-bold text-artisan-primary leading-[1.15] mb-4 animate-hero-title">
              Unveiling the <br />
              Soul of <br />
              <span className="italic font-light">Handmade Artistry</span>
            </h1>
            
            <p className="font-artisan-body text-artisan-subtle text-base md:text-lg max-w-lg mb-6 leading-relaxed animate-hero-desc">
              Discover unique, slow-crafted accents sculpted by local hands. Bring warmth, intention, and stories into your living space.
            </p>
            
            <div className="w-full animate-hero-btn">
              <Link 
                to="/products" 
                className="bg-artisan-primary hover:bg-artisan-highlight text-white font-artisan-body text-[11px] font-bold uppercase tracking-[0.2em] px-10 py-4.5 rounded-2xl transition-all duration-300 shadow-md inline-flex items-center gap-2 group hover:scale-[1.02] active:scale-[0.98] hover:shadow-[0_4px_15px_rgba(61,31,13,0.2)] cursor-pointer"
              >
                EXPLORE COLLECTION 
                <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
              </Link>
            </div>
          </div>

          {/* RIGHT: 6 Vertical Images Side-by-Side (Green Arrow & Orange Arrow space use) */}
          <div className="w-full lg:w-[62%] relative flex items-center justify-center z-10 pt-0 pb-0 lg:py-8">
            {/* Background gold glow accent */}
            <div className="absolute w-[90%] aspect-square bg-artisan-accent/5 blur-[90px] rounded-full z-0 pointer-events-none"></div>
            
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4 w-full lg:-mt-16">
              {imagePairs.map((pair, i) => (
                <div 
                  key={i} 
                  className={`relative overflow-hidden border border-artisan-primary/10 shadow-sm transition-all duration-500 hover:scale-[1.05] hover:shadow-md h-[150px] sm:h-[340px] lg:h-[480px] w-full ${
                    i === 0 ? 'lg:-translate-y-8' : 
                    i === 1 ? 'lg:-translate-y-3' : 
                    i === 2 ? 'lg:translate-y-2' : 
                    i === 3 ? 'lg:translate-y-7' : 
                    i === 4 ? 'lg:translate-y-12' : 
                    'lg:translate-y-17'
                  }`}
                >
                  <div className={`w-full h-full relative float-card-${i}`}>
                    {/* First Image in the pair */}
                    <img 
                      src={pair[0]} 
                      alt="Artisan Wooden Craft" 
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1200ms] ease-in-out ${
                        currentGroup === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0'
                      }`}
                    />
                    {/* Second Image in the pair */}
                    <img 
                      src={pair[1]} 
                      alt="Artisan Wooden Craft" 
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1200ms] ease-in-out ${
                        currentGroup === 1 ? 'opacity-100 z-10' : 'opacity-0 z-0'
                      }`}
                    />
                    <div className="absolute inset-0 bg-artisan-primary/5 mix-blend-overlay pointer-events-none z-20"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
