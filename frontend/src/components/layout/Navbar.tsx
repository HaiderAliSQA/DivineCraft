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
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  
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
    setCategoryMenuOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [mobileMenuOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: 'Clearance', path: '/products?q=clearance' },
    { name: 'New Arrivals', path: '/products?newArrival=true' },
    { name: 'Deal of the Week', path: '/products?q=deal' },
    { name: 'Shop By Category', path: '/products' },
    { name: 'Bundles', path: '/products?q=bundle' },
    { name: 'Shop', path: '/products' },
    { name: 'Contact', path: '/contact' },
    { name: 'Order Tracking', path: '/track-order' },
  ];

  return (
    <header className={`sticky top-0 w-full z-50 transition-all duration-300 bg-white border-b border-gray-200 ${
      scrolled ? 'py-4 shadow-md' : 'py-7.5'
    }`}>
      <div className="w-full px-0">
        <div className="flex items-center justify-between relative w-full px-4 md:px-6">
          
          {/* LEFT: DivineCraft logo (circular badge matching the FUNPAREY style) */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-10 h-10 rounded-full bg-artisan-primary border-2 border-artisan-accent flex items-center justify-center font-artisan-heading text-lg font-bold text-artisan-accent shadow-sm group-hover:scale-105 transition-all">
              D
            </div>
            <span className="font-artisan-heading text-base md:text-lg font-extrabold tracking-widest text-artisan-primary uppercase">
              DivineCraft
            </span>
          </Link>

          {/* CENTER: Navigation links matching FUNPAREY style */}
          <nav className="hidden xl:flex items-center gap-4 xl:gap-6">
            {navLinks.map((link) => {
              const isClearance = location.search.includes('q=clearance');
              const isNewArrival = location.search.includes('newArrival=true');
              const isDeal = location.search.includes('q=deal');
              const isBundle = location.search.includes('q=bundle');

              let isActive = false;

              if (link.name === 'Clearance') {
                isActive = isClearance;
              } else if (link.name === 'New Arrivals') {
                isActive = isNewArrival;
              } else if (link.name === 'Deal of the Week') {
                isActive = isDeal;
              } else if (link.name === 'Bundles') {
                isActive = isBundle;
              } else if (link.name === 'Shop By Category') {
                isActive = location.pathname === '/products' && location.search.includes('category=') && !isClearance && !isNewArrival && !isDeal && !isBundle;
              } else if (link.name === 'Shop') {
                isActive = location.pathname === '/products' && !isClearance && !isNewArrival && !isDeal && !isBundle && !location.search.includes('category=') && !location.search.includes('search=');
              } else {
                isActive = location.pathname === link.path;
              }

              const isShopByCategory = link.name === 'Shop By Category';

              return (
                <div 
                  key={link.name} 
                  className="relative py-5"
                  onMouseEnter={() => isShopByCategory && setCategoryMenuOpen(true)}
                  onMouseLeave={() => isShopByCategory && setCategoryMenuOpen(false)}
                >
                  <Link
                    to={link.path}
                    className={`text-[11px] xl:text-[12px] font-black uppercase tracking-wider transition-all relative pb-3 hover:text-artisan-highlight ${
                      isActive ? 'text-artisan-highlight' : 'text-gray-700'
                    }`}
                  >
                    {link.name}
                    {/* Thick orange/gold line matching the screenshot */}
                    <span className={`absolute bottom-0 left-0 right-0 h-[3px] bg-artisan-accent transition-all duration-300 transform origin-left ${
                      isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`} />
                  </Link>

                  {/* Animated Category Mega Menu Dropdown connected with DB categories */}
                  {isShopByCategory && (
                    <div className={`absolute top-full left-1/2 -translate-x-1/2 w-[900px] max-w-[95vw] bg-white border border-gray-200 shadow-2xl py-8 px-8 transition-all duration-300 z-50 rounded-2xl ${
                      categoryMenuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
                    }`}>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-6 justify-center">
                        {Object.entries(CATEGORY_LABELS).map(([key, label]) => {
                          const imgMap: Record<string, string> = {
                            'baby-collection': 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=150&auto=format&fit=crop&q=80',
                            'home-decor': 'https://images.unsplash.com/photo-1606744824163-985d376605aa?w=150&auto=format&fit=crop&q=80',
                            'kitchen-dining': 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=150&auto=format&fit=crop&q=80',
                            'art-gifts': 'https://images.unsplash.com/photo-1517705008128-361805f42e8a?w=150&auto=format&fit=crop&q=80',
                            'furniture': 'https://images.unsplash.com/photo-1503602642458-232111445657?w=150&auto=format&fit=crop&q=80',
                            'lighting': 'https://images.unsplash.com/photo-1543157148-f68f2ea43f5f?w=150&auto=format&fit=crop&q=80',
                            'storage-boxes': 'https://images.unsplash.com/photo-1590487988256-9ed24133863e?w=150&auto=format&fit=crop&q=80',
                            'religious-islamic-decor': 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=150&auto=format&fit=crop&q=80'
                          };
                          const imgUrl = imgMap[key] || 'https://images.unsplash.com/photo-1590487988256-9ed24133863e?w=150&auto=format&fit=crop&q=80';
                          return (
                            <Link
                               key={key}
                               to={`/products?category=${key}`}
                               onClick={() => setCategoryMenuOpen(false)}
                               className="flex flex-col items-center group/item text-center cursor-pointer"
                            >
                              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-[#D4AF37] overflow-hidden shadow-md group-hover/item:scale-110 transition-all duration-300 p-0.5 bg-white">
                                <img src={imgUrl} alt={label} className="w-full h-full object-cover rounded-full" />
                              </div>
                              <span className="mt-3 text-[11px] sm:text-[12px] font-black text-gray-700 group-hover/item:text-artisan-highlight transition-colors uppercase tracking-wider">
                                {label}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* RIGHT: User Profile icon + Search icon + Cart icon */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            
            {/* User Profile Link (to Admin) */}
            <Link
              to="/admin/login"
              className="p-2 text-gray-700 hover:text-artisan-highlight transition-colors"
              aria-label="Admin Portal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>

            {/* Inline search box toggle */}
            <div className="relative flex items-center">
              {searchOpen && (
                <form onSubmit={handleSearchSubmit} className="absolute right-full mr-2 z-10 animate-fade-in">
                  <input
                    type="text"
                    placeholder="Search crafts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-36 sm:w-48 bg-gray-50 border border-gray-200 px-3 py-1.5 text-xs text-gray-800 placeholder-gray-400 rounded-lg outline-none focus:border-artisan-accent"
                    autoFocus
                  />
                </form>
              )}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-gray-700 hover:text-artisan-highlight transition-colors"
                aria-label="Search website"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>

            {/* Cart Button */}
            <button 
              onClick={toggleCart}
              className="relative p-2 text-gray-700 hover:text-artisan-highlight transition-colors group"
              aria-label="Toggle cart drawer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {count > 0 && (
                <span key={count} className="absolute -top-0.5 -right-0.5 bg-red-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md animate-badge-pop">
                  {count}
                </span>
              )}
            </button>

            {/* Mobile Hamburger toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-gray-700 hover:text-artisan-highlight transition-colors"
              aria-label="Toggle mobile menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Menu Backdrop */}
      {mobileMenuOpen && (
        <div 
          className="xl:hidden fixed inset-0 bg-black/40 z-[45] transition-opacity duration-300"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* MOBILE SIDE SLIDING DRAWER */}
      <div className={`xl:hidden fixed top-0 left-0 bottom-0 w-[280px] max-w-[80vw] bg-white z-[48] shadow-2xl py-8 px-6 transform transition-transform duration-300 ease-in-out overflow-y-auto flex flex-col ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col gap-2 mt-20">
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
                  className="text-[14px] font-artisan-body font-bold tracking-[0.2em] text-artisan-subtle hover:text-artisan-highlight hover:bg-[#FAF7F2] rounded-xl px-3 py-2 transition-all block"
                >
                  {link.name}
                </a>
              );
            }

            if (link.name === 'Shop By Category') {
              return (
                <div key={link.name} className="flex flex-col">
                  <span className="text-[14px] font-artisan-body font-bold tracking-[0.2em] text-artisan-highlight px-3 py-1 mb-1">
                    SHOP BY CATEGORY
                  </span>
                  <div className="pl-4 flex flex-col gap-1 border-l border-artisan-subtle/10 mt-0.5 mb-1 ml-3">
                    {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                      <Link
                        key={key}
                        to={`/products?category=${key}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-[13px] font-artisan-body font-semibold tracking-wider text-artisan-subtle hover:text-artisan-highlight hover:bg-[#FAF7F2] rounded-lg px-3 py-1.5 transition-all block"
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
                className="text-[14px] font-artisan-body font-bold tracking-[0.2em] text-artisan-subtle hover:text-artisan-highlight hover:bg-[#FAF7F2] rounded-xl px-3 py-2 transition-all block"
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
