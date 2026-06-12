import React from 'react';

const StatsBar: React.FC = () => {
  const stats = [
    { value: '2,000+', label: 'Unique Products' },
    { value: '5,000+', label: 'Happy Customers' },
    { value: 'Fast TCS', label: 'Nationwide Shipping' },
    { value: 'COD', label: 'Available' },
  ];

  return (
    <section className="bg-[#FAF0E6] border-y border-artisan-subtle/10 py-10 relative z-10">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-artisan-subtle/20">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center justify-center text-center p-2 first:pt-0 md:first:pt-2">
              <span className="font-artisan-heading text-3xl md:text-4xl lg:text-5xl font-bold text-artisan-primary">
                {stat.value}
              </span>
              <span className="font-artisan-body text-[10px] md:text-[11px] font-bold text-artisan-subtle uppercase tracking-widest mt-2">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsBar;
