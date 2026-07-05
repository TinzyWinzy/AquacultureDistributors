import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Mail, Fish, AlertCircle, Sparkles, HelpCircle } from 'lucide-react';
import { FARM_METADATA } from '../data';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [email, setEmail] = useState('admin@aquaculture.co.zw');
  const [password, setPassword] = useState('hatch');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulated authentic credentials
    setTimeout(() => {
      if (email === 'admin@aquaculture.co.zw' && password === 'hatch') {
        onLoginSuccess();
      } else if (!email || !password) {
        setError('Please fill in all credentials fields.');
      } else {
        setError('Incorrect email or passphrase. Use the default credentials or quick login.');
      }
      setIsLoading(false);
    }, 450);
  };

  const handleDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      onLoginSuccess();
      setIsLoading(false);
    }, 200);
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-12 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white border border-slate-150 rounded-3xl overflow-hidden shadow-xl"
      >
        {/* Header decoration */}
        <div className="bg-brand-navy text-white p-8 text-center relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4 select-none pointer-events-none">
            <Fish size={140} className="text-white" />
          </div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="p-3 bg-brand-aqua text-white rounded-2xl mb-4 shadow-md shadow-brand-aqua/20">
              <Fish size={28} />
            </div>
            <h2 className="text-xl font-display font-bold">
              {FARM_METADATA.name}
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Admin Access Portal · Harare, ZW
            </p>
          </div>
        </div>

        {/* Form area */}
        <div className="p-6 sm:p-8">
          
          {error && (
            <div className="bg-rose-50 border border-rose-150 rounded-xl p-3 mb-6 text-xs text-rose-700 flex gap-2 items-center">
              <AlertCircle size={14} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="login-email" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Administrator Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  id="login-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-brand-aqua font-sans"
                  placeholder="admin@aquaculture.co.zw"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="login-password" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Passphrase
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  id="login-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-brand-aqua font-sans"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-brand-navy hover:bg-brand-navy/90 text-white text-sm font-semibold rounded-xl cursor-pointer transition-all shadow-md active:translate-y-0.5 flex items-center justify-center gap-2"
            >
              {isLoading ? 'Verifying Access...' : 'Login to Admin Dashboard'}
            </button>
          </form>

          {/* Quick Access Shortcut Section */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center space-y-4">
            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
              <HelpCircle size={14} />
              <span>Testing the demo? Log in instantly:</span>
            </div>
            
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer transition-all flex items-center justify-center gap-2"
            >
              <Sparkles size={14} className="text-brand-gold animate-pulse" />
              Quick Demo Access (One-click)
            </button>

            <div className="text-[10px] text-slate-400 font-mono">
              Defaults: admin@aquaculture.co.zw / hatch
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
