import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetOrderByNumberQuery } from '../store/api/ordersApi';
import { formatPrice } from '../utils/formatPrice';

const OrderConfirmation: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();

  const { data: result, isLoading, isError } = useGetOrderByNumberQuery(orderNumber || '', {
    skip: !orderNumber,
    refetchOnMountOrArgChange: true
  });

  const order = result?.data;

  // Extract first name for personalized Urdu greeting
  const getFirstName = (fullName: string) => {
    if (!fullName) return 'CUSTOMER';
    const cleanName = fullName.trim().replace(/^(mr\.|ms\.|hafiz|muhammad|ch)\s+/i, '');
    const first = cleanName.split(' ')[0].toUpperCase();
    return first || 'CUSTOMER';
  };

  // Format creation date: e.g. 19 May 2026, 10:15 am
  const getFormattedDate = (createdAtStr: string) => {
    const d = createdAtStr ? new Date(createdAtStr) : new Date();
    return d.toLocaleDateString('en-PK', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }) + ', ' + d.toLocaleTimeString('en-PK', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).toLowerCase();
  };

  // Calculate dynamic TCS 2-day delivery window
  const getEstimatedDelivery = (createdAtStr: string) => {
    const createdDate = createdAtStr ? new Date(createdAtStr) : new Date();
    
    const startEst = new Date(createdDate);
    startEst.setDate(startEst.getDate() + 2);
    
    const endEst = new Date(createdDate);
    endEst.setDate(endEst.getDate() + 3);
    
    const formatDate = (d: Date) => d.toLocaleDateString('en-PK', { day: 'numeric' });
    const formatMonthYear = (d: Date) => d.toLocaleDateString('en-PK', { month: 'long', year: 'numeric' });
    
    return `${formatDate(startEst)}–${formatDate(endEst)} ${formatMonthYear(startEst)}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-navy-dark flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-electric/20 border-t-electric rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="min-h-screen bg-navy-dark flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-8">
          <div className="w-24 h-24 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto border border-red-500/20">
            <svg className="w-12 h-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="font-heading text-white text-3xl font-extrabold uppercase italic">Order Not Found</h1>
          <p className="text-gray-500 text-sm font-bold uppercase tracking-widest leading-relaxed">
            This order number is invalid or has not been processed yet.
          </p>
          <Link to="/" className="btn-electric px-10 py-4 font-extrabold rounded-2xl block">Return to Home</Link>
        </div>
      </div>
    );
  }

  const formattedDate = getFormattedDate(order.createdAt ? String(order.createdAt) : '');
  const deliveryRange = getEstimatedDelivery(order.createdAt ? String(order.createdAt) : '');
  const firstName = getFirstName(order.ownerName || '');

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-artisan-text pt-4 md:pt-6 pb-20 px-4 font-artisan-body selection:bg-artisan-primary selection:text-white">
      {/* Dynamic Embedded Premium Animations */}
      <style>{`
        .check-circle {
          animation: scaleUp 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .check-path {
          stroke-dasharray: 80;
          stroke-dashoffset: 80;
          animation: drawCheck 0.5s ease-in-out 0.4s forwards;
        }
        .btn-animated-pulse {
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .btn-animated-pulse:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(61, 31, 13, 0.15);
        }
        .btn-animated-pulse:active {
          transform: translateY(-1px);
        }
        
        .btn-continue-animated {
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .btn-continue-animated:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(122, 106, 90, 0.1);
        }
        .btn-continue-animated:active {
          transform: translateY(-1px);
        }

        @keyframes gradientText {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animated-gradient-text {
          background: linear-gradient(270deg, #3D1F0D, #C1440E, #B8860B, #C1440E, #3D1F0D);
          background-size: 400% 400%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradientText 6s ease infinite;
        }
        
        @keyframes scaleUp {
          0% { transform: scale(0); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes drawCheck {
          to { stroke-dashoffset: 0; }
        }
        @media print {
          /* Hide all non-essential web and interactive features */
          nav, header, footer, .no-print, [class*="Navbar"], [class*="Footer"], [class*="PromoBar"], [class*="WhatsAppWidget"], [class*="whatsApp"], [class*="whatsapp"] {
            display: none !important;
          }
          
          /* Full Page Reset for standard paper print */
          html, body {
            background: #ffffff !important;
            color: #000000 !important;
            font-size: 11px !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          
          /* Compress overall outer container spacing */
          .min-h-screen {
            min-height: 0 !important;
            padding: 10px !important;
            background: #ffffff !important;
          }
          
          .max-w-4xl {
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          
          .space-y-4 > * + * {
            margin-top: 8px !important;
          }
          
          /* Elegant Ink-Saving Cards & Borders */
          .bg-artisan-card {
            background: #ffffff !important;
            color: #000000 !important;
            border: 1px solid #e2e8f0 !important;
            padding: 12px !important;
            box-shadow: none !important;
          }
          
          .bg-artisan-bg {
            background: #f8fafc !important;
            border: 1px solid #e2e8f0 !important;
          }
          
          .border-artisan-subtle\/10 {
            border-color: #e2e8f0 !important;
          }
          
          .divide-artisan-subtle\/10 > * + * {
            border-color: #e2e8f0 !important;
          }
        }

        @keyframes pulseBreathing {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 4px 12px rgba(61, 31, 13, 0.12);
          }
          50% {
            transform: scale(1.02);
            box-shadow: 0 8px 24px rgba(193, 68, 14, 0.28);
          }
        }
        @keyframes shineSweepCustom {
          0% { left: -150%; }
          50% { left: 150%; }
          100% { left: 150%; }
        }
        .btn-mobile-continue {
          animation: pulseBreathing 2.5s ease-in-out infinite;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .btn-mobile-continue::after {
          content: '';
          position: absolute;
          top: 0;
          left: -150%;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.35) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: skewX(-25deg);
          animation: shineSweepCustom 3.5s ease-in-out infinite;
        }
      `}</style>

      <div className="max-w-4xl mx-auto space-y-6 animate-fade-up">
        
        {/* Print-Only Premium Invoice Header */}
        <div className="hidden print:flex items-center justify-between border-b-2 border-slate-200 pb-3 mb-2">
          <div>
            <h1 className="text-xl font-bold uppercase tracking-tight text-slate-900 flex items-center">
              DIVINECRAFT
            </h1>
            <p className="text-[9px] text-slate-600 font-bold uppercase tracking-[0.2em]">Artisan Craft Store</p>
          </div>
          <div className="text-right">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">ORDER INVOICE</h2>
            <p className="text-[8px] text-slate-500 font-bold uppercase">Customer & Shop Copy</p>
          </div>
        </div>

        {/* Shukriya Hero Header */}
        <div className="bg-white border border-artisan-subtle/10 rounded-2xl p-4 xs:p-6 sm:p-8 md:p-12 text-center relative overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
          
          {/* Glowing Animated Success Checkmark */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 check-circle no-print shadow-inner">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path className="check-path" strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          {/* Personalized Shukriya Greetings */}
          <h1 className="font-artisan-heading animated-gradient-text text-xl xs:text-2xl sm:text-4xl md:text-6xl font-extrabold uppercase tracking-wider mb-3 leading-tight break-words">
            SHUKRIYA {firstName} BHAI!
          </h1>
          <p className="text-artisan-highlight text-[10px] xs:text-xs sm:text-sm font-extrabold uppercase tracking-[0.12em] sm:tracking-[0.2em] md:tracking-[0.35em] mb-4 sm:mb-6 bg-artisan-highlight/10 border-2 border-artisan-highlight/30 py-1.5 sm:py-2 md:py-2.5 px-4 sm:px-6 rounded-full inline-block shadow-sm no-print max-w-full break-words">
            Order Placed Successfully
          </p>
          <p className="text-slate-800 text-xs sm:text-sm md:text-base font-bold tracking-wide max-w-xl mx-auto leading-relaxed border-t border-artisan-subtle/15 pt-4 sm:pt-6 no-print">
            Aapka order receive ho gaya — hum jald dispatch karein ge. Niche di gayi details check kar lein.
          </p>
          
          {/* Confirmation Meta Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-md mx-auto mt-6 sm:mt-8 p-4 sm:p-6 bg-[#FAF8F5] border border-artisan-subtle/10 rounded-xl">
            <div className="border-b sm:border-b-0 sm:border-r border-artisan-subtle/10 pb-4 sm:pb-0 sm:pr-4 text-center sm:text-left">
              <p className="text-[10px] text-artisan-subtle font-extrabold uppercase tracking-widest mb-1.5">Confirmation Number</p>
              <p className="text-artisan-primary font-bold text-sm sm:text-base tracking-tight break-all">{order.orderId}</p>
            </div>
            <div className="pt-2 sm:pt-0 sm:pl-4 text-center sm:text-left">
              <p className="text-[10px] text-artisan-subtle font-extrabold uppercase tracking-widest mb-1.5">Order Date</p>
              <p className="text-artisan-primary font-bold text-sm sm:text-base tracking-tight break-words">{formattedDate}</p>
            </div>
          </div>
        </div>

        {/* Continue Shopping Button - Exclusively for Mobile View */}
        <div className="block sm:hidden my-6 px-1 no-print text-center">
          <Link 
            to="/" 
            className="btn-mobile-continue inline-block w-4/5 max-w-[260px] bg-gradient-to-r from-artisan-primary via-artisan-highlight to-artisan-primary text-white font-extrabold uppercase tracking-[0.2em] text-[13px] py-5 rounded-xl text-center shadow-md cursor-pointer border border-artisan-primary/10"
          >
            Continue Shopping
          </Link>
        </div>

        {/* Purchase Summary Table */}
        <div className="bg-white border border-artisan-subtle/10 rounded-2xl p-4 sm:p-6 md:p-10 space-y-6 shadow-sm hover:shadow-md transition-all duration-300">
          <h3 className="font-artisan-heading text-xs font-bold text-artisan-subtle uppercase tracking-widest border-b border-artisan-subtle/10 pb-4">
            Review Items
          </h3>
          <div className="divide-y divide-artisan-subtle/10">
            {order.items.map((item: any, idx: number) => (
              <div key={idx} className="flex gap-3 sm:gap-4 items-center py-4 sm:py-5 first:pt-0 last:pb-0 group">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#FAF8F5] rounded-xl border border-artisan-subtle/10 p-1.5 sm:p-2 shrink-0 flex items-center justify-center group-hover:border-artisan-primary transition-colors duration-300">
                  <img src={item.image || '/placeholder-product.png'} alt={item.name} className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-artisan-primary uppercase truncate group-hover:text-artisan-highlight transition-colors duration-300">{item.name}</h4>
                    <div className="flex flex-wrap gap-2 sm:gap-4 mt-1 text-[9px] text-artisan-subtle font-bold uppercase tracking-wider">
                      <span>QTY: {item.quantity}</span>
                      {item.size && <span>Size: {item.size}</span>}
                      {item.color && <span>Color: {item.color}</span>}
                    </div>
                  </div>
                  <div className="text-left sm:text-right shrink-0">
                    <p className="text-xs font-bold text-artisan-primary">Rs. {formatPrice(item.price * item.quantity)}</p>
                    <p className="text-[9px] text-artisan-subtle font-medium uppercase mt-0.5 sm:mt-1">Rs. {formatPrice(item.price)} each</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Calculations */}
          <div className="pt-6 border-t border-artisan-subtle/10 space-y-3 max-w-sm ml-auto">
            <div className="flex justify-between text-[10px] font-bold text-artisan-subtle uppercase tracking-widest">
              <span>Subtotal Summary</span>
              <span className="text-artisan-primary font-bold text-xs">
                Rs. {formatPrice(order.subtotal)}
                {(order.deliveryFee ?? 0) > 0 && <span className="text-[9px] text-artisan-subtle lowercase ml-1"> + Rs. {formatPrice(order.deliveryFee ?? 0)} tcs</span>}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs font-bold text-artisan-primary uppercase tracking-wider mt-4 pt-4 border-t border-artisan-subtle/10">
              <span>Grand Total</span>
              <span className="text-artisan-highlight font-bold text-xl sm:text-2xl">Rs. {formatPrice(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* 2x2 Grid Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Logistics block */}
          <div className="bg-white border border-artisan-subtle/10 rounded-2xl p-4 sm:p-6 md:p-8 space-y-4 no-print shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-[#FAF8F5] flex items-center justify-center text-lg border border-artisan-subtle/10 shadow-sm">🚚</span>
              <h3 className="font-artisan-heading text-xs font-bold text-artisan-primary uppercase tracking-widest">TCS Express Delivery</h3>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-bold text-artisan-primary tracking-wide">{deliveryRange}</p>
              <p className="text-[9px] text-artisan-subtle font-bold uppercase tracking-wider leading-relaxed">
                AAPKA PARCEL TCS COURIER KE ZARIYE DELIVER HOGA. TRACKING NUMBER DISPATCH KE BAAD WHATSAPP PER BHEJA JAEGA.
              </p>
            </div>
          </div>

          {/* Shipping Address Block */}
          <div className="bg-white border border-artisan-subtle/10 rounded-2xl p-4 sm:p-6 md:p-8 space-y-4 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-[#FAF8F5] flex items-center justify-center text-lg border border-artisan-subtle/10 shadow-sm">📍</span>
              <h3 className="font-artisan-heading text-xs font-bold text-artisan-primary uppercase tracking-widest">Delivery Address</h3>
            </div>
            <div className="space-y-3 text-[10px] font-bold uppercase tracking-wider">
              <div className="flex justify-between border-b border-artisan-subtle/10 pb-2">
                <span className="text-artisan-subtle">Name</span>
                <span className="text-artisan-primary text-right pl-2 break-words">{order.ownerName}</span>
              </div>
              <div className="flex justify-between border-b border-artisan-subtle/10 pb-2">
                <span className="text-artisan-subtle">Phone</span>
                <span className="text-artisan-primary text-right pl-2 break-words">{order.phone}</span>
              </div>
              <div className="flex justify-between border-b border-artisan-subtle/10 pb-2">
                <span className="text-artisan-subtle">City</span>
                <span className="text-artisan-primary text-right pl-2 break-words">{order.city}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-artisan-subtle shrink-0">Address</span>
                <span className="text-artisan-primary text-right pl-2 break-words flex-1">{order.shopName}</span>
              </div>
            </div>
          </div>

          {/* Payment Status Block */}
          <div className="bg-white border border-artisan-subtle/10 rounded-2xl p-4 sm:p-6 md:p-8 space-y-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-[#FAF8F5] flex items-center justify-center text-lg border border-artisan-subtle/10 shadow-sm">💵</span>
                <h3 className="font-artisan-heading text-xs font-bold text-artisan-primary uppercase tracking-widest">Payment</h3>
              </div>
              <div className="space-y-1.5">
                <p className="text-sm font-bold text-artisan-primary tracking-wide">CASH ON DELIVERY</p>
                <p className="text-[9px] text-artisan-subtle font-extrabold uppercase tracking-widest">STATUS: PENDING</p>
              </div>
            </div>
            <div className="p-3 sm:p-4 bg-[#FAF8F5] border border-artisan-subtle/10 rounded-xl mt-3 shadow-inner">
              <p className="text-[10px] text-artisan-highlight font-extrabold uppercase tracking-wider text-center leading-relaxed italic">
                "PKR {order.totalAmount.toLocaleString()} cash tayar rakhein delivery ke waqt."
              </p>
            </div>
          </div>

          {/* Concierge Support Block */}
          <div className="bg-white border border-artisan-subtle/10 rounded-2xl p-4 sm:p-6 md:p-8 space-y-4 no-print shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-[#FAF8F5] flex items-center justify-center text-lg border border-artisan-subtle/10 shadow-sm">☎️</span>
              <h3 className="font-artisan-heading text-xs font-bold text-artisan-primary uppercase tracking-widest">Concierge Assistance</h3>
            </div>
            <div className="space-y-4">
              <p className="text-[9px] text-artisan-subtle font-extrabold uppercase tracking-wider leading-relaxed">
                ORDER ASSISTANCE IS AVAILABLE 24/7.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a 
                  href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '923007709173'}?text=Assalam-o-Alaikum, order ID *${order.orderId}* details check kar lein.`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="bg-[#25D366]/10 hover:bg-[#25D366] hover:text-white text-[#25D366] py-3 sm:py-3.5 rounded-xl font-bold uppercase tracking-wider text-[9px] text-center border border-[#25D366]/20 transition-all duration-300 cursor-pointer hover:shadow-md"
                >
                  WhatsApp
                </a>
                <a 
                  href="tel:+923007709173" 
                  className="bg-artisan-primary/10 hover:bg-artisan-primary hover:text-white text-artisan-primary py-3 sm:py-3.5 rounded-xl font-bold uppercase tracking-wider text-[9px] text-center border border-artisan-primary/20 transition-all duration-300 cursor-pointer hover:shadow-md"
                >
                  Direct Call
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Global Footer Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 no-print">
          <Link 
            to="/" 
            className="btn-continue-animated hidden sm:flex sm:flex-1 items-center justify-center bg-white text-artisan-primary font-bold uppercase tracking-[0.2em] text-xs py-5 rounded-xl text-center border border-artisan-primary/20 hover:border-artisan-primary transition-all shadow-sm cursor-pointer"
          >
            Continue Shopping
          </Link>
          <button 
            onClick={() => window.print()}
            className="btn-animated-pulse flex-1 bg-artisan-primary hover:bg-artisan-highlight text-white font-bold uppercase tracking-[0.2em] text-xs py-5 rounded-xl text-center transition-all shadow-md cursor-pointer"
          >
            Print Receipt
          </button>
        </div>

      </div>
    </div>
  );
};

export default OrderConfirmation;
