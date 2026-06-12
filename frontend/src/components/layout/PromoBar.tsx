import React from 'react';

const PromoBar: React.FC = () => {
  const promoText = "✦ Bring Soul Into Your Space — Free Delivery on orders above Rs. 3,000 ✦";
  
  return (
    <div className="bg-artisan-highlight text-white text-[10px] md:text-[11px] font-artisan-body font-bold py-2.5 overflow-hidden relative z-[60] tracking-[0.15em] uppercase select-none">
      <div className="animate-marquee whitespace-nowrap flex items-center">
        {/* Repeat text multiple times to ensure seamless looping */}
        {Array.from({ length: 6 }).map((_, idx) => (
          <span key={idx} className="mx-12 shrink-0">
            {promoText}
          </span>
        ))}
      </div>
    </div>
  );
};

export default PromoBar;
