import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const collections = [
    { name: 'Wax Candles', slug: 'wax-candles' },
    { name: 'Resin Art', slug: 'resin-art' },
    { name: 'Wooden Ware', slug: 'wooden-ware' },
    { name: 'Studio Ceramics', slug: 'studio-ceramics' },
    { name: 'Macrame Hangings', slug: 'macrame-hangings' },
    { name: 'Leather Journals', slug: 'leather-journals' },
    { name: 'Terracotta Ware', slug: 'terracotta-ware' },
    { name: 'Pressed Flowers', slug: 'pressed-flowers' },
  ];

  return (
    <footer className="bg-[#1C1209] text-white pt-20 pb-10 border-t border-artisan-primary/10">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20 mb-16">
          
          {/* LEFT: Logo + description + socials */}
          <div className="flex flex-col space-y-6">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-full bg-artisan-primary border border-artisan-accent flex items-center justify-center font-artisan-heading text-base font-bold text-artisan-accent">
                D
              </div>
              <span className="font-artisan-heading text-lg font-extrabold tracking-widest text-white uppercase">
                DivineCraft
              </span>
            </Link>
            <p className="font-artisan-body text-artisan-subtle/80 text-sm leading-relaxed max-w-sm">
              Bring Soul Into Your Space. Discover slow-crafted, artisan-made home decor sculpted with timeless heritage.
            </p>
            
            {/* Social Icons */}
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white hover:text-artisan-accent hover:border-artisan-accent transition-colors" aria-label="DivineCraft on Facebook">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H7v3h2v9h3v-9h3.3l.7-3H12V6c0-.9.1-1.2.9-1.2H15V1h-2.9C9.5 1 9 2.1 9 4.3V8z"/>
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white hover:text-artisan-accent hover:border-artisan-accent transition-colors" aria-label="DivineCraft on Instagram">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* MIDDLE: Studio Collections list */}
          <div className="flex flex-col space-y-6">
            <h3 className="font-artisan-heading text-base font-bold text-artisan-accent uppercase tracking-widest">Studio Collections</h3>
            <ul className="grid grid-cols-2 gap-3 text-sm font-artisan-body text-artisan-subtle/80">
              {collections.map((col) => (
                <li key={col.slug}>
                  <Link to={`/products?category=${col.slug}`} className="hover:text-artisan-highlight transition-colors">
                    {col.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT: Studio Info */}
          <div className="flex flex-col space-y-6 text-sm font-artisan-body text-artisan-subtle/80">
            <h3 className="font-artisan-heading text-base font-bold text-artisan-accent uppercase tracking-widest">Studio Info</h3>
            <ul className="flex flex-col space-y-3">
              <li className="flex items-center gap-3">
                <span className="text-artisan-accent">📍</span>
                <span>Furniture Market Chiniot, Pakistan</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-artisan-accent">📞</span>
                <a href="tel:+923007709173" className="hover:underline">+92 (300) 770-9173</a>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-artisan-accent">💬</span>
                <a href="https://wa.me/923007709173" target="_blank" rel="noopener noreferrer" className="hover:underline">WhatsApp Support</a>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-artisan-accent">✉️</span>
                <a href="mailto:hello@divinecrafts.pk" className="hover:underline">hello@divinecrafts.pk</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Accepted Payments & Bottom Bar */}
        <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-6">
          <div className="flex flex-col gap-2">
            <p className="font-artisan-body text-xs text-artisan-subtle/60">
              © {currentYear} DivineCraft. All Rights Reserved.
            </p>
            <div className="flex space-x-6 text-[11px] text-artisan-subtle/80">
              <Link to="/shipping-policy" className="hover:text-artisan-highlight">Shipping Policy</Link>
              <Link to="/returns-policy" className="hover:text-artisan-highlight">Returns & Exchanges</Link>
            </div>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-2">
            <span className="text-[9px] font-bold text-artisan-subtle uppercase tracking-widest">Accepted Channels</span>
            <div className="flex flex-wrap gap-2.5">
              {['COD', 'JazzCash', 'Easypaisa', 'Bank Transfer'].map((m) => (
                <span key={m} className="bg-white/5 border border-white/10 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-artisan-subtle">
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
