// frontend/src/components/ui/ProductSkeleton.tsx
import React from 'react';

const ProductSkeleton: React.FC = () => {
  return (
    <div className="bg-navy-mid overflow-hidden flex flex-col h-full w-full max-w-[260px] mx-auto border border-navy-light/30">
      {/* Premium shimmer skeleton matching product card shape */}
      <div className="skeleton-shimmer aspect-square w-full" />
      
      <div className="p-4 md:p-5 flex flex-col flex-1 gap-2">
        {/* Category */}
        <div className="skeleton-shimmer h-[10px] w-1/4 rounded-sm" />
        
        {/* Title */}
        <div className="skeleton-shimmer h-[14px] w-3/4 rounded-sm mt-1" />
        
        {/* Price Row */}
        <div className="flex items-center gap-2 mt-1">
          <div className="skeleton-shimmer h-[16px] w-[60px] rounded-sm" />
          <div className="skeleton-shimmer h-[12px] w-[40px] rounded-sm" />
        </div>
        
        {/* Flex spacer to push buttons to the bottom */}
        <div className="flex-1 min-h-[16px]" />

        {/* Star row / Button Shimmer */}
        <div className="skeleton-shimmer h-10 w-full mt-auto rounded-none" />
      </div>
    </div>
  );
};

export default ProductSkeleton;
