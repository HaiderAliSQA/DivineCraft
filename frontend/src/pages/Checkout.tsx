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



  useEffect(() => {
    if (items.length === 0 && !isSuccess) {
      navigate('/');
    }
  }, [items, navigate, isSuccess]);

  useEffect(() => {
    setValue('paymentSchedule', 'immediate');
  }, [setValue]);

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
    <div className="min-h-screen bg-[#FAF8F5] text-artisan-text pt-6 md:pt-8 pb-20 font-artisan-body selection:bg-artisan-primary selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col lg:flex-row gap-10 items-start">

          {/* Left Panel: B2B Checkout Form */}
          <div className="w-full lg:w-[60%] space-y-8 animate-fade-up">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

              {/* Section 1: Customer & Delivery Details */}
              <div className="bg-white border border-artisan-subtle/10 rounded-2xl p-8 md:p-10 space-y-8 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex flex-col items-center justify-center border-b border-artisan-subtle/10 pb-3 mb-2 text-center">
                  <h2 className="text-xl font-black uppercase tracking-wider animate-text-glow font-artisan-heading">Customer & Delivery Details</h2>
                  <p className="text-[12px] font-black uppercase tracking-wide mt-0.5 animate-text-glow">Please provide your delivery and contact details</p>
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

              {/* Section 2: Payment Schedule & Notes */}
              <div className="bg-white border border-artisan-subtle/10 rounded-2xl p-8 md:p-10 space-y-4 shadow-sm hover:shadow-md transition-all duration-300">
                 <div className="flex flex-col items-center justify-center border-b border-artisan-subtle/10 pb-3 mb-2">
                  <h2 className="text-xl font-black uppercase tracking-wider animate-text-glow font-artisan-heading text-center">Payment Schedule</h2>
                </div>

                <div className="flex flex-row gap-3 items-end">
                  {/* Special Instructions (First) */}
                  <div className="space-y-2 flex-1 min-w-0">
                    <label className="text-[10px] font-bold text-artisan-primary uppercase tracking-widest ml-1 block truncate">Special Instructions (Optional)</label>
                    <textarea
                      {...register('note')}
                      rows={2}
                      placeholder="e.g. Pack safely..."
                      className="w-full bg-[#FAF8F5] border border-artisan-subtle/20 px-3.5 py-3 rounded-xl text-artisan-text font-artisan-body text-xs focus:outline-none focus:border-artisan-primary focus:ring-4 focus:ring-artisan-primary/10 transition-all placeholder:text-artisan-subtle/40 resize-none hover:border-artisan-subtle/45 h-[96px]"
                    />
                  </div>

                  {/* Payment Schedule Selector (Second) */}
                  <div className="space-y-2 shrink-0 flex flex-col items-center">
                    <label className="text-[10px] font-bold text-artisan-primary uppercase tracking-widest block text-center">Method</label>
                    <label
                      className="relative flex flex-col items-center justify-center w-[96px] h-[96px] rounded-xl border transition-all duration-300 cursor-pointer border-artisan-primary bg-artisan-primary/5 shadow-sm p-2"
                    >
                      <input
                        type="radio"
                        value="immediate"
                        checked
                        readOnly
                        {...register('paymentSchedule')}
                        className="absolute top-2 right-2 accent-artisan-primary w-3.5 h-3.5 cursor-pointer"
                      />
                      <span className="text-2xl mb-1 leading-none">💵</span>
                      <span className="text-[11px] font-black text-artisan-primary uppercase tracking-wider leading-none">COD</span>
                      <span className="text-[7px] text-artisan-subtle font-extrabold uppercase tracking-wider text-center mt-1 leading-none">Pay on delivery</span>
                    </label>
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

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-artisan-primary text-white py-5 rounded-xl text-xs font-bold uppercase tracking-[0.25em] transition-all duration-300 hover:bg-artisan-highlight hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 flex justify-center items-center gap-4 cursor-pointer shadow-md hover:shadow-lg active:scale-[0.99] animate-submit-btn"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <span className="flex items-center gap-2">
                    <span>Submit Order</span>
                    <span className="bg-[#1E1210] text-[#E6C594] px-3 py-1 rounded-lg text-xs font-black tracking-normal animate-amount-glow inline-block shadow-sm">
                      Rs. {formatPrice(total)}
                    </span>
                  </span>
                )}
              </button>
            </form>
          </div>

          {/* Right Panel: Order Summary */}
          <div className="w-full lg:w-[40%] bg-[#FCFAF7] p-8 md:p-10 rounded-2xl border border-artisan-subtle/10 space-y-8 lg:sticky lg:top-32 shadow-sm hover:shadow-md transition-all duration-300">
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

              <div className="p-5 bg-[#1E1210] rounded-xl text-white flex justify-between items-center mt-6 shadow-md shadow-black/10">
                <span className="font-artisan-heading text-xs font-bold uppercase tracking-wider text-white/70">Estimated Total</span>
                <div className="text-right">
                  <span className="text-[#E6C594] font-black text-2xl block leading-none tracking-tight animate-amount-breathing">Rs. {formatPrice(total)}</span>
                  <span className="text-[8px] font-bold uppercase tracking-[0.2em] block mt-1.5 opacity-60">No Hidden Costs</span>
                </div>
              </div>
            </div>

            <div className="p-5 bg-white rounded-xl border border-artisan-subtle/10 flex flex-col items-center gap-3 text-center">
              <div className="flex gap-4 text-xl">
                <span>🛡️</span>
                <span>🚚</span>
                <span>🤝</span>
              </div>
              <p className="text-[9px] font-bold text-artisan-subtle uppercase tracking-widest leading-relaxed">
                FH Wholesale Pakistan • Delivery via TCS Courier Service
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
