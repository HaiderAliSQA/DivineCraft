// frontend/src/pages/admin/AdminLogin.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLoginMutation } from '../../store/api/adminApi';
import { useAppDispatch } from '../../store/store';
import { setCredentials } from '../../store/authSlice';
import toast from 'react-hot-toast';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    try {
      const result = await login({ email, password }).unwrap();
      if (result.success && result.token && result.admin) {
        dispatch(setCredentials({ token: result.token, admin: result.admin }));
        toast.success(`Welcome back, ${result.admin.email}`);
        navigate('/admin/dashboard');
      }
    } catch (error: any) {
      toast.error(error?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F3EE] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Dynamic Embedded Autofill Reset & Style */}
      <style>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus {
          -webkit-text-fill-color: #ffffff !important;
          -webkit-box-shadow: 0 0 0px 1000px #352922 inset !important;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>

      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-electric/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full space-y-6 z-10 bg-navy-mid p-8 sm:p-12 rounded-[2.5rem] border border-white/5 shadow-2xl animate-fade-in">
        <div className="text-center">
          <span className="font-heading text-electric text-3xl font-black tracking-widest">
            DIVENE<span className="text-white">CRAFT</span>
          </span>
          <p className="text-gray-400 text-[10px] font-extrabold uppercase tracking-[4px] mt-2">
            Administrator Access
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-300 uppercase tracking-widest ml-1">Admin Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                maxLength={100}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-3 rounded-xl bg-navy-dark border border-white/5 text-white placeholder-gray-500 outline-none focus:border-electric transition-all text-sm font-body"
                placeholder="admin@divenecraft.com"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-300 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  maxLength={50}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-3 pr-12 rounded-xl bg-navy-dark border border-white/5 text-white placeholder-gray-500 outline-none focus:border-electric transition-all text-sm font-body"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  ) : (
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-4 px-4 bg-electric text-white rounded-xl hover:shadow-glow-blue transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-[0.3em] text-[11px] font-extrabold animate-pulse-glow"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-3"></div>
                  Authenticating...
                </>
              ) : 'Access Dashboard'}
            </button>
          </div>
        </form>

        <div className="text-center pt-2">
          <Link to="/" className="text-[9px] text-gray-400 font-extrabold uppercase tracking-widest hover:text-white transition-colors underline underline-offset-8">
            Back to Storefront
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
