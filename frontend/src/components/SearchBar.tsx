// frontend/src/components/SearchBar.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = [
  { label: 'All Categories', value: '' },
  { label: 'Wax Candles', value: 'wax-candles' },
  { label: 'Resin Art', value: 'resin-art' },
  { label: 'Wooden Ware', value: 'wooden-ware' },
  { label: 'Studio Ceramics', value: 'studio-ceramics' },
  { label: 'Macrame Hangings', value: 'macrame-hangings' },
  { label: 'Leather Journals', value: 'leather-journals' },
  { label: 'Terracotta Ware', value: 'terracotta-ware' },
  { label: 'Pressed Flowers', value: 'pressed-flowers' },
  { label: 'Other Accessories', value: 'other-accessories' },
];

export const SearchBar: React.FC = () => {
  const [category, setCategory] = useState('');
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (query.trim()) params.set('q', query.trim());
    
    if (category && !query.trim()) {
      navigate(`/products?category=${category}`);
    } else if (params.toString()) {
      navigate(`/search?${params.toString()}`);
    }
  };

  return (
    <div className="flex items-center w-full bg-navy-mid border border-gray-700 rounded-xl overflow-hidden group focus-within:border-electric transition-all h-11 md:h-12 shadow-inner">
      <select 
        value={category} 
        onChange={(e) => setCategory(e.target.value)}
        className="bg-transparent border-none outline-none font-body text-[10px] md:text-xs font-semibold text-gray-300 px-3 md:px-4 cursor-pointer min-w-[100px] md:min-w-[140px] uppercase tracking-wider border-r border-gray-700"
      >
        {CATEGORIES.map(c => <option key={c.value} value={c.value} className="bg-navy-dark text-white">{c.label}</option>)}
      </select>
      
      <input
        type="text"
        placeholder="Search products, brands, models..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        className="flex-1 bg-transparent border-none outline-none px-4 py-1 font-body text-sm text-white placeholder-gray-500"
      />
      
      <button 
        onClick={handleSearch}
        className="w-11 md:w-14 h-full flex items-center justify-center bg-electric hover:bg-blue-600 text-white transition-all active:scale-95"
      >
        <svg className="w-5 h-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </div>
  );
};

export default SearchBar;
