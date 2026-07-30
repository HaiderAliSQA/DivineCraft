import React from 'react';

const ShippingPolicy: React.FC = () => {
  return (
    <div className="pt-28 pb-20 px-6 sm:px-10 lg:px-16 max-w-4xl mx-auto bg-artisan-bg font-artisan-body text-artisan-text">
      {/* Header */}
      <div className="text-center mb-12">
        <span className="text-[10px] font-bold text-artisan-highlight uppercase tracking-[0.25em]">DELIVERY DETAILS</span>
        <h1 className="font-artisan-heading text-3xl md:text-5xl font-normal text-artisan-primary tracking-wide mt-2 mb-4">
          Shipping Policy
        </h1>
        <p className="text-artisan-subtle text-xs md:text-sm font-medium tracking-wide max-w-2xl mx-auto leading-relaxed">
          We want to make sure your items arrive safely and quickly. Here is everything you need to know about our shipping.
        </p>
      </div>

      {/* Content Card */}
      <div className="bg-artisan-card border border-artisan-subtle/10 p-8 lg:p-12 space-y-10 shadow-sm">
        
        {/* Delivery Timelines */}
        <section className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-artisan-highlight text-xl">🚚</span>
            <h2 className="font-artisan-heading text-xl md:text-2xl text-artisan-primary font-bold">Delivery Time</h2>
          </div>
          <p className="text-sm text-artisan-subtle leading-relaxed pl-8">
            Your package will reach your doorstep within **3 to 5 working days** after you confirm your order. 
            During special holidays or huge sales, delivery might take a little longer.
          </p>
        </section>

        {/* Shipping Charges */}
        <section className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-artisan-highlight text-xl">💵</span>
            <h2 className="font-artisan-heading text-xl md:text-2xl text-artisan-primary font-bold">Delivery Charges</h2>
          </div>
          <p className="text-sm text-artisan-subtle leading-relaxed pl-8 mb-3">
            To make it simple, we charge a flat shipping fee of **Rs. 300** for all orders across Pakistan.
          </p>
          <div className="ml-8 p-4 bg-artisan-bg border-l-2 border-artisan-highlight text-xs text-artisan-subtle italic">
            "No hidden charges. The Rs. 300 fee covers secure packing and courier delivery for your entire order."
          </div>
        </section>

        {/* Couriers */}
        <section className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-artisan-highlight text-xl">📍</span>
            <h2 className="font-artisan-heading text-xl md:text-2xl text-artisan-primary font-bold">Courier Service</h2>
          </div>
          <p className="text-sm text-artisan-subtle leading-relaxed pl-8">
            We send all our packages through **TCS Courier** to ensure they are handled with care and delivered safely to your address.
          </p>
        </section>

        {/* Cash on Delivery */}
        <section className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-artisan-highlight text-xl">📦</span>
            <h2 className="font-artisan-heading text-xl md:text-2xl text-artisan-primary font-bold">Cash on Delivery (COD)</h2>
          </div>
          <p className="text-sm text-artisan-subtle leading-relaxed pl-8 mb-2">
            You can pay cash when the package is delivered. 
          </p>
          <ul className="ml-8 list-disc pl-5 text-xs text-artisan-subtle space-y-2">
            <li>Please pay the exact amount to the TCS rider before taking your package.</li>
            <li>Riders cannot allow you to open the parcel before payment due to courier rules.</li>
            <li>If you refuse to accept a confirmed order, you might not be allowed to choose Cash on Delivery for future purchases.</li>
          </ul>
        </section>

      </div>
    </div>
  );
};

export default ShippingPolicy;
