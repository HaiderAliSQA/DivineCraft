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
    <div className="pt-28 pb-20 px-6 sm:px-10 lg:px-16 max-w-[1440px] mx-auto bg-artisan-bg font-artisan-body text-artisan-text">
      {/* Page Header */}
      <div className="text-center mb-16">
        <h1 className="font-artisan-heading text-3xl md:text-5xl font-normal text-artisan-primary tracking-wide mb-4">
          Contact Us
        </h1>
        <p className="text-artisan-subtle text-xs md:text-sm font-medium tracking-wide max-w-2xl mx-auto leading-relaxed">
          We are here to assist you with any inquiries regarding our premium artisan craft collections. 
          Please reach out via the details below or send us a direct message.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Contact Information (Left Panel) */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-artisan-card border border-artisan-subtle/10 rounded-none p-8 md:p-10 shadow-sm">
            <h3 className="font-artisan-heading text-xl text-artisan-primary font-bold tracking-wider uppercase border-b border-artisan-subtle/10 pb-4 mb-6">
              Our Headquarters
            </h3>

            <div className="space-y-8">
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-none bg-artisan-bg border border-artisan-subtle/10 flex items-center justify-center shrink-0 text-artisan-highlight">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-artisan-body font-bold text-[10px] text-artisan-primary uppercase tracking-widest mb-1.5">Address</h4>
                  <p className="font-artisan-body text-sm text-artisan-subtle leading-relaxed">
                   Chiniot, Pakistan<br />
                    Shop No. 477-A<br />
                    Street No. 20 Main Furnituer market<br />
                    Chiniot, Pakistan
                    
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-none bg-artisan-bg border border-artisan-subtle/10 flex items-center justify-center shrink-0 text-artisan-highlight">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-artisan-body font-bold text-[10px] text-artisan-primary uppercase tracking-widest mb-1.5">Phone</h4>
                  <p className="font-artisan-body text-sm text-artisan-subtle">
                    <a href="tel:+923007702061" className="hover:text-artisan-highlight transition-colors font-bold">+92 300 7709173</a>
                  </p>
                  <p className="font-artisan-body text-[10px] text-artisan-subtle/60 mt-1">Available Mon - Sat (10:00 AM - 08:00 PM)</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-none bg-artisan-bg border border-artisan-subtle/10 flex items-center justify-center shrink-0 text-artisan-highlight">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-artisan-body font-bold text-[10px] text-artisan-primary uppercase tracking-widest mb-1.5">Email</h4>
                  <p className="font-artisan-body text-sm text-artisan-subtle">
                    <a href="mailto:haider.sqa98@gmail.com" className="hover:text-artisan-highlight transition-colors font-bold">haider.sqa98@gmail.com</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form (Right Panel) */}
        <div className="lg:col-span-7 bg-artisan-card border border-artisan-subtle/10 rounded-none p-8 md:p-12 shadow-sm">
          <h3 className="font-artisan-heading text-xl text-artisan-primary font-bold tracking-wider uppercase border-b border-artisan-subtle/10 pb-4 mb-6">
            Send a Message
          </h3>

          {isSubmitted ? (
            <div className="bg-artisan-bg border border-artisan-subtle/10 p-8 text-center">
              <span className="text-4xl mb-4 block">✓</span>
              <h4 className="font-artisan-heading text-2xl text-artisan-primary font-normal mb-2">Message Sent</h4>
              <p className="font-artisan-body text-artisan-subtle text-sm max-w-md mx-auto leading-relaxed">
                Thank you for contacting DivineCraft. We have received your message and will respond to your inquiry shortly.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="mt-6 bg-artisan-primary text-white px-8 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:bg-artisan-highlight hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block font-artisan-body text-[9px] font-bold text-artisan-subtle uppercase tracking-widest mb-2 ml-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-artisan-bg border border-artisan-subtle/20 px-5 py-4 rounded-none text-artisan-text font-artisan-body text-sm focus:outline-none focus:border-artisan-primary transition-all placeholder:text-artisan-subtle/50"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block font-artisan-body text-[9px] font-bold text-artisan-subtle uppercase tracking-widest mb-2 ml-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-artisan-bg border border-artisan-subtle/20 px-5 py-4 rounded-none text-artisan-text font-artisan-body text-sm focus:outline-none focus:border-artisan-primary transition-all placeholder:text-artisan-subtle/50"
                  placeholder="e.g. +92 300 0000000"
                />
              </div>

              <div>
                <label htmlFor="message" className="block font-artisan-body text-[9px] font-bold text-artisan-subtle uppercase tracking-widest mb-2 ml-1">
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-artisan-bg border border-artisan-subtle/20 px-5 py-4 rounded-none text-artisan-text font-artisan-body text-sm focus:outline-none focus:border-artisan-primary transition-all placeholder:text-artisan-subtle/50 resize-none"
                  placeholder="How can we assist you today?"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-artisan-primary text-white py-5 rounded-2xl text-sm font-bold uppercase tracking-[0.25em] transition-all duration-300 hover:bg-artisan-highlight hover:scale-[1.02] active:scale-[0.98] hover:shadow-[0_4px_20px_rgba(193,68,14,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer shadow-md flex justify-center items-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
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
  );
};

export default ContactUs;
