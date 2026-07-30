import React from 'react';
import { Link } from 'react-router-dom';

const AboutUs: React.FC = () => {
  return (
    <div className="pt-28 pb-20 px-6 sm:px-10 lg:px-16 max-w-[1440px] mx-auto bg-artisan-bg font-artisan-body text-artisan-text">
      {/* Hero Header */}
      <div className="text-center mb-16">
        <span className="text-[10px] font-bold text-artisan-highlight uppercase tracking-[0.25em]">OUR PHILOSOPHY</span>
        <h1 className="font-artisan-heading text-3xl md:text-5xl font-normal text-artisan-primary tracking-wide mt-2 mb-4">
          Slow-Crafted Heritage
        </h1>
        <p className="text-artisan-subtle text-xs md:text-sm font-medium tracking-wide max-w-2xl mx-auto leading-relaxed">
          Bringing soul into modern spaces by preserving the timeless art of handcrafted design. 
          Every piece tells a story of patience, material purity, and fine human artistry.
        </p>
      </div>

      {/* Story Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
        <div className="space-y-6">
          <h2 className="font-artisan-heading text-2xl md:text-3xl text-artisan-primary font-normal tracking-wide">
            The Soul of DivineCraft
          </h2>
          <p className="text-sm text-artisan-subtle leading-relaxed">
            Founded with a passion for traditional craftsmanship, DivineCraft acts as a sanctuary for slow-made, 
            intentional home goods. In a world dominated by mass production, we celebrate the subtle imperfections 
            that make handmade art unique.
          </p>
          <p className="text-sm text-artisan-subtle leading-relaxed">
            We collaborate with talented local master artisans in Pakistan—specializing in woodcarving, 
            organic candle pouring, hand-pressed botanical art, and studio ceramics—to bring you a curated collection 
            that blends heritage methods with contemporary lifestyle aesthetics.
          </p>
        </div>
        <div className="bg-artisan-card border border-artisan-subtle/10 p-8 md:p-12 text-center flex flex-col justify-center items-center h-full min-h-[300px] shadow-sm">
          <span className="text-4xl mb-4">🎨</span>
          <h3 className="font-artisan-heading text-xl text-artisan-primary font-bold uppercase tracking-wider mb-2">
            100% Artisan Made
          </h3>
          <p className="text-xs text-artisan-subtle leading-relaxed max-w-xs mb-6">
            From organic soy wax candles to hand-thrown stoneware clays, our products use only responsibly sourced, raw materials.
          </p>
          <Link 
            to="/products" 
            className="bg-artisan-primary text-white px-8 py-3 text-[10px] uppercase font-bold tracking-widest hover:bg-artisan-highlight transition-all"
          >
            Explore Collection
          </Link>
        </div>
      </div>

      {/* Core Values */}
      <div className="space-y-8 pt-10 border-t border-artisan-subtle/10">
        <h2 className="font-artisan-heading text-2xl md:text-3xl text-artisan-primary font-normal tracking-wide text-center">
          Our Guiding Principles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Preserving Heritage',
              desc: 'We support local artisan communities, keeping century-old woodworking, clay throwing, and weaving techniques alive in Pakistan.',
              icon: '🏺'
            },
            {
              title: 'Sustainable Sourcing',
              desc: 'We use natural vegetable waxes, lead-free wicks, non-toxic glazes, and recycled paper packaging to minimize our environmental footprint.',
              icon: '🌿'
            },
            {
              title: 'Honest Handcrafts',
              desc: 'Every item in our collection is created by hand. No two items are identical, ensuring that your selection is uniquely yours.',
              icon: '🪵'
            }
          ].map((val, i) => (
            <div key={i} className="bg-artisan-card border border-artisan-subtle/10 p-6 md:p-8 shadow-sm">
              <span className="text-3xl mb-4 block">{val.icon}</span>
              <h3 className="font-artisan-heading text-lg text-artisan-primary font-bold mb-3 tracking-wide">{val.title}</h3>
              <p className="text-xs text-artisan-subtle leading-relaxed">{val.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
