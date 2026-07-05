import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Fish, Lock, Sparkles, AlertCircle, Bell, X, Compass, ExternalLink } from 'lucide-react';
import { INITIAL_INQUIRIES } from './data';
import { Inquiry, InquiryStatus } from './types';
import CustomerForm from './components/CustomerForm';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';

export default function App() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [viewMode, setViewMode] = useState<'customer' | 'admin'>('customer');
  
  // Real-time notification banners
  const [notifications, setNotifications] = useState<{ id: string; message: string }[]>([]);

  // Load initial inquiries from localStorage or seed data on startup
  useEffect(() => {
    const cachedData = localStorage.getItem('aquaculture_leads');
    if (cachedData) {
      try {
        setInquiries(JSON.parse(cachedData));
      } catch (err) {
        console.error('Failed to parse cached inquiries, resetting to seeds:', err);
        setInquiries(INITIAL_INQUIRIES);
      }
    } else {
      setInquiries(INITIAL_INQUIRIES);
      localStorage.setItem('aquaculture_leads', JSON.stringify(INITIAL_INQUIRIES));
    }
  }, []);

  // Sync inquiries with localstorage on change
  const syncInquiries = (updatedList: Inquiry[]) => {
    setInquiries(updatedList);
    localStorage.setItem('aquaculture_leads', JSON.stringify(updatedList));
  };

  // Add a brand-new inquiry
  const handleAddInquiry = (newInquiry: Inquiry) => {
    const updated = [newInquiry, ...inquiries];
    syncInquiries(updated);
  };

  // Update status
  const handleUpdateStatus = (id: string, status: InquiryStatus) => {
    const updated = inquiries.map(inq => 
      inq.id === id ? { ...inq, status, lastContactedAt: new Date().toISOString() } : inq
    );
    syncInquiries(updated);
    
    // Auto toast message for verification
    const name = inquiries.find(i => i.id === id)?.name || 'Lead';
    triggerNotification(`📝 Updated status for ${name} to ${status.toUpperCase()}!`);
  };

  // Update notes
  const handleUpdateNotes = (id: string, notes: string) => {
    const updated = inquiries.map(inq => 
      inq.id === id ? { ...inq, notes } : inq
    );
    syncInquiries(updated);
    triggerNotification(`💾 Note saved for lead #${id}!`);
  };

  // Floating notifications manager
  const triggerNotification = (message: string) => {
    const id = `notif-${Date.now()}`;
    setNotifications((prev) => [...prev, { id, message }]);
    
    // Automatically dismiss after 5 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      
      {/* Dynamic Floating Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 pointer-events-none max-w-sm w-full space-y-2">
        <AnimatePresence>
          {notifications.map((notif) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: 50, y: -10, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              className="bg-slate-900 border border-slate-800 text-white rounded-xl px-4 py-3.5 shadow-xl flex items-start gap-3 pointer-events-auto"
            >
              <div className="p-1 rounded-lg bg-emerald-500 text-slate-950 mt-0.5">
                <Bell size={14} className="animate-bounce" />
              </div>
              <div className="flex-1 text-xs font-semibold leading-normal">
                {notif.message}
              </div>
              <button 
                onClick={() => dismissNotification(notif.id)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Top Main Navigation Bar */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Left: Brand info */}
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-slate-900 text-white rounded-xl flex items-center justify-center">
              <Fish size={20} className="animate-pulse text-emerald-400" />
            </div>
            <div>
              <div className="font-display font-bold text-slate-900 text-sm tracking-tight leading-none">
                Aquaculture Distributors
              </div>
              <div className="text-[10px] font-mono text-emerald-600 font-bold mt-0.5 uppercase tracking-wide">
                We Hatch to Feed
              </div>
            </div>
          </div>

          {/* Right: View toggle switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('customer')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'customer'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Compass size={14} />
              Order & Inquire
            </button>
            
            <button
              onClick={() => setViewMode('admin')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'admin'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Lock size={14} />
              Admin Portal
            </button>
          </div>

        </div>
      </header>

      {/* Main View Transition Area */}
      <main className="flex-grow flex flex-col justify-start">
        <AnimatePresence mode="wait">
          {viewMode === 'customer' ? (
            <motion.div
              key="customer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              <CustomerForm 
                onAddInquiry={handleAddInquiry} 
                triggerAdminNotification={triggerNotification}
              />
            </motion.div>
          ) : (
            <motion.div
              key="admin"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              {isAdminLoggedIn ? (
                <AdminDashboard 
                  inquiries={inquiries} 
                  onUpdateStatus={handleUpdateStatus} 
                  onUpdateNotes={handleUpdateNotes}
                  onLogout={() => {
                    setIsAdminLoggedIn(false);
                    triggerNotification('🚪 Safely logged out of administrator console.');
                  }}
                />
              ) : (
                <AdminLogin onLoginSuccess={() => {
                  setIsAdminLoggedIn(true);
                  triggerNotification('🔓 Access Granted. Welcome, Mt Hampden Farm Admin!');
                }} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Modern, Simple Footnotes */}
      <footer className="bg-white border-t border-slate-100 py-6 mt-12 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            &copy; 2026 Aquaculture Distributors. Mt Hampden Farm, Harare. All Rights Reserved.
          </div>
          <div className="flex gap-4 font-mono text-[10px]">
            <span>Species: GIFT Tilapia / Catfish</span>
            <span>Capacity: 30,000 fry daily</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
