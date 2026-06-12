import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { CATEGORY_LABELS } from '../../types';

const Navbar: React.FC = () => {
  const { count, toggleCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'CATEGORIES', path: '/products' },
    { name: 'SHOP ALL', path: '/products' },
    { name: 'FAQs', path: '/#faq' },
  ];

  return (
    <header className={`sticky top-0 w-full z-50 transition-all duration-300 bg-artisan-card border-b border-artisan-subtle/10 ${
      scrolled ? 'py-3 shadow-md' : 'py-5'
    }`}>
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="flex items-center justify-between relative">
          
          {/* LEFT: DivineCraft logo (circular "D" monogram badge, brown+gold) */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-10 h-10 rounded-full bg-artisan-primary border-2 border-artisan-accent flex items-center justify-center font-artisan-heading text-lg font-bold text-artisan-accent shadow-sm group-hover:scale-105 transition-all">
              D
            </div>
            <span className="font-artisan-heading text-lg md:text-xl font-extrabold tracking-widest text-artisan-primary uppercase">
              DivineCraft
            </span>
          </Link>

          {/* CENTER: Navigation links with CATEGORIES dropdown on hover */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path || (link.path.startsWith('/#') && location.hash === link.path.substring(1));
              return (
                <div key={link.name} className="relative group py-2">
                  {link.path.startsWith('/#') ? (
                    <a
                      href={link.path}
                      onClick={(e) => {
                        e.preventDefault();
                        if (location.pathname !== '/') {
                          navigate(link.path);
                        } else {
                          const el = document.getElementById(link.path.substring(2));
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className={`text-[11px] font-artisan-body font-bold tracking-[0.2em] transition-colors hover:text-artisan-highlight ${
                        isActive ? 'text-artisan-highlight' : 'text-artisan-subtle'
                      }`}
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link
                      to={link.path}
                      className={`text-[11px] font-artisan-body font-bold tracking-[0.2em] transition-colors hover:text-artisan-highlight ${
                        isActive ? 'text-artisan-highlight' : 'text-artisan-subtle'
                      }`}
                    >
                      {link.name}
                    </Link>
                  )}

                  {/* Animated Category Dropdown connected with DB categories */}
                  {link.name === 'CATEGORIES' && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-64 bg-white border border-artisan-subtle/10 shadow-lg py-3 opacity-0 -translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50">
                      <div className="flex flex-col">
                        {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                          <Link
                            key={key}
                            to={`/products?category=${key}`}
                            className="px-5 py-2.5 text-[10px] font-artisan-body font-bold text-artisan-subtle hover:text-artisan-highlight hover:bg-artisan-bg transition-colors tracking-widest uppercase text-left"
                          >
                            {label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* RIGHT: Search icon + Cart icon with item count badge */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            
            {/* Inline search box toggle */}
            <div className="relative flex items-center">
              {searchOpen && (
                <form onSubmit={handleSearchSubmit} className="absolute right-full mr-2 z-10 animate-fade-in">
                  <input
                    type="text"
                    placeholder="Search crafts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-40 sm:w-56 bg-artisan-bg border border-artisan-subtle/20 px-3.5 py-1.5 text-xs text-artisan-text placeholder-artisan-subtle/60 rounded-full outline-none focus:border-artisan-accent font-artisan-body"
                    autoFocus
                  />
                </form>
              )}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-artisan-primary hover:text-artisan-highlight transition-colors"
                aria-label="Search website"
              >
                <svg className="w-5 h-5 sm:w-5.5 sm:h-5.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>

            {/* Cart Button */}
            <button 
              onClick={toggleCart}
              className="relative p-2 text-artisan-primary hover:text-artisan-highlight transition-colors group"
              aria-label="Toggle cart drawer"
            >
              <svg className="w-5 h-5 sm:w-5.5 sm:h-5.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-artisan-highlight text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md animate-bounce-cart">
                  {count}
                </span>
              )}
            </button>

            {/* Mobile Hamburger toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-artisan-primary hover:text-artisan-highlight transition-colors"
              aria-label="Toggle mobile menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

          </div>
        </div>
      </div>

      {/* MOBILE COLLAPSIBLE DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden w-full bg-artisan-card border-t border-artisan-subtle/10 mt-3 py-6 px-6 animate-fade-in shadow-inner">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => {
              if (link.path.startsWith('/#')) {
                return (
                  <a
                    key={link.name}
                    href={link.path}
                    onClick={(e) => {
                      setMobileMenuOpen(false);
                      e.preventDefault();
                      if (location.pathname !== '/') {
                        navigate(link.path);
                      } else {
                        const el = document.getElementById(link.path.substring(2));
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="text-[12px] font-artisan-body font-bold tracking-[0.2em] text-artisan-subtle hover:text-artisan-highlight py-2"
                  >
                    {link.name}
                  </a>
                );
              }

              if (link.name === 'CATEGORIES') {
                return (
                  <div key={link.name} className="flex flex-col">
                    <span className="text-[12px] font-artisan-body font-bold tracking-[0.2em] text-artisan-highlight py-2">
                      CATEGORIES
                    </span>
                    <div className="pl-4 flex flex-col gap-2 border-l border-artisan-subtle/10 mt-1 mb-2">
                      {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                        <Link
                          key={key}
                          to={`/products?category=${key}`}
                          onClick={() => setMobileMenuOpen(false)}
                          className="text-[11px] font-artisan-body font-semibold tracking-wider text-artisan-subtle hover:text-artisan-highlight py-1"
                        >
                          {label}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[12px] font-artisan-body font-bold tracking-[0.2em] text-artisan-subtle hover:text-artisan-highlight py-2"
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
