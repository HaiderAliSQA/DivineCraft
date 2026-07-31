import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCart } from '../hooks/useCart';
import toast from 'react-hot-toast';
import { usePlaceOrderMutation } from '../store/api/ordersApi';
import { formatPrice } from '../utils/formatPrice';

const pkPhoneRegex = /^(03|923|\+923)\d{9}$/;

const checkoutSchema = z.object({
  shopName: z.string().min(5, 'Complete Address is required (minimum 5 characters)'),
  ownerName: z.string().min(2, 'Customer Name is required (minimum 2 characters)'),
  phone: z.string().regex(pkPhoneRegex, 'Enter a valid Pakistani mobile number (e.g., 03001234567, +923001234567, or 923001234567)'),
  city: z.string().min(2, 'City is required'),
  paymentSchedule: z.enum(['weekly', 'monthly', 'immediate']),
  note: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items, subtotal, deliveryCharges, total, clearCart } = useCart();
  const [placeOrder, { isLoading, error, isSuccess }] = usePlaceOrderMutation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentSchedule: 'weekly',
      note: '',
    },
  });

  const totalQuantity = items.reduce((sum, item) => sum + Number(item.quantity), 0);
  const isSingleItem = totalQuantity === 1;

  useEffect(() => {
    if (items.length === 0 && !isSuccess) {
      navigate('/');
    }
  }, [items, navigate, isSuccess]);

  useEffect(() => {
    if (isSingleItem) {
      setValue('paymentSchedule', 'immediate');
    } else {
      setValue('paymentSchedule', 'weekly');
    }
  }, [isSingleItem, setValue]);

  const onSubmit = async (data: CheckoutFormValues) => {
    try {
      const orderPayload = {
        shopName: data.shopName.trim(),
        ownerName: data.ownerName.trim(),
        phone: data.phone.trim(),
        city: data.city.trim(),
        paymentSchedule: data.paymentSchedule,
        note: data.note?.trim() || '',
        items: items.map((item) => ({
          productId: item.productId,
          quantity: Number(item.quantity),
          color: item.color,
          size: item.size,
        })),
      };

      const result = await placeOrder(orderPayload).unwrap();

      if (result.success && result.data?.order) {
        clearCart(); // Clean cart state upon successful placement
        navigate(`/order-confirmation/${result.data.order.orderId}`);
      }
    } catch (err: any) {
      console.error('Failed to place B2B wholesale order:', err);
      const msg = err?.data?.message || err?.message || 'Failed to place B2B wholesale order';
      toast.error(`⚠️ ${msg}`);
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-artisan-text pt-24 md:pt-32 pb-20 font-artisan-body selection:bg-artisan-primary selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Progress Stepper / Header */}
        <div className="flex flex-col items-center mb-12 md:mb-16 animate-fade-in">
          <h1 className="font-artisan-heading text-artisan-primary text-4xl md:text-5xl font-normal tracking-wide mb-4 text-center">
            Wholesale Checkout
          </h1>
          <div className="w-16 h-0.5 bg-artisan-primary/20 mb-4"></div>
          <p className="text-artisan-subtle text-[10px] font-bold uppercase tracking-[0.25em] text-center max-w-md bg-white px-4 py-2 border border-artisan-subtle/10 rounded-full shadow-sm">
            ⚡ Guest Checkout • No Password Required
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 items-start">

          {/* Left Panel: B2B Checkout Form */}
          <div className="w-full lg:w-[60%] space-y-8 animate-fade-up">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

              {/* Section 1: Customer & Delivery Details */}
              <div className="bg-white border border-artisan-subtle/10 rounded-2xl p-8 md:p-10 space-y-8 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-5 border-b border-artisan-subtle/10 pb-6">
                  <span className="w-12 h-12 rounded-full bg-gradient-to-br from-artisan-primary to-artisan-primary/80 text-white flex items-center justify-center font-artisan-heading text-lg font-bold shadow-md shadow-artisan-primary/20 ring-4 ring-artisan-primary/10">1</span>
                  <div>
                    <h2 className="text-base font-artisan-heading font-bold text-artisan-primary uppercase tracking-wider">Customer & Delivery Details</h2>
                    <p className="text-[10px] text-artisan-subtle font-medium uppercase tracking-wide mt-0.5">Please provide your delivery and contact details</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Customer Name */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-artisan-primary uppercase tracking-widest ml-1 block">Customer Name</label>
                    <input
                      {...register('ownerName', {
                        onChange: (e) => {
                          e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                        }
                      })}
                      placeholder="e.g. Customer Name"
                      maxLength={50}
                      className="w-full bg-[#FAF8F5] border border-artisan-subtle/20 px-5 py-4 rounded-xl text-artisan-text font-artisan-body text-sm focus:outline-none focus:border-artisan-primary focus:ring-4 focus:ring-artisan-primary/10 transition-all placeholder:text-artisan-subtle/40 hover:border-artisan-subtle/45"
                    />
                    {errors.ownerName && <p className="text-artisan-highlight text-[10px] mt-1 font-bold uppercase tracking-wider">{errors.ownerName.message}</p>}
                  </div>

                  {/* Contact Number */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-artisan-primary uppercase tracking-widest ml-1 block">Contact Number</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base select-none pointer-events-none">🇵🇰</span>
                      <input
                        {...register('phone', {
                          onChange: (e) => {
                            let val = e.target.value;
                            
                            // 1. Keep only digits and a single leading '+' at index 0
                            val = val.replace(/(?!^\+)[^\d]/g, '');

                            // 2. Validate against partial pattern
                            const partialPattern = /^(\+|\+9|\+92|\+923\d*|9|92|923\d*|0|03\d*)$/;
                            if (val.length > 0 && !partialPattern.test(val)) {
                              val = val.slice(0, -1);
                            }

                            // 3. Apply maximum length logic dynamically
                            if (val.startsWith('+923')) {
                              val = val.slice(0, 13);
                            } else if (val.startsWith('923')) {
                              val = val.slice(0, 12);
                            } else if (val.startsWith('03')) {
                              val = val.slice(0, 11);
                            } else {
                              val = val.slice(0, 13);
                            }

                            e.target.value = val;
                          }
                        })}
                        placeholder="e.g. 03001234567, +923001234567, 923001234567"
                        maxLength={13}
                        inputMode="tel"
                        className="w-full bg-[#FAF8F5] border border-artisan-subtle/20 pl-11 pr-5 py-4 rounded-xl text-artisan-text font-artisan-body text-sm focus:outline-none focus:border-artisan-primary focus:ring-4 focus:ring-artisan-primary/10 transition-all placeholder:text-artisan-subtle/40 hover:border-artisan-subtle/45"
                      />
                    </div>
                    {errors.phone && <p className="text-artisan-highlight text-[10px] mt-1 font-bold uppercase tracking-wider">{errors.phone.message}</p>}
                  </div>

                  {/* Complete Address */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-bold text-artisan-primary uppercase tracking-widest ml-1 block">Complete Address</label>
                    <input
                      {...register('shopName')}
                      placeholder="e.g. Street No. 3, House No. 45, Sector G-11, Islamabad"
                      maxLength={150}
                      className="w-full bg-[#FAF8F5] border border-artisan-subtle/20 px-5 py-4 rounded-xl text-artisan-text font-artisan-body text-sm focus:outline-none focus:border-artisan-primary focus:ring-4 focus:ring-artisan-primary/10 transition-all placeholder:text-artisan-subtle/40 hover:border-artisan-subtle/45"
                    />
                    {errors.shopName && <p className="text-artisan-highlight text-[10px] mt-1 font-bold uppercase tracking-wider">{errors.shopName.message}</p>}
                  </div>

                  {/* City */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-bold text-artisan-primary uppercase tracking-widest ml-1 block">City</label>
                    <input
                      {...register('city', {
                        onChange: (e) => {
                          e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                        }
                      })}
                      placeholder="e.g. Islamabad"
                      maxLength={50}
                      className="w-full bg-[#FAF8F5] border border-artisan-subtle/20 px-5 py-4 rounded-xl text-artisan-text font-artisan-body text-sm focus:outline-none focus:border-artisan-primary focus:ring-4 focus:ring-artisan-primary/10 transition-all placeholder:text-artisan-subtle/40 hover:border-artisan-subtle/45"
                    />
                    {errors.city && <p className="text-artisan-highlight text-[10px] mt-1 font-bold uppercase tracking-wider">{errors.city.message}</p>}
                  </div>
                </div>
              </div>

              {/* Section 2: Ledger Payment Schedule & Notes */}
              <div className="bg-white border border-artisan-subtle/10 rounded-2xl p-8 md:p-10 space-y-8 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-5 border-b border-artisan-subtle/10 pb-6">
                  <span className="w-12 h-12 rounded-full bg-gradient-to-br from-artisan-primary to-artisan-primary/80 text-white flex items-center justify-center font-artisan-heading text-lg font-bold shadow-md shadow-artisan-primary/20 ring-4 ring-artisan-primary/10">2</span>
                  <div>
                    <h2 className="text-base font-artisan-heading font-bold text-artisan-primary uppercase tracking-wider">Ledger / بہی کھاتہ Schedule</h2>
                    <p className="text-[10px] text-artisan-subtle font-medium uppercase tracking-wide mt-0.5">Select how you want to manage payments for this order</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Payment Schedule Selector */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-artisan-primary uppercase tracking-widest ml-1 block">Payment Schedule</label>
                    <div className={`grid gap-4 ${isSingleItem ? 'grid-cols-1 max-w-xs' : 'grid-cols-1 md:grid-cols-3'}`}>
                      {[
                        { id: 'weekly', title: 'Weekly', desc: 'Pay every week', icon: '📅' },
                        { id: 'monthly', title: 'Monthly', desc: 'Pay every month', icon: '🗓️' },
                        { id: 'immediate', title: 'COD', desc: 'Pay on delivery', icon: '💵' }
                      ].filter(item => !isSingleItem || item.id === 'immediate').map((item) => (
                        <label
                          key={item.id}
                          className="relative flex flex-col p-5 rounded-xl border transition-all duration-300 cursor-pointer border-artisan-subtle/15 bg-[#FAF8F5] hover:border-artisan-primary/30 hover:shadow-sm has-[:checked]:border-artisan-primary has-[:checked]:bg-artisan-primary/5 has-[:checked]:shadow-inner"
                        >
                          <input
                            type="radio"
                            value={item.id}
                            {...register('paymentSchedule')}
                            className="absolute top-5 right-5 accent-artisan-primary w-4 h-4 cursor-pointer"
                          />
                          <span className="text-lg mb-2">{item.icon}</span>
                          <span className="text-xs font-extrabold text-artisan-primary uppercase tracking-wider block mb-1">{item.title}</span>
                          <span className="text-[9px] text-artisan-subtle font-bold uppercase tracking-wider">{item.desc}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Special Instructions */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-artisan-primary uppercase tracking-widest ml-1 block">Special Instructions / Order Notes (Optional)</label>
                    <textarea
                      {...register('note')}
                      rows={3}
                      placeholder="e.g. Please pack safely, or request specific colors/items..."
                      className="w-full bg-[#FAF8F5] border border-artisan-subtle/20 px-5 py-4 rounded-xl text-artisan-text font-artisan-body text-sm focus:outline-none focus:border-artisan-primary focus:ring-4 focus:ring-artisan-primary/10 transition-all placeholder:text-artisan-subtle/40 resize-none hover:border-artisan-subtle/45"
                    />
                  </div>
                </div>
              </div>

              {/* Error Summary Banner */}
              {error && (
                <div className="p-5 bg-artisan-highlight/10 text-artisan-highlight text-[10px] font-bold uppercase tracking-wider rounded-xl border border-artisan-highlight/20 flex items-center gap-4 animate-fade-in">
                  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{(error as any)?.data?.message || 'Failed to place B2B wholesale order. Please verify details.'}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-artisan-primary text-white py-5 rounded-xl text-xs font-bold uppercase tracking-[0.25em] transition-all duration-300 hover:bg-artisan-highlight hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 flex justify-center items-center gap-4 cursor-pointer shadow-md hover:shadow-lg active:scale-[0.99]"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>Submit Order • Rs. {formatPrice(total)}</>
                )}
              </button>
            </form>
          </div>

          {/* Right Panel: Order Summary */}
          <div className="w-full lg:w-[40%] bg-white p-8 md:p-10 rounded-2xl border border-artisan-subtle/10 space-y-8 lg:sticky lg:top-32 shadow-sm hover:shadow-md transition-all duration-300">
            <h2 className="font-artisan-heading text-lg font-bold text-artisan-primary uppercase tracking-wider border-b border-artisan-subtle/10 pb-4">
              Order Items
            </h2>

            <div className="space-y-6 max-h-[350px] overflow-y-auto pr-2 no-scrollbar">
              {items.map((item) => (
                <div key={`${item.productId}-${item.color || 'nocolor'}-${item.size || 'nosize'}`} className="flex gap-4 group">
                  <div className="relative shrink-0">
                    <div className="w-14 h-14 bg-[#FAF8F5] rounded-xl border border-artisan-subtle/10 p-1.5 flex items-center justify-center group-hover:border-artisan-primary transition-colors duration-300">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110" />
                    </div>
                    <span className="absolute -top-1.5 -right-1.5 bg-artisan-highlight text-white font-artisan-body text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <h3 className="text-[11px] text-artisan-primary font-bold uppercase tracking-wide leading-tight group-hover:text-artisan-highlight transition-colors duration-350">{item.name}</h3>
                    {item.color && <p className="text-[8px] font-extrabold text-artisan-subtle uppercase tracking-widest">{item.color}</p>}
                    <p className="text-xs font-bold text-artisan-highlight mt-1">Rs. {formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-6 border-t border-artisan-subtle/10">
              <div className="flex justify-between items-center text-[10px] font-bold text-artisan-subtle tracking-wider uppercase">
                <span>Cart Subtotal</span>
                <span className="text-artisan-primary text-xs font-bold">Rs. {formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-bold text-artisan-subtle tracking-wider uppercase">
                <span>Shipping Fee</span>
                <span className={deliveryCharges === 0 ? "text-emerald-600 text-xs font-bold uppercase" : "text-artisan-primary text-xs font-bold"}>
                  {deliveryCharges === 0 ? 'FREE' : `Rs. ${formatPrice(deliveryCharges)}`}
                </span>
              </div>

              <div className="pt-6 flex justify-between items-end border-t border-artisan-subtle/10">
                <span className="font-artisan-heading text-artisan-primary text-xs font-bold uppercase tracking-wider">Estimated Total</span>
                <div className="text-right">
                  <span className="text-artisan-highlight font-bold text-2xl block leading-none tracking-tight">Rs. {formatPrice(total)}</span>
                  <span className="text-artisan-subtle text-[8px] font-bold uppercase tracking-[0.2em] block mt-2 text-right">No Hidden Costs</span>
                </div>
              </div>
            </div>

            <div className="p-5 bg-[#FAF8F5] rounded-xl border border-artisan-subtle/10 flex flex-col items-center gap-3 text-center">
              <div className="flex gap-4 text-xl">
                <span>🛡️</span>
                <span>🚚</span>
                <span>🤝</span>
              </div>
              <p className="text-[9px] font-bold text-artisan-subtle uppercase tracking-widest leading-relaxed">
                FH Wholesale Network Pakistan • Delivery via TCS Courier Service
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
