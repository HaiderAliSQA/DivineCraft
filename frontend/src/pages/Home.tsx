// frontend/src/pages/Home.tsx
import React, { useState } from 'react';
import ProductCard from '../components/ui/ProductCard';
import ProductSkeleton from '../components/ui/ProductSkeleton';
import { useGetProductsQuery } from '../store/api/productsApi';
import { Category, CATEGORY_LABELS } from '../types';

import HeroBanner from '../components/HeroBanner';
import StatsBar from '../components/StatsBar';
import CategoryGrid from '../components/CategoryGrid';

const Home: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  const { data: activeData, isLoading: loadingActive } = useGetProductsQuery({ 
    category: activeCategory !== 'all' ? activeCategory as Category : undefined, 
    limit: 12 
  });

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    { 
      q: "How long does delivery take?", 
      a: "Standard delivery takes 3 to 5 business days via TCS nationwide." 
    },
    { 
      q: "Can I request customized Resin Art or Wood designs?", 
      a: "Yes, we welcome custom artisan requests! Please reach out to our WhatsApp support at +92(305) 770-9173 to share your specifications." 
    },
    { 
      q: "What is your policy on fragile transit damage?", 
      a: "We offer a Safe Transit Guarantee. If a ceramic, terracotta, or glass piece is damaged during transit, we replace it immediately at no extra cost." 
    },
    { 
      q: "What materials go into your organic candles?", 
      a: "Our candles are hand-poured using 100% natural organic soy wax and beeswax, lead-free cotton wicks, and premium toxin-free fragrance oils." 
    }
  ];

  const trustBadges = [
    {
      title: '100% Handcrafted',
      desc: 'Every piece is unique, made by skilled artisans.',
      icon: (
        <svg className="w-8 h-8 text-artisan-highlight" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3" />
        </svg>
      )
    },
    {
      title: 'Sustainable Sourcing',
      desc: 'Natural waxes, non-toxic glazes, recycled packaging.',
      icon: (
        <svg className="w-8 h-8 text-artisan-highlight" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925-3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 006 12v6a3.75 3.75 0 003.75 3.75h2.25A3.75 3.75 0 0015.75 18v-1.5" />
        </svg>
      )
    },
    {
      title: 'Safe Transit Guarantee',
      desc: 'Breakage during delivery? We replace immediately.',
      icon: (
        <svg className="w-8 h-8 text-artisan-highlight" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-artisan-bg text-artisan-text">
      
      {/* 1. HERO SECTION */}
      <HeroBanner />

      {/* 2. STATS BAR */}
      <StatsBar />

      {/* 3. SHOP BY CATEGORY */}
      <CategoryGrid />

      {/* 4. PRODUCT GRID — "Aesthetic Additions" */}
      <section className="py-20 bg-artisan-bg">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          
          {/* Section Header & Subtitle */}
          <div className="text-center mb-12">
            <h2 className="font-artisan-heading text-3xl md:text-4xl font-normal text-artisan-primary tracking-wide">
              Aesthetic Additions
            </h2>
            <p className="font-artisan-body text-[11px] md:text-xs font-bold uppercase tracking-[0.25em] text-artisan-highlight mt-2">
              Hot Selling Crafts This Month
            </p>
          </div>

          {/* Dynamic Category Filter bar (artisan style) */}
          <div className="flex overflow-x-auto gap-3.5 px-2 pb-5 mb-12 no-scrollbar justify-start md:justify-center border-b border-artisan-subtle/10">
            <button 
              onClick={() => setActiveCategory('all')}
              className={`shrink-0 px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
                activeCategory === 'all' 
                  ? 'bg-artisan-primary text-white' 
                  : 'bg-transparent text-artisan-subtle hover:text-artisan-primary'
              }`}
            >
              All Products
            </button>
            {(Object.entries(CATEGORY_LABELS) as [Category, string][]).map(([key, label]) => (
              <button 
                key={key} 
                onClick={() => setActiveCategory(key)}
                className={`shrink-0 px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
                  activeCategory === key 
                    ? 'bg-artisan-primary text-white' 
                    : 'bg-transparent text-artisan-subtle hover:text-artisan-primary'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          
          {/* 3-Column Masonry-Style Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loadingActive ? (
              Array.from({ length: 6 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))
            ) : (activeData?.data?.products?.length ?? 0) > 0 ? (
              activeData?.data?.products?.map((p: any, i: number) => (
                <ProductCard key={p._id} product={p} index={i} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-white border border-artisan-subtle/10">
                <p className="text-artisan-subtle font-bold uppercase tracking-widest text-xs">
                  Artisan creations coming soon
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. TRUST BADGES (3 columns, light cream background) */}
      <section className="py-20 bg-[#FAF0E6] border-y border-artisan-subtle/10">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {trustBadges.map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-artisan-subtle/5">
                  {item.icon}
                </div>
                <h3 className="font-artisan-heading text-lg font-bold text-artisan-primary tracking-wide">{item.title}</h3>
                <p className="font-artisan-body text-artisan-subtle text-sm max-w-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FAQ SECTION (Accordion, clean white background) */}
      <section id="faq" className="py-24 bg-white border-b border-artisan-subtle/10">
        <div className="max-w-3xl mx-auto px-6">
          
          <div className="text-center mb-16">
            <h2 className="font-artisan-heading text-3xl md:text-4xl font-normal text-artisan-primary tracking-wide">
              Frequently Asked Questions
            </h2>
            <p className="font-artisan-body text-[11px] md:text-xs font-bold uppercase tracking-[0.25em] text-artisan-highlight mt-2">
              Caring for Handcrafted Goods
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={index} className="border-b border-artisan-subtle/10 pb-4">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex justify-between items-center text-left py-3.5 focus:outline-none group"
                  >
                    <span className="font-artisan-heading text-base md:text-lg text-artisan-primary font-medium group-hover:text-artisan-highlight transition-colors">
                      {faq.q}
                    </span>
                    <span className="text-xl text-artisan-accent group-hover:text-artisan-highlight transition-colors ml-4 shrink-0">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 max-h-0 ${isOpen ? 'max-h-[200px]' : ''}`}>
                    <p className="font-artisan-body text-sm text-artisan-subtle pb-4 pt-1 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 7. NEWSLETTER (Rebranded) */}
      <section className="py-24 bg-artisan-bg relative">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <span className="text-artisan-highlight font-artisan-body font-bold uppercase tracking-[0.3em] text-[10px] block mb-3">
            STUDIO JOURNAL
          </span>
          <h2 className="font-artisan-heading text-3xl md:text-4xl font-normal text-artisan-primary mb-6 tracking-wide">
            Join the Artisan Club
          </h2>
          <p className="font-artisan-body text-artisan-subtle mb-10 text-sm md:text-base leading-relaxed max-w-lg mx-auto">
            Subscribe to receive stories of the local hands behind each creation, styling logs, and early access to new collections.
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email address"
              className="flex-1 bg-white border border-artisan-subtle/20 rounded-none px-6 py-4 text-artisan-text placeholder-artisan-subtle/60 focus:outline-none focus:border-artisan-primary font-artisan-body text-sm"
              required
            />
            <button className="bg-artisan-primary hover:bg-artisan-highlight text-white px-10 py-4 font-artisan-body text-xs font-bold uppercase tracking-widest transition-all select-none cursor-pointer">
              Subscribe
            </button>
          </form>
        </div>
      </section>

    </div>
  );
};

export default Home;
