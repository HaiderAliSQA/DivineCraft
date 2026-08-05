import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetProductBySlugQuery, useGetProductsQuery } from '../store/api/productsApi';
import { useCart } from '../hooks/useCart';
import ProductCard from '../components/ui/ProductCard';
import toast from 'react-hot-toast';

const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const { data, isLoading, isError } = useGetProductBySlugQuery(slug || '');
  const product = data?.data;

  const { data: relatedData } = useGetProductsQuery(
    { category: product?.category, limit: 4 },
    { skip: !product }
  );
  
  const relatedProducts = (relatedData?.data?.products || []).filter(p => p._id !== product?._id).slice(0, 4);

  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isDescHovered, setIsDescHovered] = useState(false);
  const [isDescClicked, setIsDescClicked] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);

  const handlePrevImage = () => {
    if (!product?.images) return;
    setMainImageIndex(prev => (prev - 1 + product.images.length) % product.images.length);
  };

  const handleNextImage = () => {
    if (!product?.images) return;
    setMainImageIndex(prev => (prev + 1) % product.images.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!product?.images || product.images.length <= 1) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (diff > 50) {
      handleNextImage();
    }
    if (diff < -50) {
      handlePrevImage();
    }
  };

  // Reset quantity and main image index when slug changes to avoid state carryover
  React.useEffect(() => {
    setQuantity(1);
    setMainImageIndex(0);
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-navy-dark flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-electric/20 border-t-electric rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen bg-navy-dark flex flex-col items-center justify-center p-4">
        <h2 className="font-heading text-3xl text-white mb-6">Product Not Found</h2>
        <button onClick={() => navigate('/products')} className="btn-electric px-8 py-3 font-bold uppercase tracking-widest text-sm">
          Back to Shop
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      productId: product._id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      quantity,
      image: product.images[0] || '',
    });
    toast.success('Added to cart');
  };

  const discount = product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-navy-dark text-white pt-10 sm:pt-14 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center flex-wrap gap-2 font-body text-[12px] sm:text-[13px] text-gray-400 tracking-wider uppercase mb-6 sm:mb-8 font-medium">
          <button onClick={() => navigate('/')} className="hover:text-electric transition-colors font-semibold">Home</button>
          <span className="text-gray-600 font-bold">/</span>
          <button onClick={() => navigate('/products')} className="hover:text-electric transition-colors font-semibold">Collection</button>
          <span className="text-gray-600 font-bold">/</span>
          <span className="text-white font-semibold">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Gallery */}
          <div className="lg:col-span-7 flex flex-col md:flex-row gap-4 items-start">
            {/* Thumbnails */}
            <div className="flex flex-row md:flex-col gap-3 order-2 md:order-1 overflow-x-auto no-scrollbar md:h-[500px]">
              {product.images.map((img: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setMainImageIndex(i)}
                  className={`shrink-0 w-20 aspect-square bg-navy-mid border-2 rounded-xl transition-all overflow-hidden ${mainImageIndex === i ? 'border-electric shadow-glow-blue/20' : 'border-white/5 opacity-50 hover:opacity-80'}`}
                >
                  <img src={img} alt={`Thumb ${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Main Image with Touch Swipe and Navigation Arrows */}
            <div 
              className="flex-1 order-1 md:order-2 relative aspect-[4/5] bg-navy-mid rounded-3xl border border-white/5 overflow-hidden group select-none"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {discount > 0 && (
                <div className="absolute top-6 right-6 bg-red-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-xl z-10 animate-pulse-glow">
                  SAVE {discount}%
                </div>
              )}
              <img 
                src={product.images[mainImageIndex]} 
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                draggable="false"
              />

              {/* Navigation Arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    type="button"
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 hover:bg-black/60 flex items-center justify-center text-white transition-all active:scale-90 shadow-md z-10 opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
                    aria-label="Previous image"
                  >
                    <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <button
                    onClick={handleNextImage}
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 hover:bg-black/60 flex items-center justify-center text-white transition-all active:scale-90 shadow-md z-10 opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
                    aria-label="Next image"
                  >
                    <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-5 flex flex-col space-y-8">
            <div className="space-y-4">
              <span className="inline-block px-3 py-1 rounded-md bg-electric/10 text-electric text-[10px] font-bold uppercase tracking-[0.2em] border border-electric/20">
                Premium Mobile Tech
              </span>
              <h1 className="font-heading text-3xl md:text-5xl font-extrabold text-white leading-tight break-words">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4">
                <span className="text-3xl md:text-4xl text-electric font-bold tracking-tight">
                  PKR {product.price.toLocaleString()}
                </span>
                {discount > 0 && (
                  <span className="text-lg text-gray-500 line-through">
                    PKR {product.compareAtPrice?.toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-white/5">
              <div 
                className="relative transition-all duration-300"
                onMouseEnter={() => setIsDescHovered(true)}
                onMouseLeave={() => setIsDescHovered(false)}
              >
                {product.description.length > 250 ? (
                  <div>
                    <p className="text-gray-400 text-base leading-relaxed inline">
                      {isDescClicked || isDescHovered 
                        ? product.description 
                        : `${product.description.slice(0, 250)}... `}
                    </p>
                    {!isDescHovered && !isDescClicked && (
                      <button 
                        onClick={() => setIsDescClicked(true)}
                        className="text-electric hover:underline text-xs font-bold uppercase tracking-wider ml-1 cursor-pointer inline-block"
                      >
                        read more
                      </button>
                    )}
                    {isDescClicked && (
                      <button 
                        onClick={() => setIsDescClicked(false)}
                        className="text-electric hover:underline text-xs font-bold uppercase tracking-wider ml-2 cursor-pointer inline-block"
                      >
                        read less
                      </button>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-400 text-base leading-relaxed">
                    {product.description}
                  </p>
                )}
              </div>

              {/* Compatible Models Badge */}
              {product.compatibleModels && product.compatibleModels.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.compatibleModels.map((model: string) => (
                    <span key={model} className="bg-navy-mid border border-white/10 px-3 py-1 rounded-full text-[10px] font-bold text-gray-300">
                      {model}
                    </span>
                  ))}
                </div>
              )}

              {/* Conditional Rendering based on Stock */}
              {product.stock > 0 ? (
                <>
                  {/* Quantity */}
                  <div className="flex items-center gap-6">
                    <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">Quantity</span>
                    <div className="flex items-center h-12 bg-navy-mid border border-white/5 rounded-xl overflow-hidden w-32">
                      <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="flex-1 hover:bg-navy-mid/5 transition-colors text-xl">-</button>
                      <span className="flex-1 text-center font-bold">{quantity}</span>
                      <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} className="flex-1 hover:bg-navy-mid/5 transition-colors text-xl">+</button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-4">
                    <button 
                      onClick={handleAddToCart}
                      className="w-full h-16 bg-electric text-white font-bold uppercase tracking-widest rounded-2xl transition-all hover:shadow-glow-blue active:scale-95"
                    >
                      Add to Cart
                    </button>
                    <button 
                      onClick={() => { handleAddToCart(); navigate('/checkout'); }}
                      className="w-full h-16 bg-gold text-navy-dark font-bold uppercase tracking-widest rounded-2xl transition-all hover:bg-blue-400 active:scale-95 flex items-center justify-center gap-3 animate-pulse-glow"
                    >
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                      Buy It Now
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-4 mt-4">
                  <div className="w-full h-16 flex items-center justify-center bg-gray-800/50 text-gray-400 font-bold uppercase tracking-widest rounded-2xl border border-gray-700/50 cursor-not-allowed">
                    Out of Stock
                  </div>
                </div>
              )}
            </div>

            {/* Trust Markers */}
            <div className="grid grid-cols-2 gap-4 pt-8 border-t border-white/5">
              {[
                { label: 'Nationwide Delivery', icon: '🚚' },
                { label: 'Genuine Products', icon: '✅' },
                { label: '7-Day Return', icon: '🔄' },
                { label: 'Secure Checkout', icon: '🛡️' }
              ].map((m, i) => (
                <div key={i} className="flex items-center gap-3 text-xs font-bold text-gray-400">
                  <span className="text-xl">{m.icon}</span>
                  {m.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-32">
            <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-white mb-10 uppercase text-center tracking-tight">
              You May Also <span className="text-electric">Like</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {relatedProducts.map((p: any) => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductDetail;
