import React from 'react';
import { Link } from 'react-router-dom';

interface CategoryItem {
  name: string;
  slug: string;
  image: string;
}

const categories: CategoryItem[] = [
  { 
    name: 'Wax Candles', 
    slug: 'wax-candles', 
    image: '/images/category_candles.png'
  },
  { 
    name: 'Resin Art', 
    slug: 'resin-art', 
    image: '/images/category_resin.png'
  },
  { 
    name: 'Wooden Ware', 
    slug: 'wooden-ware', 
    image: '/images/category_wooden.png'
  },
  { 
    name: 'Studio Ceramics', 
    slug: 'studio-ceramics', 
    image: '/images/category_ceramics.png'
  },
  { 
    name: 'Macrame Hangings', 
    slug: 'macrame-hangings', 
    image: '/images/category_macrame.png'
  },
  { 
    name: 'Leather Journals', 
    slug: 'leather-journals', 
    image: '/images/category_leather.png'
  },
  { 
    name: 'Terracotta Ware', 
    slug: 'terracotta-ware', 
    image: '/images/category_terracotta.png'
  },
  { 
    name: 'Pressed Flowers', 
    slug: 'pressed-flowers', 
    image: '/images/category_flowers.png'
  },
];

const CategoryGrid: React.FC = () => {
  return (
    <section className="py-10 md:py-14 bg-artisan-bg border-b border-artisan-subtle/5">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-10 lg:px-16">
        
        {/* Section Heading */}
        <div className="text-center mb-6">
          <h2 className="font-artisan-heading text-2xl md:text-3.5xl font-bold text-artisan-primary tracking-wide">
            Shop by Category
          </h2>
          <p className="font-artisan-body text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-artisan-highlight mt-1">
            Fine Artistry in Every Element
          </p>
        </div>

        {/* Categories Grid (Tighter layout, 3 columns on mobile, 4 columns on desktop/tablet) */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 sm:gap-4">
          {categories.map((cat) => (
            <Link 
              key={cat.slug} 
              to={`/products?category=${cat.slug}`}
              className="group bg-artisan-card border border-artisan-subtle/10 p-2 sm:p-3 flex flex-col transition-all duration-300 hover:border-artisan-highlight/30 hover:shadow-sm"
            >
              {/* Category Thumbnail Image (Compact aspect-square) */}
              <div className="w-full aspect-square overflow-hidden mb-2 relative border border-artisan-primary/5 bg-artisan-bg">
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-artisan-primary/5 mix-blend-overlay pointer-events-none"></div>
              </div>

              {/* Title & View Collection */}
              <div className="flex flex-col flex-1 justify-between">
                <h3 className="font-artisan-heading font-bold text-artisan-primary text-xs sm:text-sm md:text-base leading-tight tracking-wide line-clamp-2">
                  {cat.name}
                </h3>
                <span className="font-artisan-body text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-artisan-accent group-hover:text-artisan-highlight transition-colors flex items-center gap-0.5 mt-1">
                  View <span>&rarr;</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
        
      </div>
    </section>
  );
};

export default CategoryGrid;
