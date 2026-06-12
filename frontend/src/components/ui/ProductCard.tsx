// frontend/src/components/ui/ProductCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { useCart } from '../../hooks/useCart';
import { formatPrice, discountPercent } from '../../utils/formatPrice';

interface ProductCardProps {
  product: Product;
  index?: number; // for stagger animation delay
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index }) => {
  const { addToCart } = useCart();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart({
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images[0] || '',
      slug: product.slug,
      color: product.colors?.[0] || 'Original',
    });
  };

  const discount = discountPercent(product.price, product.compareAtPrice || 0);

  // Derived Category Label helper
  const getCategoryLabel = () => {
    const labels: Record<string, string> = {
      'wax-candles': 'Wax Candle',
      'resin-art': 'Resin Art',
      'wooden-ware': 'Wooden Ware',
      'studio-ceramics': 'Studio Ceramics',
      'macrame-hangings': 'Macrame',
      'leather-journals': 'Leather Journal',
      'terracotta-ware': 'Terracotta',
      'pressed-flowers': 'Pressed Flower',
    };
    return labels[product.category] || 'Artisan Craft';
  };

  // Determine Badge Type: SALE, NEW, HOT
  const renderBadge = () => {
    if (discount > 0) {
      return (
        <span className="bg-artisan-highlight text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
          SALE -{discount}%
        </span>
      );
    }
    // Alternate badges for editorial diversity
    if ((index || 0) % 2 === 0) {
      return (
        <span className="bg-artisan-accent text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
          NEW
        </span>
      );
    }
    return (
      <span className="bg-artisan-primary text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
        HOT
      </span>
    );
  };

  return (
    <div 
      className="group relative flex flex-col bg-artisan-card border border-artisan-subtle/10 rounded-none overflow-hidden transition-all duration-300" 
      style={{ transitionDelay: `${(index || 0) * 0.05}s` }}
    >
      <Link to={`/product/${product.slug}`} className="w-full relative flex flex-col flex-1">
        {/* TALL EDITORIAL IMAGE AREA */}
        <div className="relative w-full aspect-[3/4] overflow-hidden bg-artisan-bg">
          <img 
            src={product.images[0] || '/placeholder.png'} 
            alt={product.name} 
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
          />

          {/* BADGES (Top-left corner, colored pill) */}
          <div className="absolute top-4 left-4 z-10">
            {renderBadge()}
          </div>
        </div>

        {/* INFO AREA */}
        <div className="p-5 flex flex-col flex-1">
          {/* Category Label */}
          <span className="font-artisan-body text-[9px] font-bold uppercase tracking-widest text-artisan-highlight">
            {getCategoryLabel()}
          </span>

          {/* Product Name (Cormorant, medium) */}
          <h3 className="font-artisan-heading text-base md:text-lg font-medium text-artisan-primary mt-1.5 line-clamp-2 leading-snug">
            {product.name}
          </h3>
          
          {/* Price (with strikethrough if on sale) */}
          <div className="flex items-baseline gap-2 mt-2">
            <span className="font-artisan-body text-sm font-bold text-artisan-primary">
              Rs. {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="font-artisan-body text-gray-400 line-through text-xs font-medium">
                Rs. {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
          
          {/* Outlined Add to Cart Button */}
          {product.stock > 0 ? (
            <button 
              onClick={handleQuickAdd}
              className="w-full mt-5 bg-transparent border border-artisan-primary text-artisan-primary font-artisan-body text-[10px] font-bold uppercase tracking-[0.25em] py-3.5 hover:bg-artisan-primary hover:text-white transition-all duration-300 rounded-none cursor-pointer"
              aria-label="Add to Cart"
            >
              Add to Cart
            </button>
          ) : (
            <button 
              disabled
              className="w-full mt-5 bg-transparent border border-artisan-subtle/30 text-artisan-subtle/60 font-artisan-body text-[10px] font-bold uppercase tracking-[0.25em] py-3.5 rounded-none cursor-not-allowed"
              title="Out of Stock"
            >
              SOLD OUT
            </button>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
