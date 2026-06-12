// frontend/src/components/ui/CartDrawer.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';

const CartDrawer: React.FC = () => {
  const { 
    isOpen, 
    closeCart, 
    items, 
    count, 
    subtotal, 
    deliveryCharges, 
    total, 
    updateQuantity, 
    removeFromCart 
  } = useCart();
  
  const navigate = useNavigate();

  // Close cart on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  const freeShippingThreshold = 3000;
  const neededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPct = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleWhatsAppCheckout = () => {
    let msg = `Hi DivineCraft!\nI want to order:\n`;
    items.forEach((item) => {
      msg += `- ${item.name} x${item.quantity} = Rs. ${(item.price * item.quantity).toLocaleString()}\n`;
    });
    msg += `\nTotal: Rs. ${total.toLocaleString()}\nPlease confirm my order.`;
    window.open(`https://wa.me/923007709173?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end overflow-hidden font-artisan-body">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px] animate-fadeIn"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-[440px] h-full bg-artisan-card shadow-2xl flex flex-col animate-slideCartIn border-l border-artisan-subtle/15">
        
        {/* Warm Brown Header */}
        <div className="flex items-center justify-between p-6 bg-artisan-primary text-white shrink-0">
          <div className="flex flex-col gap-0.5">
            <h2 className="font-artisan-heading text-lg font-bold tracking-widest uppercase">Shopping Bag</h2>
            <p className="text-[9px] tracking-[0.2em] opacity-80 uppercase font-bold">
              {count} {count === 1 ? 'ITEM' : 'ITEMS'}
            </p>
          </div>
          <button 
            onClick={closeCart}
            className="flex items-center gap-1.5 px-4 py-2 border border-white/20 hover:bg-white/10 text-white rounded-none text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer"
          >
            <span>Close</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto w-full px-6 py-4 bg-artisan-bg/50">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-6">
              <div className="w-16 h-16 bg-artisan-bg rounded-full flex items-center justify-center text-2xl">
                👜
              </div>
              <div>
                <h3 className="font-artisan-heading text-lg text-artisan-primary font-bold mb-2">Your bag is empty</h3>
                <p className="text-[12px] text-artisan-subtle max-w-xs leading-relaxed">
                  Browse our studio collections to bring soul into your space today.
                </p>
              </div>
              <button 
                onClick={() => { closeCart(); navigate('/products'); }} 
                className="bg-artisan-primary text-white px-8 py-3.5 text-[10px] uppercase font-bold tracking-widest hover:bg-artisan-highlight transition-all rounded-none cursor-pointer"
              >
                EXPLORE COLLECTION
              </button>
            </div>
          ) : (
            <div className="flex flex-col w-full divide-y divide-artisan-subtle/10">
              {items.map((item) => (
                <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-4 py-4 group items-center">
                  
                  {/* Item Image */}
                  <div className="w-16 h-16 bg-white p-2 shrink-0 border border-artisan-subtle/10 rounded-none flex items-center justify-center">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 min-w-0 flex flex-col gap-1">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-artisan-heading text-sm text-artisan-primary font-medium leading-snug tracking-wide group-hover:text-artisan-highlight transition-colors line-clamp-2 min-h-[2.2rem]">
                        {item.name}
                      </h4>
                      <button 
                        onClick={() => removeFromCart(item.productId, item.size, item.color)}
                        className="text-artisan-subtle/60 hover:text-red-500 transition-all hover:scale-105 shrink-0 p-1 cursor-pointer"
                        title="Remove Item"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-4 mt-1">
                      {/* Quantity Controls */}
                      <div className="flex items-center bg-white border border-artisan-subtle/20 h-7 shrink-0">
                        <button 
                          className="w-7 h-full flex items-center justify-center text-artisan-subtle hover:bg-artisan-bg transition-colors font-bold text-xs cursor-pointer"
                          onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                        >
                          −
                        </button>
                        <span className="px-2 text-[11px] font-bold text-artisan-primary min-w-[20px] text-center border-x border-artisan-subtle/10">
                          {item.quantity}
                        </span>
                        <button 
                          className="w-7 h-full flex items-center justify-center text-artisan-subtle hover:bg-artisan-bg transition-colors font-bold text-xs cursor-pointer"
                          onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>

                      <div className="flex flex-col items-end shrink-0">
                        <span className="font-artisan-body text-xs text-artisan-highlight font-bold">
                          Rs. {(item.price * item.quantity).toLocaleString()}
                        </span>
                        <span className="text-[9px] text-artisan-subtle font-medium">
                          Rs. {item.price.toLocaleString()} each
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-5 bg-white border-t border-artisan-subtle/15 flex flex-col gap-4 shrink-0 shadow-md">
            
            {/* Free Delivery Progress Bar */}
            <div className="space-y-2">
              {neededForFreeShipping > 0 ? (
                <p className="text-[10px] text-artisan-subtle font-bold uppercase tracking-wider text-center">
                  Add <span className="text-artisan-highlight">Rs. {neededForFreeShipping.toLocaleString()}</span> more for free delivery!
                </p>
              ) : (
                <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider text-center">
                  🎉 You qualify for FREE DELIVERY!
                </p>
              )}
              <div className="w-full h-1.5 bg-artisan-bg rounded-full overflow-hidden">
                <div 
                  className="h-full bg-artisan-highlight transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            <div className="space-y-1 mt-1 text-[11px] font-artisan-body text-artisan-subtle">
              <div className="flex justify-between uppercase tracking-wider font-bold">
                <span>Subtotal</span>
                <span>Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between uppercase tracking-wider font-bold">
                <span>Delivery (TCS)</span>
                <span className={deliveryCharges === 0 ? "text-emerald-600 font-bold" : ""}>
                  {deliveryCharges === 0 ? "FREE" : `Rs. ${deliveryCharges.toLocaleString()}`}
                </span>
              </div>
            </div>
            
            <div className="h-px w-full bg-artisan-subtle/10 my-1"></div>
            
            <div className="flex justify-between items-baseline mb-2">
              <span className="font-artisan-heading text-xs font-bold text-artisan-primary tracking-wider uppercase">Estimated Total</span>
              <span className="font-artisan-heading text-lg font-bold text-artisan-primary">Rs. {total.toLocaleString()}</span>
            </div>

            <div className="flex flex-col gap-2">
              {/* WhatsApp Checkout Button */}
              <button 
                onClick={handleWhatsAppCheckout}
                className="w-full bg-[#25D366] hover:bg-[#20ba56] text-white font-artisan-body py-3.5 tracking-[0.15em] text-[10px] font-bold uppercase transition-all duration-300 flex justify-center items-center gap-2 rounded-none cursor-pointer shadow-sm"
              >
                <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.309 1.656zm6.29-4.143c1.552.92 3.136 1.407 4.793 1.408h.001c5.403 0 9.8-4.397 9.802-9.802 0-2.618-1.02-5.08-2.871-6.932-1.851-1.852-4.311-2.872-6.93-2.872-5.404 0-9.803 4.398-9.806 9.803 0 1.834.512 3.62 1.48 5.161l-.985 3.593 3.681-.966zm12.336-6.721c-.328-.164-1.94-.958-2.241-1.069-.301-.111-.52-.164-.739.164-.219.328-.848 1.069-1.039 1.288-.192.219-.383.246-.711.082s-1.39-.512-2.646-1.633c-.977-.872-1.637-1.95-1.828-2.278-.191-.328-.02-.506.143-.669.148-.146.328-.383.492-.574.164-.191.219-.328.328-.546.109-.219.055-.41-.027-.574-.082-.164-.739-1.777-1.012-2.433-.266-.639-.537-.552-.739-.562-.191-.009-.41-.011-.628-.011-.219 0-.575.082-.875.41-.3.328-1.147 1.12-1.147 2.733 0 1.612 1.174 3.167 1.338 3.386.164.219 2.311 3.529 5.597 4.945.782.337 1.391.538 1.867.689.785.249 1.498.214 2.062.13.629-.094 1.94-.793 2.214-1.559.274-.766.274-1.422.191-1.559-.082-.136-.3-.219-.628-.383z" />
                </svg>
                CHECKOUT VIA WHATSAPP
              </button>
              
              {/* Secondary Regular Checkout */}
              <button 
                onClick={() => { closeCart(); navigate('/checkout'); }}
                className="w-full bg-transparent border border-artisan-primary hover:bg-artisan-primary hover:text-white text-artisan-primary font-artisan-body py-3 tracking-[0.15em] text-[10px] font-bold uppercase transition-all duration-300 flex justify-center items-center gap-2 rounded-none cursor-pointer"
              >
                PROCEED TO CHECKOUT
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CartDrawer;
