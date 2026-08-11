import React, { useState, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetProductsQuery } from '../store/api/productsApi';
import ProductCard from '../components/ui/ProductCard';
import ProductSkeleton from '../components/ui/ProductSkeleton';
import { useScrollReveal } from '../hooks/useScrollReveal';

const RELATED_CATEGORIES = {
  'baby-collection': {
    label: 'Baby Collection',
    items: ['Wooden Toys', 'Baby Decor', 'Baby Gift Sets', 'Nursery Accessories']
  },
  'home-decor': {
    label: 'Home Décor',
    items: ['Decorative Vases', 'Decorative Jars', 'Wall Hangings', 'Table Décor', 'Decorative Plates', 'Decorative Bowls', 'Showpieces']
  },
  'kitchen-dining': {
    label: 'Kitchen & Dining',
    items: ['Serving Trays', 'Fruit Baskets', 'Ash Trays', 'Coasters', 'Spice Boxes', 'Bowls', 'Kitchen Organizers']
  },
  'art-gifts': {
    label: 'Art & Gifts',
    items: ['Gift Boxes', 'Jewelry Boxes', 'Handmade Gifts', 'Mini Musical Instruments', 'Decorative Crafts', 'Souvenirs']
  },
  'furniture': {
    label: 'Furniture',
    items: ['Side Tables', 'Nesting Tables', 'Coffee Tables', 'Stools', 'Plant Stands', 'Display Stands']
  },
  'lighting': {
    label: 'Lighting',
    items: ['Wooden Lamps', 'Table Lamps', 'Hanging Lanterns', 'Decorative Lanterns', 'Candle Holders']
  },
  'storage-boxes': {
    label: 'Storage & Boxes',
    items: ['Storage Boxes', 'Jewelry Boxes', 'Organizer Boxes', 'Wooden Chests', 'Keepsake Boxes']
  },
  'religious-islamic-decor': {
    label: 'Religious & Islamic Décor',
    items: ['Islamic Wall Art', 'Arabic Calligraphy', 'Quran Stands (Rehal)', 'Islamic Decorative Pieces', 'Mosque Models', 'Ramadan & Eid Collection']
  }
};

const SORTS = [
  { label: 'Newest Arrivals', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
];

const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const category = searchParams.get('category') || '';
  const [expandedCategories, setExpandedCategories] = useState<string[]>(category ? [category] : []);
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const q = searchParams.get('q') || '';
  const newArrival = searchParams.get('newArrival') || '';
  const trackRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useGetProductsQuery({
    category,
    minPrice: minPrice || undefined,
    maxPrice: maxPrice || undefined,
    sortBy: sort,
    search: q || undefined,
    newArrival: newArrival || undefined,
    page,
    limit: 12,
  });

  const products = data?.data?.products || [];
  const revealRef = useScrollReveal(0.1);
  const totalPages = data?.data?.pages || 1;
  const totalItems = data?.data?.total || 0;

  // Static max price for the price range slider — avoids a redundant extra API call on page load.
  const maxLimit = 37500;

  const minVal = minPrice ? parseInt(minPrice, 10) : 0;
  const maxVal = maxPrice ? parseInt(maxPrice, 10) : maxLimit;

  const updateParam = useCallback((key: string, value: string) => {
    setSearchParams(params => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      if (key !== 'page') params.set('page', '1');
      return params;
    });
  }, [setSearchParams]);

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const handleTrackInteraction = (clientX: number) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const clickX = clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    const clickVal = Math.round(pct * maxLimit);

    // Determine which thumb is closer to click point
    if (Math.abs(clickVal - minVal) < Math.abs(clickVal - maxVal)) {
      const nextMin = Math.min(clickVal, maxVal - 50);
      updateParam('minPrice', nextMin.toString());
    } else {
      const nextMax = Math.max(clickVal, minVal + 50);
      updateParam('maxPrice', nextMax.toString());
    }
  };

  const FiltersContent = () => (
    <div className="space-y-10">
      {/* Price Range Slider */}
      <div>
        <h3 className="font-heading text-[16px] uppercase text-gray-400 mb-6 font-normal border-b border-white/5 pb-2">Filter by Price</h3>
        <div 
          ref={trackRef}
          onMouseDown={(e) => handleTrackInteraction(e.clientX)}
          onMouseMove={(e) => {
            if (e.buttons === 1) { // Left click is dragged
              handleTrackInteraction(e.clientX);
            }
          }}
          className="relative w-full h-8 flex items-center cursor-pointer select-none"
        >
          {/* Track background - Thicker (bold) track */}
          <div className="absolute left-0 right-0 h-1.5 bg-gray-600 rounded-full" />
          
          {/* Active Range Highlight */}
          <div 
            className="absolute h-1.5 bg-artisan-accent rounded-full"
            style={{
              left: `${(minVal / maxLimit) * 100}%`,
              right: `${100 - (maxVal / maxLimit) * 100}%`
            }}
          />

          {/* Left Pointer Thumb (Min) */}
          <div 
            className="absolute w-4 h-4 rounded-full bg-black -ml-2 top-1/2 -translate-y-1/2 shadow-md hover:scale-110 transition-transform"
            style={{ left: `${(minVal / maxLimit) * 100}%` }}
          />

          {/* Right Pointer Thumb (Max) */}
          <div 
            className="absolute w-4 h-4 rounded-full bg-black -ml-2 top-1/2 -translate-y-1/2 shadow-md hover:scale-110 transition-transform"
            style={{ left: `${(maxVal / maxLimit) * 100}%` }}
          />
        </div>
        <div className="text-left mt-2 select-none">
          <span className="text-[14px] font-medium text-artisan-accent">
            Rs {minVal} — Rs {maxVal}
          </span>
        </div>
      </div>

      {/* Category */}
      <div>
        <h3 className="font-heading text-[16px] uppercase text-gray-400 mb-6 font-normal border-b border-white/5 pb-2">Related Categories</h3>
        <div className="space-y-4 font-body max-h-[350px] overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-white/5 [&::-webkit-scrollbar-thumb]:hover:bg-gray-300">
          {/* All Products */}
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => {
                setSearchParams(new URLSearchParams());
              }}
              className={`w-4 h-4 rounded border transition-all flex items-center justify-center shrink-0 ${
                !category && !q 
                  ? 'bg-artisan-accent border-artisan-accent text-white' 
                  : 'border-gray-300 bg-white text-transparent'
              }`}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </button>
            <span className={`text-[13px] font-bold uppercase tracking-wider transition-all cursor-pointer ${!category && !q ? 'text-artisan-highlight' : 'text-gray-700'}`} onClick={() => setSearchParams(new URLSearchParams())}>
              All Products
            </span>
          </div>

          {Object.entries(RELATED_CATEGORIES).map(([catKey, catVal]) => {
            const activeCategories = category ? category.split(',').filter(Boolean) : [];
            const isCatActive = activeCategories.includes(catKey);
            const isExpanded = expandedCategories.includes(catKey);

            return (
              <div key={catKey} className="space-y-2">
                <div className="flex items-center gap-2">
                  {/* Plus / Minus Expand Button */}
                  <button
                    onClick={() => {
                      setExpandedCategories(prev =>
                        prev.includes(catKey)
                          ? prev.filter(k => k !== catKey)
                          : [...prev, catKey]
                      );
                    }}
                    className="text-gray-400 font-extrabold text-xs w-4 h-4 flex items-center justify-center hover:text-gray-900 transition-colors shrink-0"
                  >
                    {isExpanded ? '—' : '+'}
                  </button>

                  {/* Parent Checkbox */}
                  <button
                    onClick={() => {
                      setSearchParams(prevParams => {
                        const params = new URLSearchParams(prevParams);
                        const nextCats = isCatActive
                          ? activeCategories.filter(k => k !== catKey)
                          : [...activeCategories, catKey];
                        
                        if (nextCats.length > 0) {
                          params.set('category', nextCats.join(','));
                        } else {
                          params.delete('category');
                        }
                        params.set('page', '1');
                        return params;
                      });
                      if (!isExpanded) {
                        setExpandedCategories(prev => [...prev, catKey]);
                      }
                    }}
                    className={`w-4 h-4 rounded border transition-all flex items-center justify-center shrink-0 ${
                      isCatActive 
                        ? 'bg-artisan-accent border-artisan-accent text-white' 
                        : 'border-gray-300 bg-white text-transparent'
                    }`}
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </button>

                  {/* Parent Label */}
                  <span 
                    onClick={() => {
                      setSearchParams(prevParams => {
                        const params = new URLSearchParams(prevParams);
                        const nextCats = isCatActive
                          ? activeCategories.filter(k => k !== catKey)
                          : [...activeCategories, catKey];
                        
                        if (nextCats.length > 0) {
                          params.set('category', nextCats.join(','));
                        } else {
                          params.delete('category');
                        }
                        params.set('page', '1');
                        return params;
                      });
                      if (!isExpanded) {
                        setExpandedCategories(prev => [...prev, catKey]);
                      }
                    }}
                    className={`text-[18px] font-normal transition-all cursor-pointer select-none ${isCatActive ? 'text-artisan-accent' : 'text-gray-300 hover:text-white'}`}
                  >
                    {catVal.label}
                  </span>
                </div>

                {/* Subcategories (Indented and visible when parent category is expanded) */}
                {isExpanded && (
                  <div className="pl-4 space-y-2 mt-1">
                    {catVal.items.map((subItem) => {
                      const activeSubcategories = q ? q.split(',').filter(Boolean) : [];
                      const isSubActive = activeSubcategories.some(s => s.toLowerCase() === subItem.toLowerCase());

                      return (
                        <div key={subItem} className="flex items-center gap-2">
                          
                          {/* Subcategory Checkbox */}
                          <button
                            onClick={() => {
                              setSearchParams(prevParams => {
                                const params = new URLSearchParams(prevParams);
                                const nextSubs = isSubActive
                                  ? activeSubcategories.filter(s => s.toLowerCase() !== subItem.toLowerCase())
                                  : [...activeSubcategories, subItem];

                                if (nextSubs.length > 0) {
                                  params.set('q', nextSubs.join(','));
                                } else {
                                  params.delete('q');
                                }
                                // Ensure this subcategory's parent category is also included in search
                                if (!isCatActive) {
                                  const nextCats = [...activeCategories, catKey];
                                  params.set('category', nextCats.join(','));
                                }
                                params.set('page', '1');
                                return params;
                              });
                            }}
                            className={`w-4 h-4 rounded border transition-all flex items-center justify-center shrink-0 ${
                              isSubActive 
                                ? 'bg-artisan-accent border-artisan-accent text-white' 
                                : 'border-gray-500 bg-white/10 text-transparent'
                            }`}
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </button>

                          {/* Subcategory Label */}
                          <span 
                            onClick={() => {
                              setSearchParams(prevParams => {
                                const params = new URLSearchParams(prevParams);
                                const nextSubs = isSubActive
                                  ? activeSubcategories.filter(s => s.toLowerCase() !== subItem.toLowerCase())
                                  : [...activeSubcategories, subItem];

                                if (nextSubs.length > 0) {
                                  params.set('q', nextSubs.join(','));
                                } else {
                                  params.delete('q');
                                }
                                if (!isCatActive) {
                                  const nextCats = [...activeCategories, catKey];
                                  params.set('category', nextCats.join(','));
                                }
                                params.set('page', '1');
                                return params;
                              });
                            }}
                            className={`text-[16px] font-normal transition-all cursor-pointer select-none ${
                              isSubActive ? 'text-artisan-accent' : 'text-gray-400 hover:text-white'
                            }`}
                          >
                            {subItem}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <button 
        onClick={clearFilters}
        className="text-red-400 hover:text-red-300 text-[10px] font-bold uppercase tracking-widest transition-colors"
      >
        Reset All Filters
      </button>
    </div>
  );

  const getPageTitle = () => {
    if (newArrival === 'true') return 'New Arrivals';
    if (q.toLowerCase() === 'clearance') return 'Clearance';
    if (q.toLowerCase() === 'deal') return 'Deal of the Week';
    if (q.toLowerCase() === 'bundle') return 'Bundles';
    if (category) {
      const catKey = category.split(',')[0];
      return RELATED_CATEGORIES[catKey as keyof typeof RELATED_CATEGORIES]?.label || category.replace('-', ' ');
    }
    return 'All Collection';
  };

  return (
    <div className="min-h-screen bg-navy-dark pt-0" ref={revealRef}>
      
      {/* Mobile Filter Trigger */}
      <div className="lg:hidden sticky top-20 z-40 bg-navy-mid/80 backdrop-blur-md px-4 py-3 border-b border-white/5 flex justify-between items-center transition-all">
        <button 
          onClick={() => setIsMobileFiltersOpen(true)}
          className="flex items-center gap-2 font-heading text-[10px] tracking-widest uppercase text-white font-extrabold px-5 py-2.5 rounded-full bg-electric shadow-glow-blue"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 4h18M3 12h18M3 20h18" /></svg>
          Filters
        </button>
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{totalItems} Results</span>
      </div>

      {/* Mobile Side Drawer (Modern) */}
      {isMobileFiltersOpen && (
        <div className="lg:hidden fixed inset-0 z-[100]">
          <div className="absolute inset-0 bg-navy-dark/90 backdrop-blur-sm animate-fade-in" onClick={() => setIsMobileFiltersOpen(false)} />
          <div className="absolute top-0 right-0 w-[85%] h-full bg-navy-mid border-l border-white/5 p-8 shadow-2xl animate-slide-in-right overflow-y-auto">
            <div className="flex justify-between items-center mb-10">
              <h2 className="font-heading text-xl font-extrabold text-white">Filters</h2>
              <button onClick={() => setIsMobileFiltersOpen(false)} className="text-gray-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <FiltersContent />
            <button 
              onClick={() => setIsMobileFiltersOpen(false)} 
              className="mt-12 w-full btn-electric py-4 rounded-xl font-bold"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      <div className="flex max-w-screen-2xl mx-auto">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-72 shrink-0 border-r border-white/5 min-h-[calc(100vh-80px)] pl-5 pr-6 pt-0 pb-10">
          <div className="sticky top-32">
            <h2 className="font-heading text-[16px] uppercase text-gray-600 font-normal mb-10">Navigation</h2>
            <FiltersContent />
          </div>
        </aside>

        {/* Main Grid */}
        <main className="flex-1 pl-4 pr-6 pb-12 pt-0 md:pl-6 md:pr-8 md:pb-12 md:pt-0 lg:pl-6 lg:pr-10 lg:pb-12 lg:pt-0">
          {q && !['clearance', 'deal', 'bundle'].includes(q.toLowerCase()) && (
            <div className="mb-10 animate-fade-in">
              <h1 className="text-gray-400 text-sm uppercase tracking-widest font-bold">Search results for:</h1>
              <p className="text-white text-3xl font-extrabold mt-2">"{q}"</p>
            </div>
          )}

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div className="space-y-1">
              <h2 className="font-heading text-2xl font-extrabold text-white uppercase tracking-tight">
                {getPageTitle()}
              </h2>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                Showing {totalItems} items across Pakistan
              </p>
            </div>

            <div className="flex items-center gap-4">
               <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Sort:</span>
               <select 
                value={sort}
                onChange={(e) => updateParam('sort', e.target.value)}
                className="bg-navy-mid border border-white/5 text-white text-xs font-bold rounded-xl px-5 py-3 focus:outline-none focus:border-electric transition-all"
              >
                {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {products.map((product) => <ProductCard key={product._id} product={product} />)}
            </div>
          ) : (
            <div className="py-32 text-center bg-navy-mid/20 rounded-[3rem] border border-white/5 border-dashed">
              <span className="text-4xl mb-6 block">⚡</span>
              <h3 className="font-heading text-2xl font-extrabold text-white mb-2">No items found</h3>
              <p className="text-gray-500 text-sm mb-8">Try adjusting your filters or search query.</p>
              <button onClick={clearFilters} className="btn-electric px-10 py-4 font-bold rounded-2xl">
                Reset Collection
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-20">
              <button
                onClick={() => updateParam('page', Math.max(1, page - 1).toString())}
                disabled={page === 1}
                className="w-12 h-12 bg-navy-mid rounded-xl flex items-center justify-center text-white disabled:opacity-30 border border-white/5 hover:border-electric transition-colors"
              >
                ←
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => updateParam('page', (i + 1).toString())}
                  className={`w-12 h-12 rounded-xl text-sm font-bold transition-all ${page === i + 1 ? 'bg-electric text-white shadow-glow-blue' : 'bg-navy-mid text-gray-400 border border-white/5 hover:border-gray-300'}`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => updateParam('page', Math.min(totalPages, page + 1).toString())}
                disabled={page === totalPages}
                className="w-12 h-12 bg-navy-mid rounded-xl flex items-center justify-center text-white disabled:opacity-30 border border-white/5 hover:border-electric transition-colors"
              >
                →
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Products;
