import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Compass, Bell, X, Phone, Menu } from 'lucide-react';
import { INITIAL_INQUIRIES, FARM_METADATA } from './data';
import { Inquiry, InquiryStatus } from './types';
import CustomerForm from './components/CustomerForm';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';

export default function App() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [viewMode, setViewMode] = useState<'customer' | 'admin'>('customer');
  const [notifications, setNotifications] = useState<{ id: string; message: string }[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const cached = localStorage.getItem('aquaculture_leads');
    if (cached) {
      try { setInquiries(JSON.parse(cached)); }
      catch { setInquiries(INITIAL_INQUIRIES); }
    } else {
      setInquiries(INITIAL_INQUIRIES);
      localStorage.setItem('aquaculture_leads', JSON.stringify(INITIAL_INQUIRIES));
    }
  }, []);

  const sync = (list: Inquiry[]) => {
    setInquiries(list);
    localStorage.setItem('aquaculture_leads', JSON.stringify(list));
  };

  const handleAddInquiry = (inq: Inquiry) => sync([inq, ...inquiries]);

  const handleUpdateStatus = (id: string, status: InquiryStatus) => {
    const updated = inquiries.map(i => i.id === id ? { ...i, status, lastContactedAt: new Date().toISOString() } : i);
    sync(updated);
    const name = inquiries.find(i => i.id === id)?.name || 'Lead';
    triggerNotification(`Updated status for ${name} to ${status.toUpperCase()}!`);
  };

  const handleUpdateNotes = (id: string, notes: string) => {
    sync(inquiries.map(i => i.id === id ? { ...i, notes } : i));
    triggerNotification(`Note saved for lead #${id}!`);
  };

  const triggerNotification = (message: string) => {
    const id = `n-${Date.now()}`;
    setNotifications(prev => [...prev, { id, message }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 5000);
  };

  const switchView = (mode: 'customer' | 'admin') => {
    setViewMode(mode);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <div className="fixed top-4 right-4 z-50 pointer-events-none max-w-sm w-full space-y-2">
        <AnimatePresence>
          {notifications.map(n => (
            <motion.div key={n.id} initial={{ opacity: 0, x: 50, y: -10, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, y: 0, scale: 1 }} exit={{ opacity: 0, x: 50, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              className="bg-brand-navy text-white rounded-xl px-4 py-3.5 shadow-xl flex items-start gap-3 pointer-events-auto">
              <div className="p-1 rounded-lg bg-brand-aqua text-white mt-0.5"><Bell size={14} className="animate-bounce" /></div>
              <div className="flex-1 text-xs font-semibold leading-normal">{n.message}</div>
              <button onClick={() => setNotifications(prev => prev.filter(x => x.id !== n.id))} className="text-white/60 hover:text-white cursor-pointer"><X size={14} /></button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <header className="sticky top-0 glass-nav z-40">
        <div className="w-full mx-auto px-4 md:px-8 xl:px-12 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/images/logo-wide.jpg" alt="Aquaculture Distributors" className="h-9 w-auto rounded-lg shadow-sm" />
            <div>
              <div className="font-display font-bold text-brand-navy text-sm tracking-tight leading-none">Aquaculture Distributors</div>
              <div className="text-[10px] font-mono text-brand-gold font-bold mt-0.5 uppercase tracking-wide">We Hatch to Feed</div>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1 bg-white/80 border border-slate-200 p-1 rounded-xl backdrop-blur-md shadow-sm">
            <button onClick={() => setViewMode('customer')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${viewMode === 'customer' ? 'bg-brand-navy text-white shadow-md' : 'text-slate-500 hover:text-brand-navy'}`}>
              <Compass size={14} /> Order & Inquire
            </button>
            <button onClick={() => setViewMode('admin')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${viewMode === 'admin' ? 'bg-brand-gold text-brand-navy shadow-md' : 'text-slate-500 hover:text-brand-navy'}`}>
              <Lock size={14} /> Admin Portal
            </button>
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="sm:hidden p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-brand-navy cursor-pointer transition-all shadow-sm">
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="sm:hidden bg-white/95 backdrop-blur-2xl border-b border-slate-200 px-4 py-4 space-y-2 shadow-xl">
            <button onClick={() => switchView('customer')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${viewMode === 'customer' ? 'bg-brand-navy text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}>
              <Compass size={18} /> Order & Inquire
            </button>
            <button onClick={() => switchView('admin')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${viewMode === 'admin' ? 'bg-brand-gold text-brand-navy shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}>
              <Lock size={18} /> Admin Portal
            </button>
          </motion.div>
        )}
      </header>

      <main className="flex-grow flex flex-col justify-start">
        <AnimatePresence mode="wait">
          {viewMode === 'customer' ? (
            <motion.div key="customer" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="w-full">
              <CustomerForm onAddInquiry={handleAddInquiry} triggerAdminNotification={triggerNotification} />
            </motion.div>
          ) : (
            <motion.div key="admin" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="w-full">
              {isAdminLoggedIn ? (
                <AdminDashboard inquiries={inquiries} onUpdateStatus={handleUpdateStatus} onUpdateNotes={handleUpdateNotes}
                  onLogout={() => { setIsAdminLoggedIn(false); triggerNotification('Safely logged out of administrator console.'); }} />
              ) : (
                <AdminLogin onLoginSuccess={() => { setIsAdminLoggedIn(true); triggerNotification('Access Granted. Welcome, Mt Hampden Farm Admin!'); }} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="bg-brand-navy py-8 mt-12 text-xs text-slate-300 border-t border-brand-navy/10 shadow-[0_-10px_30px_rgba(0,43,94,0.05)]">
        <div className="w-full mx-auto px-4 md:px-8 xl:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6">
            <span>&copy; 2026 Aquaculture Distributors. Mt Hampden Farm, Harare.</span>
            <span className="hidden sm:inline text-brand-gold/30">|</span>
            <div className="flex items-center gap-3">
              <a href={`https://wa.me/${FARM_METADATA.phone1.replace(/[\s+()-]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-brand-gold hover:text-white font-semibold flex items-center gap-1 transition-colors">
                <Phone size={12} /> {FARM_METADATA.phone1}
              </a>
              <span className="text-brand-gold/30">/</span>
              <a href={`https://wa.me/${FARM_METADATA.phone2.replace(/[\s+()-]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-brand-gold hover:text-white font-semibold flex items-center gap-1 transition-colors">
                <Phone size={12} /> {FARM_METADATA.phone2}
              </a>
            </div>
          </div>
          <div className="flex gap-4 font-mono text-[10px] text-white/50">
            <span>GIFT Tilapia / Catfish</span>
            <span>30,000 fry daily</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
