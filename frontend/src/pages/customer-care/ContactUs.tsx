import React, { useState } from 'react';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002';

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsSubmitted(true);
        setFormData({ name: '', phone: '', message: '' });
        toast.success('Your message has been sent successfully!');
      } else {
        toast.error(data.message || 'Failed to send message. Please try again.');
      }
    } catch (err) {
      console.error('Contact submit error:', err);
      toast.error('An error occurred. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-6 sm:pt-16 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white font-artisan-body text-gray-800">
      
      {/* Header Banner Section */}
      <div className="relative overflow-hidden bg-[#FAF7F2] rounded-3xl p-6 sm:p-12 md:p-16 mb-8 sm:mb-12 text-center border border-gray-100 shadow-sm">
        <div className="absolute top-0 right-0 w-32 h-32 bg-artisan-accent/5 rounded-full -mr-8 -mt-8 blur-2xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-artisan-accent/5 rounded-full -ml-8 -mb-8 blur-2xl" />
        
        <h1 className="font-artisan-heading text-3xl sm:text-4xl md:text-5xl font-black text-gray-950 tracking-tight mb-4">
          Contact Us
        </h1>
        <p className="text-gray-600 text-xs sm:text-sm md:text-base font-medium max-w-2xl mx-auto leading-relaxed">
          We are here to assist you with any inquiries regarding our premium artisan craft collections. 
          Please reach out via the details below or send us a direct message.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
        
        {/* Contact Info Cards (Left side) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-[#FAF7F2] border border-gray-100 rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm flex-1 flex flex-col justify-between">
            <div>
              <h3 className="font-artisan-heading text-lg sm:text-xl text-gray-950 font-black tracking-wide uppercase border-b border-gray-200/60 pb-4 mb-6">
                Our Headquarters
              </h3>

              <div className="space-y-6 sm:space-y-8">
                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white border border-gray-200/80 flex items-center justify-center shrink-0 text-artisan-accent shadow-sm">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-[10px] text-gray-500 uppercase tracking-widest mb-1">Address</h4>
                    <p className="text-sm text-gray-700 leading-relaxed font-medium">
                      Chiniot, Pakistan<br />
                      Shop No. 477-A, Street No. 20<br />
                      Main Furniture Market, Chiniot
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white border border-gray-200/80 flex items-center justify-center shrink-0 text-artisan-accent shadow-sm">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-[10px] text-gray-500 uppercase tracking-widest mb-1">Phone</h4>
                    <p className="text-sm text-gray-900 font-extrabold">
                      <a href="tel:+923007709173" className="hover:text-artisan-accent transition-colors">+92 300 7709173</a>
                    </p>
                    <p className="text-[10px] text-gray-500 mt-0.5">Available Mon - Sat (10:00 AM - 08:00 PM)</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white border border-gray-200/80 flex items-center justify-center shrink-0 text-artisan-accent shadow-sm">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-[10px] text-gray-500 uppercase tracking-widest mb-1">Email</h4>
                    <p className="text-sm text-gray-900 font-extrabold">
                      <a href="mailto:haider.sqa98@gmail.com" className="hover:text-artisan-accent transition-colors">haider.sqa98@gmail.com</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Premium Touch */}
            <div className="mt-8 pt-6 border-t border-gray-200/60 hidden sm:block">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Connect Instantly</span>
              <p className="text-xs text-gray-500 leading-relaxed">
                Click on the details above to call or mail us directly. We typically respond within 2 hours.
              </p>
            </div>
          </div>
        </div>

        {/* Message Form (Right side) */}
        <div className="lg:col-span-7 bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-artisan-heading text-lg sm:text-xl text-gray-950 font-black tracking-wide uppercase border-b border-gray-200/60 pb-4 mb-6">
              Send a Message
            </h3>

            {isSubmitted ? (
              <div className="bg-[#FAF7F2] border border-gray-100 rounded-2xl p-8 sm:p-12 text-center animate-fade-in my-auto">
                <div className="w-14 h-14 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-100 shadow-sm text-2xl font-bold">
                  ✓
                </div>
                <h4 className="font-artisan-heading text-xl sm:text-2xl text-gray-950 font-black mb-2">Message Sent</h4>
                <p className="text-gray-600 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                  Thank you for contacting DivineCraft. We have received your message and will respond to your inquiry shortly.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-8 bg-black text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all hover:bg-artisan-accent hover:scale-105 shadow-md cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                <div>
                  <label htmlFor="name" className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-gray-200/60 px-4 sm:px-5 py-3.5 sm:py-4 rounded-2xl text-gray-900 font-medium text-sm focus:outline-none focus:border-artisan-accent focus:ring-2 focus:ring-artisan-accent/10 transition-all placeholder:text-gray-400"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-gray-200/60 px-4 sm:px-5 py-3.5 sm:py-4 rounded-2xl text-gray-900 font-medium text-sm focus:outline-none focus:border-artisan-accent focus:ring-2 focus:ring-artisan-accent/10 transition-all placeholder:text-gray-400"
                    placeholder="e.g. +92 300 0000000"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-gray-200/60 px-4 sm:px-5 py-3.5 sm:py-4 rounded-2xl text-gray-900 font-medium text-sm focus:outline-none focus:border-artisan-accent focus:ring-2 focus:ring-artisan-accent/10 transition-all placeholder:text-gray-400 resize-none"
                    placeholder="How can we assist you today?"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-black text-white py-4 sm:py-4.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] transition-all hover:bg-artisan-accent disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] cursor-pointer shadow-md hover:shadow-lg flex justify-center items-center gap-3 mt-4"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      Sending Request...
                    </>
                  ) : (
                    'Submit Message'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ContactUs;
