import React from 'react';
import { Link } from 'react-router-dom';

interface CategoryItem {
  name: string;
  slug: string;
  icon: React.ReactNode;
}

const categories: CategoryItem[] = [
  { 
    name: 'Wax Candles', 
    slug: 'wax-candles', 
    icon: (
      <svg className="w-8 h-8 text-artisan-primary" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v3m0 0a3 3 0 00-3 3v9a3 3 0 006 0V9a3 3 0 00-3-3zm0-3c.4 0 .7.3.7.7v2.3h-1.4V3.7c0-.4.3-.7.7-.7z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c1-1.5 2-1.5 2 0v1.5h-2V3z" className="text-artisan-highlight" />
      </svg>
    )
  },
  { 
    name: 'Resin Art', 
    slug: 'resin-art', 
    icon: (
      <svg className="w-8 h-8 text-artisan-primary" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122l.14-.141a2.25 2.25 0 113.182 3.182l-.14.141a1.5 1.5 0 01-2.122 0L8.47 17.18a1.5 1.5 0 010-2.122z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.656 48.656 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7C4.547 9.547 4.5 10.768 4.5 12s.047 2.453.138 3.662a4.006 4.006 0 003.7 3.7c1.209.092 2.43.138 3.662.138M19.5 12a48.544 48.544 0 01-3.662.138m3.662-.138a4.006 4.006 0 00-3.7-3.7c-.8-.06-1.613-.107-2.43-.138m0 0a48.544 48.544 0 00-7.324 0" />
      </svg>
    )
  },
  { 
    name: 'Wooden Ware', 
    slug: 'wooden-ware', 
    icon: (
      <svg className="w-8 h-8 text-artisan-primary" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="6" strokeDasharray="3 3" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    )
  },
  { 
    name: 'Studio Ceramics', 
    slug: 'studio-ceramics', 
    icon: (
      <svg className="w-8 h-8 text-artisan-primary" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21h7.5M8.25 21a1.5 1.5 0 01-1.5-1.5v-3.375m9 4.875a1.5 1.5 0 001.5-1.5v-3.375M6.75 16.125c0-1.558.468-3.007 1.275-4.218a5.25 5.25 0 018.95 0c.807 1.21 1.275 2.66 1.275 4.218M6.75 16.125h10.5m-9-6.375V6.75m6 3c0-1.242-.394-2.392-1.066-3.333a3 3 0 00-3.868 0C8.144 4.358 7.75 5.508 7.75 6.75V9.75M9 3h6" />
      </svg>
    )
  },
  { 
    name: 'Macrame Hangings', 
    slug: 'macrame-hangings', 
    icon: (
      <svg className="w-8 h-8 text-artisan-primary" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5M4.5 19.5h15M5.25 6h13.5M12 3v18M8.25 6l7.5 12M15.75 6l-7.5 12" />
      </svg>
    )
  },
  { 
    name: 'Leather Journals', 
    slug: 'leather-journals', 
    icon: (
      <svg className="w-8 h-8 text-artisan-primary" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    )
  },
  { 
    name: 'Terracotta Ware', 
    slug: 'terracotta-ware', 
    icon: (
      <svg className="w-8 h-8 text-artisan-primary" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 9h12l-1.5 9.5a2.5 2.5 0 01-2.5 2.5H10a2.5 2.5 0 01-2.5-2.5L6 9z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 5.5a1.5 1.5 0 011.5-1.5h11a1.5 1.5 0 011.5 1.5v2H5v-2z" />
      </svg>
    )
  },
  { 
    name: 'Pressed Flowers', 
    slug: 'pressed-flowers', 
    icon: (
      <svg className="w-8 h-8 text-artisan-primary" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c1-1.5 3-1.5 3 0v1.5h-3V8.25zm0 0c-1-1.5-3-1.5-3 0v1.5h3V8.25zm0 3v5.25m0-5.25c1.5 1 1.5 3 0 3H12m0-3c-1.5 1-1.5 3 0 3H12" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
      </svg>
    )
  },
];

const CategoryGrid: React.FC = () => {
  return (
    <section className="py-20 bg-artisan-bg border-b border-artisan-subtle/5">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
        
        {/* Section Heading */}
        <div className="text-center mb-14">
          <h2 className="font-artisan-heading text-3xl md:text-4xl font-normal text-artisan-primary tracking-wide">
            Shop by Category
          </h2>
          <p className="font-artisan-body text-[11px] md:text-xs font-bold uppercase tracking-[0.25em] text-artisan-highlight mt-2">
            Fine Artistry in Every Element
          </p>
        </div>

        {/* Categories 4-Column Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link 
              key={cat.slug} 
              to={`/products?category=${cat.slug}`}
              className="group bg-artisan-card border border-artisan-subtle/10 rounded-none p-6 md:p-8 flex flex-col items-center justify-center text-center transition-all duration-300 hover:border-artisan-accent/50 hover:shadow-md hover:-translate-y-1"
            >
              <div className="w-16 h-16 rounded-full bg-artisan-bg flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300">
                {cat.icon}
              </div>
              <h3 className="font-artisan-heading font-medium text-artisan-primary text-base md:text-lg mb-4 tracking-wide">
                {cat.name}
              </h3>
              <span className="font-artisan-body text-[9px] font-bold uppercase tracking-widest text-artisan-accent group-hover:text-artisan-highlight transition-colors flex items-center gap-1.5">
                View Collection <span>&rarr;</span>
              </span>
            </Link>
          ))}
        </div>
        
      </div>
    </section>
  );
};

export default CategoryGrid;
