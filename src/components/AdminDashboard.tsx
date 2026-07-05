import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileSpreadsheet, LogOut, AlertTriangle, AlertCircle } from 'lucide-react';
import { Inquiry, InquiryStatus, ServiceType } from '../types';
import MetricsGrid from './admin/MetricsGrid';
import FilterSidebar from './admin/FilterSidebar';
import InquiryCard from './admin/InquiryCard';
import NotesModal from './admin/NotesModal';

interface AdminDashboardProps {
  inquiries: Inquiry[];
  onUpdateStatus: (id: string, status: InquiryStatus) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onLogout: () => void;
}

type TabType = 'all' | 'new_today' | 'pending' | 'shortlisted' | 'confirmed' | 'not_interested';

export default function AdminDashboard({ inquiries, onUpdateStatus, onUpdateNotes, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceFilter, setServiceFilter] = useState<ServiceType | 'all'>('all');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState('');

  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

  const filteredInquiries = useMemo(() => {
    return inquiries.filter(inq => {
      const created = new Date(inq.createdAt);
      if (activeTab === 'new_today' && created < oneDayAgo) return false;
      if (activeTab === 'pending' && inq.status !== 'pending' && inq.status !== 'new') return false;
      if (activeTab === 'shortlisted' && inq.status !== 'shortlisted') return false;
      if (activeTab === 'confirmed' && inq.status !== 'confirmed') return false;
      if (activeTab === 'not_interested' && inq.status !== 'not_interested') return false;
      if (serviceFilter !== 'all' && inq.serviceType !== serviceFilter) return false;
      if (searchTerm.trim()) {
        const t = searchTerm.toLowerCase();
        if (!inq.name.toLowerCase().includes(t) && !inq.phone.includes(t) && !inq.location.toLowerCase().includes(t)) return false;
      }
      return true;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [inquiries, activeTab, serviceFilter, searchTerm, oneDayAgo]);

  const metrics = useMemo(() => {
    const confirmedPartners = inquiries.filter(i => i.serviceType === 'breeding' && i.status === 'confirmed');
    const confirmedAll = inquiries.filter(i => i.status === 'confirmed').length;
    const serviceCounts = inquiries.reduce((acc, i) => { acc[i.serviceType] = (acc[i.serviceType] || 0) + 1; return acc; }, {} as Record<ServiceType, number>);
    return {
      totalThisMonth: inquiries.length,
      confirmedPartnersCount: confirmedPartners.length,
      partnershipSlotsRemaining: Math.max(0, 20 - confirmedPartners.length),
      conversionRate: inquiries.length > 0 ? Math.round((confirmedAll / inquiries.length) * 100) : 0,
      serviceCounts,
    };
  }, [inquiries]);

  const tabCounts = useMemo(() => ({
    all: inquiries.length,
    new_today: inquiries.filter(i => new Date(i.createdAt) >= oneDayAgo).length,
    pending: inquiries.filter(i => i.status === 'pending' || i.status === 'new').length,
    shortlisted: inquiries.filter(i => i.status === 'shortlisted').length,
    confirmed: inquiries.filter(i => i.status === 'confirmed').length,
    not_interested: inquiries.filter(i => i.status === 'not_interested').length,
  }), [inquiries, oneDayAgo]);

  const isOverdue = (inq: Inquiry) => new Date(inq.createdAt) < twoDaysAgo && (inq.status === 'new' || inq.status === 'pending');

  const handleWhatsAppContact = (inq: Inquiry) => {
    const cleanPhone = inq.phone.replace(/[\s+()-]/g, '');
    const details = inq.details as any;
    let serviceDetail = '';
    if (inq.serviceType === 'fingerlings') serviceDetail = `${details.quantity.toLocaleString()} ${details.species} fingerlings`;
    else if (inq.serviceType === 'pond') serviceDetail = `a ${details.size} Pond Construction project`;
    else if (inq.serviceType === 'breeding') serviceDetail = `the Partnership Breeding Hub package ($${details.investmentCapacity})`;
    else if (inq.serviceType === 'training') serviceDetail = `Practical Aquaculture Training registration for ${details.attendeesCount} attendees`;
    else serviceDetail = `your general aquaculture setup inquiry`;

    const message = `Hello ${inq.name},\n\nThis is the support team from *Aquaculture Distributors* (Mt Hampden Farm, Harare). \n\nWe have received your request regarding *${serviceDetail}*! We are delighted to assist you with your farming journey. Are you available for a quick discussion about your site parameters and layout options?\n\nKind regards,\nAquaculture Distributors - "We Hatch to Feed"`;

    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
    if (inq.status === 'new') onUpdateStatus(inq.id, 'pending');
  };

  const exportToCSV = () => {
    const rows = inquiries.map(inq => {
      const d = inq.details as any;
      let detailStr = '';
      if (inq.serviceType === 'fingerlings') detailStr = `${d.species} (Qty: ${d.quantity})`;
      else if (inq.serviceType === 'pond') detailStr = `Size: ${d.size} | Budget: ${d.budgetRange}`;
      else if (inq.serviceType === 'breeding') detailStr = `Investment: ${d.investmentCapacity} | Source: ${d.referralSource}`;
      else if (inq.serviceType === 'training') detailStr = `Attendees: ${d.attendeesCount}`;
      else detailStr = `Msg: ${d.message || ''}`;
      return `"${inq.id}","${inq.name.replace(/"/g, '""')}","${inq.phone}","${inq.location}","${inq.serviceType}","${inq.status}","${inq.createdAt}","${inq.priority}","${detailStr.replace(/"/g, '""')}","${(inq.notes || '').replace(/"/g, '""')}"`;
    }).join('\n');

    const blob = new Blob([`ID,Name,Phone,Location,Service Type,Status,Created At,Priority,Details,Notes\n${rows}`], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.setAttribute('href', URL.createObjectURL(blob));
    link.setAttribute('download', `aquaculture_distributors_leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 font-sans">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 bg-brand-aqua rounded-full animate-pulse" />
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider font-mono">Operational Management Console</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900">Business Inquiries & Sales Leads</h1>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button onClick={exportToCSV} className="flex-1 sm:flex-none px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2">
            <FileSpreadsheet size={16} /> Export CSV
          </button>
          <button onClick={onLogout} className="flex-1 sm:flex-none px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-sm font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2">
            <LogOut size={16} /> Log Out
          </button>
        </div>
      </div>

      <MetricsGrid metrics={metrics} />

      {inquiries.some(isOverdue) && (
        <div className="bg-brand-gold/10 border border-brand-gold/20 rounded-2xl p-4 mb-8 flex gap-3 items-start animate-pulse">
          <div className="p-1 bg-brand-gold/20 text-brand-gold rounded-lg"><AlertTriangle size={18} /></div>
          <div>
            <h4 className="text-sm font-semibold text-brand-gold">Pending Follow-up Action Required!</h4>
            <p className="text-xs text-brand-gold/80 mt-0.5">Some inquiries have been sitting unaddressed for more than 48 hours. Please check and follow up with these customers on WhatsApp.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-3">
          <FilterSidebar
            searchTerm={searchTerm} serviceFilter={serviceFilter} activeTab={activeTab} counts={tabCounts}
            onSearchChange={setSearchTerm} onServiceFilterChange={setServiceFilter} onTabChange={setActiveTab}
          />
        </div>

        <div className="lg:col-span-9 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold px-2">
            <span>Showing {filteredInquiries.length} leads matching filters</span>
          </div>

          <AnimatePresence mode="popLayout">
            {filteredInquiries.length === 0 ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="bg-white border border-slate-150 rounded-2xl p-12 text-center text-slate-500 shadow-sm">
                <AlertCircle size={32} className="mx-auto text-slate-300 mb-3" />
                <h3 className="font-semibold text-slate-800 mb-1">No inquiries found</h3>
                <p className="text-xs">Try clearing search text or resetting the service category filters.</p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {filteredInquiries.map(inq => (
                  <InquiryCard
                    key={inq.id}
                    inquiry={inq}
                    oneDayAgo={oneDayAgo}
                    twoDaysAgo={twoDaysAgo}
                    onUpdateStatus={onUpdateStatus}
                    onOpenNotes={(i) => { setEditingNotesId(i.id); setTempNotes(i.notes || ''); }}
                    onWhatsAppContact={handleWhatsAppContact}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <NotesModal
        editingNotesId={editingNotesId}
        tempNotes={tempNotes}
        onTempNotesChange={setTempNotes}
        onSave={() => { if (editingNotesId) { onUpdateNotes(editingNotesId, tempNotes); setEditingNotesId(null); } }}
        onClose={() => setEditingNotesId(null)}
      />
    </div>
  );
}
