import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCart } from '../hooks/useCart';
import toast from 'react-hot-toast';
import { usePlaceOrderMutation } from '../store/api/ordersApi';
import { formatPrice } from '../utils/formatPrice';

const pkPhoneRegex = /^03\d{9}$/;

const checkoutSchema = z.object({
  shopName: z.string().min(2, 'Shop Name is required (minimum 2 characters)'),
  ownerName: z.string().min(2, 'Owner/Contact Name is required (minimum 2 characters)'),
  phone: z.string().regex(pkPhoneRegex, 'Number must start with 03 and be exactly 11 digits (e.g., 03001234567)'),
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
    <div className="min-h-screen bg-artisan-bg text-artisan-text pt-24 md:pt-32 pb-20 font-artisan-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Progress Stepper */}
        <div className="flex flex-col items-center mb-12 md:mb-16">
          <h1 className="font-artisan-heading text-artisan-primary text-3xl md:text-5xl font-normal tracking-wide mb-4">
            Wholesale Checkout
          </h1>
          <p className="text-artisan-subtle text-[10px] font-bold uppercase tracking-[0.25em] text-center max-w-md">
            Guest Checkout • No password required
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 items-start">

          {/* Left Panel: B2B Checkout Form */}
          <div className="w-full lg:w-[60%] space-y-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

              {/* Section 1: Shop & Contact Info */}
              <div className="bg-artisan-card border border-artisan-subtle/10 rounded-none p-8 md:p-12 space-y-8 shadow-sm">
                <div className="flex items-center gap-5">
                  <span className="w-10 h-10 rounded-none bg-artisan-bg text-artisan-primary flex items-center justify-center font-artisan-heading text-lg font-bold border border-artisan-subtle/10">1</span>
                  <h2 className="text-lg font-artisan-heading font-bold text-artisan-primary uppercase tracking-wider">Shop & Contact Details</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Shop Name */}
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold text-artisan-subtle uppercase tracking-widest ml-1">Shop Name</label>
                    <input
                      {...register('shopName')}
                      placeholder="e.g. Al-Rehman Mobile Store"
                      maxLength={80}
                      className="w-full bg-artisan-bg border border-artisan-subtle/20 px-5 py-4 rounded-none text-artisan-text font-artisan-body text-sm focus:outline-none focus:border-artisan-primary transition-all placeholder:text-artisan-subtle/50"
                    />
                    {errors.shopName && <p className="text-artisan-highlight text-[10px] mt-1 font-bold uppercase tracking-wider">{errors.shopName.message}</p>}
                  </div>

                  {/* Owner Name */}
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold text-artisan-subtle uppercase tracking-widest ml-1">Owner / Contact Name</label>
                    <input
                      {...register('ownerName', {
                        onChange: (e) => {
                          e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                        }
                      })}
                      placeholder="e.g. Hafiz Huraira"
                      maxLength={50}
                      className="w-full bg-artisan-bg border border-artisan-subtle/20 px-5 py-4 rounded-none text-artisan-text font-artisan-body text-sm focus:outline-none focus:border-artisan-primary transition-all placeholder:text-artisan-subtle/50"
                    />
                    {errors.ownerName && <p className="text-artisan-highlight text-[10px] mt-1 font-bold uppercase tracking-wider">{errors.ownerName.message}</p>}
                  </div>

                  {/* Mobile Number */}
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold text-artisan-subtle uppercase tracking-widest ml-1">Mobile Number (Pakistani)</label>
                    <input
                      {...register('phone', {
                        onChange: (e) => {
                          let val = e.target.value.replace(/\D/g, '');
                          if (val.length > 0 && val[0] !== '0') {
                            val = '';
                          }
                          e.target.value = val;
                        }
                      })}
                      placeholder="e.g. 03001234567"
                      maxLength={11}
                      inputMode="numeric"
                      className="w-full bg-artisan-bg border border-artisan-subtle/20 px-5 py-4 rounded-none text-artisan-text font-artisan-body text-sm focus:outline-none focus:border-artisan-primary transition-all placeholder:text-artisan-subtle/50"
                    />
                    {errors.phone && <p className="text-artisan-highlight text-[10px] mt-1 font-bold uppercase tracking-wider">{errors.phone.message}</p>}
                  </div>

                  {/* City */}
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold text-artisan-subtle uppercase tracking-widest ml-1">City / Region</label>
                    <input
                      {...register('city', {
                        onChange: (e) => {
                          e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                        }
                      })}
                      placeholder="e.g. Chiniot"
                      maxLength={50}
                      className="w-full bg-artisan-bg border border-artisan-subtle/20 px-5 py-4 rounded-none text-artisan-text font-artisan-body text-sm focus:outline-none focus:border-artisan-primary transition-all placeholder:text-artisan-subtle/50"
                    />
                    {errors.city && <p className="text-artisan-highlight text-[10px] mt-1 font-bold uppercase tracking-wider">{errors.city.message}</p>}
                  </div>
                </div>
              </div>

              {/* Section 2: Ledger Payment Schedule & Notes */}
              <div className="bg-artisan-card border border-artisan-subtle/10 rounded-none p-8 md:p-12 space-y-8 shadow-sm">
                <div className="flex items-center gap-5">
                  <span className="w-10 h-10 rounded-none bg-artisan-bg text-artisan-primary flex items-center justify-center font-artisan-heading text-lg font-bold border border-artisan-subtle/10">2</span>
                  <h2 className="text-lg font-artisan-heading font-bold text-artisan-primary uppercase tracking-wider">Ledger / بہی کھاتہ Schedule</h2>
                </div>

                <div className="space-y-6">
                  {/* Payment Schedule Selector */}
                  <div className="space-y-3">
                    <label className="text-[9px] font-bold text-artisan-subtle uppercase tracking-widest ml-1">Payment Schedule</label>
                    <div className={`grid gap-4 ${isSingleItem ? 'grid-cols-1 max-w-xs' : 'grid-cols-3'}`}>
                      {[
                        { id: 'weekly', title: 'Weekly', desc: 'Pay every week' },
                        { id: 'monthly', title: 'Monthly', desc: 'Pay every month' },
                        { id: 'immediate', title: 'COD', desc: 'Pay on delivery' }
                      ].filter(item => !isSingleItem || item.id === 'immediate').map((item) => (
                        <label
                          key={item.id}
                          className="relative flex flex-col p-4 rounded-none border transition-all cursor-pointer border-artisan-subtle/15 bg-artisan-bg hover:border-artisan-primary/30 has-[:checked]:border-artisan-primary has-[:checked]:bg-artisan-primary/5"
                        >
                          <input
                            type="radio"
                            value={item.id}
                            {...register('paymentSchedule')}
                            className="absolute top-4 right-4 accent-artisan-primary"
                          />
                          <span className="text-xs font-bold text-artisan-primary uppercase tracking-wider block mb-1">{item.title}</span>
                          <span className="text-[9px] text-artisan-subtle font-medium uppercase">{item.desc}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Special Instructions */}
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold text-artisan-subtle uppercase tracking-widest ml-1">Special Instructions / Order Notes (Optional)</label>
                    <textarea
                      {...register('note')}
                      rows={3}
                      placeholder="e.g. Please pack safely, or request specific colors/items..."
                      className="w-full bg-artisan-bg border border-artisan-subtle/20 px-5 py-4 rounded-none text-artisan-text font-artisan-body text-sm focus:outline-none focus:border-artisan-primary transition-all placeholder:text-artisan-subtle/50 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Error Summary Banner */}
              {error && (
                <div className="p-6 bg-artisan-highlight/10 text-artisan-highlight text-xs font-bold uppercase tracking-widest rounded-none border border-artisan-highlight/20 flex items-center gap-4">
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
                className="w-full bg-artisan-primary text-white py-5 rounded-none text-xs font-bold uppercase tracking-[0.25em] transition-all duration-300 hover:bg-artisan-highlight active:scale-[0.99] disabled:opacity-50 flex justify-center items-center gap-4 cursor-pointer shadow-sm"
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
          <div className="w-full lg:w-[40%] bg-artisan-card p-10 rounded-none border border-artisan-subtle/10 space-y-8 sticky top-32 shadow-sm">
            <h2 className="font-artisan-heading text-lg font-bold text-artisan-primary uppercase tracking-wider border-b border-artisan-subtle/10 pb-4">
              Order Items
            </h2>

            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
              {items.map((item) => (
                <div key={`${item.productId}-${item.color || 'nocolor'}-${item.size || 'nosize'}`} className="flex gap-4 group">
                  <div className="relative shrink-0">
                    <div className="w-14 h-14 bg-artisan-bg rounded-none border border-artisan-subtle/10 p-1.5 flex items-center justify-center group-hover:border-artisan-primary transition-colors">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110" />
                    </div>
                    <span className="absolute -top-1 -right-1 bg-artisan-highlight text-white font-artisan-body text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-artisan-card">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <h3 className="text-[11px] text-artisan-primary font-bold uppercase tracking-wide leading-tight group-hover:text-artisan-highlight transition-colors">{item.name}</h3>
                    {item.color && <p className="text-[8px] font-extrabold text-artisan-subtle uppercase tracking-widest">{item.color}</p>}
                    <p className="text-xs font-bold text-artisan-highlight mt-1">Rs. {formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-6 border-t border-artisan-subtle/10">
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

            <div className="p-6 bg-artisan-bg rounded-none border border-artisan-subtle/10 flex flex-col items-center gap-3 text-center">
              <div className="flex gap-3 text-lg">
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
