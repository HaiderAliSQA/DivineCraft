import React from 'react';

const ReturnsExchanges: React.FC = () => {
  return (
    <div className="pt-28 pb-20 px-6 sm:px-10 lg:px-16 max-w-4xl mx-auto bg-artisan-bg font-artisan-body text-artisan-text">
      {/* Header */}
      <div className="text-center mb-12">
        <span className="text-[10px] font-bold text-artisan-highlight uppercase tracking-[0.25em]">RETURNS & REFUNDS</span>
        <h1 className="font-artisan-heading text-3xl md:text-5xl font-normal text-artisan-primary tracking-wide mt-2 mb-4">
          Returns & Exchanges
        </h1>
        <p className="text-artisan-subtle text-xs md:text-sm font-medium tracking-wide max-w-2xl mx-auto leading-relaxed">
          We want you to love your purchase. If you are not completely satisfied with your items, we make returns and exchanges easy.
        </p>
      </div>

      {/* Content Card */}
      <div className="bg-artisan-card border border-artisan-subtle/10 p-8 lg:p-12 shadow-sm">
        
        {/* The 7-Day Guarantee */}
        <h2 className="font-artisan-heading text-2xl text-artisan-primary font-bold mb-4 pb-4 border-b border-artisan-subtle/10">
          7-Day Easy Returns
        </h2>
        <p className="text-sm text-artisan-subtle leading-relaxed mb-8">
          We offer a **7-Day Return and Exchange policy**. If the product you receive is damaged, has quality issues, or does not match your expectations, you can request an exchange or refund within **7 days** of receiving your package.
        </p>

        {/* Required Conditions */}
        <h3 className="font-artisan-heading text-lg text-artisan-primary font-bold mb-4">
          Conditions for Returns
        </h3>
        <ul className="space-y-3.5 text-sm text-artisan-subtle list-none mb-8">
          <li className="flex items-start gap-3">
            <span className="text-artisan-highlight font-bold">✓</span>
            <span>The item must be unused, undamaged, and in the same condition as you received it.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-artisan-highlight font-bold">✓</span>
            <span>The item must be packed safely in its original packaging with all labels.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-artisan-highlight font-bold">✓</span>
            <span>You must show a screenshot of your digital receipt or order invoice.</span>
          </li>
        </ul>

        {/* Return Process Instructions */}
        <h3 className="font-artisan-heading text-lg text-artisan-primary font-bold mb-4">
          How to Return in 3 Easy Steps
        </h3>
        <div className="bg-artisan-bg border-l-2 border-artisan-highlight p-6 space-y-6">
          {/* Step 1 */}
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-artisan-card flex items-center justify-center font-artisan-heading font-bold text-artisan-highlight shrink-0 border border-artisan-subtle/20 shadow-sm text-sm">
              1
            </div>
            <div>
              <h4 className="font-artisan-body font-bold text-artisan-primary mb-1 uppercase text-xs tracking-wider">
                Send us a WhatsApp Message
              </h4>
              <p className="text-xs text-artisan-subtle leading-relaxed">
                Contact our customer support team on WhatsApp at **+92 300 7709173**. Share your Order ID and send a quick photo of the items.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-artisan-card flex items-center justify-center font-artisan-heading font-bold text-artisan-highlight shrink-0 border border-artisan-subtle/20 shadow-sm text-sm">
              2
            </div>
            <div>
              <h4 className="font-artisan-body font-bold text-artisan-primary mb-1 uppercase text-xs tracking-wider">
                Send the Package Back
              </h4>
              <p className="text-xs text-artisan-subtle leading-relaxed">
                Pack the items securely and send them back to our Chiniot warehouse using TCS or Leopard courier services.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-artisan-card flex items-center justify-center font-artisan-heading font-bold text-artisan-highlight shrink-0 border border-artisan-subtle/20 shadow-sm text-sm">
              3
            </div>
            <div>
              <h4 className="font-artisan-body font-bold text-artisan-primary mb-1 uppercase text-xs tracking-wider">
                Get Your Refund or Exchange
              </h4>
              <p className="text-xs text-artisan-subtle leading-relaxed">
                Once we receive and inspect your package, we will send your new replacement item or refund your money via Bank Transfer, JazzCash, or Easypaisa immediately.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ReturnsExchanges;
