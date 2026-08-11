// frontend/src/components/ui/ProductCard.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../types';
import { useCart } from '../../hooks/useCart';
import { formatPrice, discountPercent } from '../../utils/formatPrice';

interface ProductCardProps {
  product: Product;
  index?: number;
}

/**
 * Transforms a Cloudinary image URL to apply automatic format (WebP/AVIF),
 * quality compression, and width resizing. Falls back to the original URL
 * for any non-Cloudinary image source.
 */
function toCloudinaryOptimized(url: string, width = 400): string {
  if (!url || !url.includes('res.cloudinary.com')) return url;
  // Insert transformation parameters after '/upload/'
  return url.replace(
    '/upload/',
    `/upload/w_${width},f_auto,q_auto:good/`
  );
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [addedFlash, setAddedFlash] = useState(false);

  const discount = discountPercent(product.price, product.compareAtPrice || 0);

  const getCategoryLabel = () => {
    const labels: Record<string, string> = {
      'baby-collection': 'Baby Collection',
      'home-decor': 'Home Décor',
      'kitchen-dining': 'Kitchen & Dining',
      'art-gifts': 'Art & Gifts',
      'furniture': 'Furniture',
      'lighting': 'Lighting',
      'storage-boxes': 'Storage & Boxes',
      'religious-islamic-decor': 'Islamic Décor',
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

  const renderBadge = () => {
    if (discount > 0) {
      return (
        <span className="bg-green-500 text-white text-[9px] font-bold px-2.5 py-0.5 rounded-sm uppercase tracking-wide shadow-sm">
          Sale!
        </span>
      );
    }
    if ((index || 0) % 3 === 0) {
      return (
        <span className="bg-green-500 text-white text-[9px] font-bold px-2.5 py-0.5 rounded-sm uppercase tracking-wide shadow-sm">
          New!
        </span>
      );
    }
    return (
      <span className="bg-green-500 text-white text-[9px] font-bold px-2.5 py-0.5 rounded-sm uppercase tracking-wide shadow-sm">
        Hot!
      </span>
    );
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) return;

    setAddedFlash(true);
    setTimeout(() => setAddedFlash(false), 700);

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

  return (
    <div
      className="group relative flex flex-col bg-white border border-gray-100 overflow-hidden cursor-pointer h-full"
      style={{ transitionDelay: `${(index || 0) * 0.04}s` }}
    >
      {/* ── IMAGE AREA (100% Visible, No Opacity Overlays) ── */}
      <div 
        className="relative w-full aspect-[3/4] overflow-hidden bg-gray-50"
        onClick={() => navigate(`/product/${product.slug}`)}
      >
        <img
          src={toCloudinaryOptimized(product.images[0] || '/placeholder.png', 400)}
          alt={product.name}
          loading={(index ?? 0) < 4 ? 'eager' : 'lazy'}
          fetchPriority={(index ?? 0) < 4 ? 'high' : 'auto'}
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badge – top left */}
        <div className="absolute top-2 left-2 z-10">
          {renderBadge()}
        </div>
      </div>

      {/* ── BOTTOM CONTAINER (DETAILS REPLACED BY BUTTON ON HOVER) ── */}
      <div className="relative overflow-hidden bg-white p-3 flex flex-col justify-between min-h-[85px] sm:min-h-[92px]">
        
        {/* Product Details (Fades out and slides slightly on hover) */}
        <div 
          className="transition-all duration-300 transform group-hover:-translate-y-2 group-hover:opacity-0 flex flex-col justify-between h-full"
          onClick={() => navigate(`/product/${product.slug}`)}
        >
          <div>
            <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-artisan-highlight block truncate">
              {getCategoryLabel()}
            </span>
            <h3 className="font-artisan-heading text-xs sm:text-sm font-semibold text-artisan-primary mt-0.5 line-clamp-1 leading-snug">
              {product.name}
            </h3>
          </div>
          
          <div className="flex flex-wrap items-baseline gap-1.5 mt-1.5">
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-gray-400 line-through text-[10px] sm:text-xs font-medium">
                Rs.{formatPrice(product.compareAtPrice)}
              </span>
            )}
            <span className="text-xs sm:text-sm font-bold text-artisan-primary">
              Rs.{formatPrice(product.price)}
            </span>
          </div>
        </div>

        {/* Add To Cart Button (Slides up and overlays on hover) */}
        <div className="absolute inset-0 flex items-center justify-center p-3 transition-all duration-300 transform translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100 bg-white">
          {product.stock > 0 ? (
            <button
              onClick={handleQuickAdd}
              className={`w-full py-2.5 font-bold text-[10px] sm:text-xs uppercase tracking-widest transition-all duration-200 border border-artisan-primary ${
                addedFlash
                  ? 'bg-green-500 text-white border-green-500'
                  : 'bg-artisan-primary text-white hover:bg-transparent hover:text-artisan-primary'
              }`}
            >
              {addedFlash ? '✓ Added!' : 'Add to cart'}
            </button>
          ) : (
            <button
              disabled
              className="w-full py-2.5 bg-gray-200 text-gray-500 font-bold text-[10px] sm:text-xs uppercase tracking-widest cursor-not-allowed"
            >
              Sold Out
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
