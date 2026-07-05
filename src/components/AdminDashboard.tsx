import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, FileSpreadsheet, PhoneCall, Check, Clock, 
  AlertTriangle, ArrowRight, User, Phone, MapPin, 
  Calendar, Layers, Filter, CheckCircle, TrendingUp,
  AlertCircle, Users, RefreshCw, X, ChevronRight, LogOut,
  Sparkles, FileText, Ban
} from 'lucide-react';
import { Inquiry, ServiceType, InquiryStatus } from '../types';
import { FARM_METADATA } from '../data';

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
  
  // Selected Inquiry for Modal Details View
  const [selectedInquiryId, setSelectedInquiryId] = useState<string | null>(null);
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState('');

  // Find selected inquiry details
  const selectedInquiry = useMemo(() => {
    return inquiries.find(inq => inq.id === selectedInquiryId) || null;
  }, [inquiries, selectedInquiryId]);

  // Compute 24h & 48h boundaries for inquiry classification
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

  // Filter & Search Logic
  const filteredInquiries = useMemo(() => {
    return inquiries.filter(inq => {
      // Tab filters
      const createdDate = new Date(inq.createdAt);
      if (activeTab === 'new_today' && createdDate < oneDayAgo) return false;
      if (activeTab === 'pending' && inq.status !== 'pending' && inq.status !== 'new') return false;
      if (activeTab === 'shortlisted' && inq.status !== 'shortlisted') return false;
      if (activeTab === 'confirmed' && inq.status !== 'confirmed') return false;
      if (activeTab === 'not_interested' && inq.status !== 'not_interested') return false;

      // Service Category filter
      if (serviceFilter !== 'all' && inq.serviceType !== serviceFilter) return false;

      // Text search (Name, Phone, Location)
      if (searchTerm.trim() !== '') {
        const term = searchTerm.toLowerCase();
        const nameMatch = inq.name.toLowerCase().includes(term);
        const phoneMatch = inq.phone.includes(term);
        const locMatch = inq.location.toLowerCase().includes(term);
        if (!nameMatch && !phoneMatch && !locMatch) return false;
      }

      return true;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); // Sort newest first
  }, [inquiries, activeTab, serviceFilter, searchTerm, oneDayAgo]);

  // Live Metrics calculations
  const metrics = useMemo(() => {
    const totalCount = inquiries.length;
    const confirmedPartners = inquiries.filter(inq => inq.serviceType === 'breeding' && inq.status === 'confirmed');
    const totalBreeding = inquiries.filter(inq => inq.serviceType === 'breeding').length;
    
    // Confirmed count across all services
    const confirmedAll = inquiries.filter(inq => inq.status === 'confirmed').length;
    const conversionRate = totalCount > 0 ? Math.round((confirmedAll / totalCount) * 100) : 0;

    // Service type counts
    const serviceCounts = inquiries.reduce((acc, curr) => {
      acc[curr.serviceType] = (acc[curr.serviceType] || 0) + 1;
      return acc;
    }, {} as Record<ServiceType, number>);

    return {
      totalThisMonth: totalCount,
      confirmedPartnersCount: confirmedPartners.length,
      partnershipSlotsRemaining: Math.max(0, 20 - confirmedPartners.length),
      conversionRate,
      serviceCounts,
    };
  }, [inquiries]);

  // Check if an inquiry requires attention (over 48 hours without contact/action and still new/pending)
  const isOverdue = (inq: Inquiry) => {
    const createdDate = new Date(inq.createdAt);
    return createdDate < twoDaysAgo && (inq.status === 'new' || inq.status === 'pending');
  };

  const getServiceColor = (type: ServiceType) => {
    switch (type) {
      case 'fingerlings': return 'bg-sky-50 text-sky-800 border-sky-100';
      case 'pond': return 'bg-indigo-50 text-indigo-800 border-indigo-100';
      case 'breeding': return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'training': return 'bg-emerald-50 text-emerald-800 border-emerald-100';
      case 'general': return 'bg-slate-50 text-slate-800 border-slate-100';
    }
  };

  const getStatusBadge = (status: InquiryStatus) => {
    switch (status) {
      case 'new':
        return <span className="bg-blue-100 text-blue-800 border border-blue-200 text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">New</span>;
      case 'pending':
        return <span className="bg-amber-100 text-amber-800 border border-amber-200 text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">Pending</span>;
      case 'shortlisted':
        return <span className="bg-purple-100 text-purple-800 border border-purple-200 text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">Shortlisted</span>;
      case 'confirmed':
        return <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">Confirmed</span>;
      case 'not_interested':
        return <span className="bg-slate-100 text-slate-500 border border-slate-200 text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">Not Interested</span>;
    }
  };

  // Pre-filled dynamic WhatsApp link helper
  const handleWhatsAppContact = (inq: Inquiry) => {
    const cleanPhone = inq.phone.replace(/[\s+()-]/g, '');
    let serviceDetail = '';
    
    if (inq.serviceType === 'fingerlings') {
      const details = inq.details as any;
      serviceDetail = `${details.quantity.toLocaleString()} ${details.species} fingerlings`;
    } else if (inq.serviceType === 'pond') {
      const details = inq.details as any;
      serviceDetail = `a ${details.size} Pond Construction project`;
    } else if (inq.serviceType === 'breeding') {
      const details = inq.details as any;
      serviceDetail = `the Partnership Breeding Hub package ($${details.investmentCapacity})`;
    } else if (inq.serviceType === 'training') {
      const details = inq.details as any;
      serviceDetail = `Practical Aquaculture Training registration for ${details.attendeesCount} attendees`;
    } else {
      serviceDetail = `your general aquaculture setup inquiry`;
    }

    const message = `Hello ${inq.name},\n\nThis is the support team from *Aquaculture Distributors* (Mt Hampden Farm, Harare). \n\nWe have received your request regarding *${serviceDetail}*! We are delighted to assist you with your farming journey. Are you available for a quick discussion about your site parameters and layout options?\n\nKind regards,\nAquaculture Distributors - "We Hatch to Feed"`;
    
    const encodedText = encodeURIComponent(message);
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodedText}`;
    
    // Automatically flag inquiry status to "pending" once contacted, if it was new
    if (inq.status === 'new') {
      onUpdateStatus(inq.id, 'pending');
    }

    window.open(waUrl, '_blank');
  };

  // Client-side CSV export
  const exportToCSV = () => {
    let csvContent = 'ID,Name,Phone,Location,Service Type,Status,Created At,Priority,Details,Notes\n';
    
    inquiries.forEach(inq => {
      let detailString = '';
      if (inq.serviceType === 'fingerlings') {
        const details = inq.details as any;
        detailString = `${details.species} (Qty: ${details.quantity})`;
      } else if (inq.serviceType === 'pond') {
        const details = inq.details as any;
        detailString = `Size: ${details.size} | Budget: ${details.budgetRange}`;
      } else if (inq.serviceType === 'breeding') {
        const details = inq.details as any;
        detailString = `Investment: ${details.investmentCapacity} | Source: ${details.referralSource}`;
      } else if (inq.serviceType === 'training') {
        const details = inq.details as any;
        detailString = `Attendees: ${details.attendeesCount}`;
      } else {
        const details = inq.details as any;
        detailString = `Msg: ${details.message || ''}`;
      }

      // Escape quotes
      const cleanName = inq.name.replace(/"/g, '""');
      const cleanNotes = (inq.notes || '').replace(/"/g, '""');
      const cleanDetails = detailString.replace(/"/g, '""');

      csvContent += `"${inq.id}","${cleanName}","${inq.phone}","${inq.location}","${inq.serviceType}","${inq.status}","${inq.createdAt}","${inq.priority}","${cleanDetails}","${cleanNotes}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `aquaculture_distributors_leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenNotes = (inq: Inquiry) => {
    setEditingNotesId(inq.id);
    setTempNotes(inq.notes || '');
  };

  const handleSaveNotes = (id: string) => {
    onUpdateNotes(id, tempNotes);
    setEditingNotesId(null);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 font-sans">
      
      {/* Top Admin Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider font-mono">
              Operational Management Console
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900">
            Business Inquiries & Sales Leads
          </h1>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={exportToCSV}
            className="flex-1 sm:flex-none px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <FileSpreadsheet size={16} />
            Export CSV
          </button>
          
          <button
            onClick={onLogout}
            className="flex-1 sm:flex-none px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-sm font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <LogOut size={16} />
            Log Out
          </button>
        </div>
      </div>

      {/* Live Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Total Inquiries */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Inquiries
            </span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <Layers size={16} />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display font-bold text-slate-900 font-mono">
              {metrics.totalThisMonth}
            </span>
            <span className="text-xs text-slate-400">active items</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Includes today's live web entries
          </div>
        </div>

        {/* Partnership Slot Meter */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Partnership Slots
            </span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <Users size={16} />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display font-bold text-slate-900 font-mono">
              {metrics.confirmedPartnersCount}/20
            </span>
            <span className="text-xs text-amber-700 font-medium">
              {metrics.partnershipSlotsRemaining} remaining
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
            <div 
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${(metrics.confirmedPartnersCount / 20) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Overall Conversion
            </span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <TrendingUp size={16} />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display font-bold text-slate-900 font-mono">
              {metrics.conversionRate}%
            </span>
            <span className="text-xs text-slate-400">confirmed queries</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Total queries marked as confirmed
          </div>
        </div>

        {/* Quick Service Breakdown Visual Bar */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Leads Breakdown
          </div>
          <div className="space-y-1.5">
            {(['fingerlings', 'pond', 'breeding', 'training'] as ServiceType[]).map(cat => {
              const count = metrics.serviceCounts[cat] || 0;
              const pct = metrics.totalThisMonth > 0 ? (count / metrics.totalThisMonth) * 100 : 0;
              return (
                <div key={cat} className="flex items-center gap-2 text-xs">
                  <span className="w-16 capitalize text-slate-600 text-[11px] truncate">{cat === 'breeding' ? 'Partner' : cat}</span>
                  <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        cat === 'fingerlings' ? 'bg-sky-500' :
                        cat === 'pond' ? 'bg-indigo-500' :
                        cat === 'breeding' ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                  <span className="font-mono text-[11px] font-semibold text-slate-800 w-4 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Warning Alert Banner for Overdue 48h Follow-ups */}
      {inquiries.some(isOverdue) && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-8 flex gap-3 items-start animate-pulse">
          <div className="p-1 bg-amber-100 text-amber-700 rounded-lg">
            <AlertTriangle size={18} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-amber-900">
              Pending Follow-up Action Required!
            </h4>
            <p className="text-xs text-amber-700 mt-0.5">
              Some inquiries have been sitting unaddressed for more than 48 hours. Please check and follow up with these customers on WhatsApp.
            </p>
          </div>
        </div>
      )}

      {/* Main Admin Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: List Filters & Search (Spans 4 columns on desktop) */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Search Box */}
          <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm space-y-3">
            <label htmlFor="admin-search-input" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Search Lead
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                <Search size={16} />
              </span>
              <input
                type="text"
                id="admin-search-input"
                placeholder="Name, phone, city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-500 font-sans"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')} 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Service Category Selector */}
          <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm space-y-3">
            <label htmlFor="service-filter-select" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Filter by Service
            </label>
            <div className="relative">
              <select
                id="service-filter-select"
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-500 bg-white"
              >
                <option value="all">All Services</option>
                <option value="fingerlings">🐟 Fingerlings Orders</option>
                <option value="pond">🏗️ Pond Construction</option>
                <option value="breeding">🤝 Breeding Contracts</option>
                <option value="training">📚 Training Course</option>
                <option value="general">💬 General Inquiries</option>
              </select>
            </div>
          </div>

          {/* Quick status tabs (styled as side navigation) */}
          <div className="bg-white border border-slate-100 rounded-2xl p-2 shadow-sm">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5">
              Status Views
            </div>
            
            <nav className="space-y-1">
              {[
                { id: 'all', label: 'All Inquiries', count: inquiries.length },
                { id: 'new_today', label: 'New Today (24h)', count: inquiries.filter(inq => new Date(inq.createdAt) >= oneDayAgo).length, highlight: true },
                { id: 'pending', label: 'Pending / Action', count: inquiries.filter(inq => inq.status === 'pending' || inq.status === 'new').length },
                { id: 'shortlisted', label: 'Shortlisted', count: inquiries.filter(inq => inq.status === 'shortlisted').length },
                { id: 'confirmed', label: 'Confirmed Partners', count: inquiries.filter(inq => inq.status === 'confirmed').length },
                { id: 'not_interested', label: 'Not Interested', count: inquiries.filter(inq => inq.status === 'not_interested').length },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {tab.label}
                    {tab.highlight && (
                      <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                    )}
                  </span>
                  <span className={`font-mono text-[10px] px-2 py-0.5 rounded-full ${
                    activeTab === tab.id ? 'bg-emerald-700 text-emerald-100' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

        </div>

        {/* Right Column: Inquiries List & Actions (Spans 9 columns on desktop) */}
        <div className="lg:col-span-9 space-y-4">
          
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold px-2">
            <span>Showing {filteredInquiries.length} leads matching filters</span>
            <span className="font-mono">Mt Hampden Server Clock</span>
          </div>

          <AnimatePresence mode="popLayout">
            {filteredInquiries.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white border border-slate-150 rounded-2xl p-12 text-center text-slate-500 font-sans shadow-sm"
              >
                <AlertCircle size={32} className="mx-auto text-slate-300 mb-3" />
                <h3 className="font-semibold text-slate-800 mb-1">No inquiries found</h3>
                <p className="text-xs">Try clearing search text or resetting the service category filters.</p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {filteredInquiries.map((inq) => {
                  const createdDate = new Date(inq.createdAt);
                  const isRecent = createdDate >= oneDayAgo;
                  const isActionOverdue = isOverdue(inq);

                  return (
                    <motion.div
                      key={inq.id}
                      layoutId={`inq-card-${inq.id}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`bg-white border rounded-2xl p-5 shadow-sm transition-all hover:border-slate-300 ${
                        isActionOverdue 
                          ? 'border-amber-200 bg-amber-50/10' 
                          : inq.priority === 'high' 
                            ? 'border-emerald-100/80 bg-emerald-50/5' 
                            : 'border-slate-100'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        
                        {/* Lead details summary */}
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base font-semibold text-slate-900 flex items-center gap-1.5">
                              {inq.name}
                              {inq.priority === 'high' && (
                                <span className="text-[9px] font-extrabold bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full flex items-center gap-0.5 tracking-wider">
                                  👑 PARTNER LEAD
                                </span>
                              )}
                            </h3>

                            <span className={`text-[10px] px-2 py-0.5 rounded border font-semibold ${getServiceColor(inq.serviceType)}`}>
                              {inq.serviceType.toUpperCase()}
                            </span>

                            {isRecent && (
                              <span className="text-[9px] font-bold bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded uppercase font-mono">
                                New Today
                              </span>
                            )}

                            {isActionOverdue && (
                              <span className="text-[9px] font-semibold bg-amber-600 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                                <AlertTriangle size={10} /> OVER 48H
                              </span>
                            )}
                          </div>

                          {/* Secondary info row */}
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                            <span className="flex items-center gap-1 font-mono">
                              <Phone size={12} className="text-slate-400" />
                              {inq.phone}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin size={12} className="text-slate-400" />
                              {inq.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={12} className="text-slate-400" />
                              {createdDate.toLocaleDateString()} {createdDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>

                          {/* Specific service parameters */}
                          <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-3 text-xs text-slate-700 font-sans mt-2 space-y-1">
                            {inq.serviceType === 'fingerlings' && (
                              <div>
                                <span className="font-semibold text-slate-800">Order:</span> {(inq.details as any).quantity.toLocaleString()} x {(inq.details as any).species} fingerlings. Delivery Requested: <span className="font-medium">{(inq.details as any).deliveryDate}</span>
                              </div>
                            )}
                            {inq.serviceType === 'pond' && (
                              <div>
                                <span className="font-semibold text-slate-800">Pond Size:</span> {(inq.details as any).size} | Available Land: <span className="font-medium">{(inq.details as any).landSizeAvailable}</span> | Budget: <span className="font-mono">{(inq.details as any).budgetRange}</span>
                              </div>
                            )}
                            {inq.serviceType === 'breeding' && (
                              <div className="space-y-1">
                                <div>
                                  <span className="font-semibold text-slate-800">Investment Target:</span> <span className="font-bold text-amber-800">{(inq.details as any).investmentCapacity}</span> | Reference: <span className="italic">{(inq.details as any).referralSource}</span>
                                </div>
                                {(inq.details as any).questions && (
                                  <div className="text-slate-500 italic mt-1 font-sans pl-2 border-l-2 border-slate-200">
                                    "{(inq.details as any).questions}"
                                  </div>
                                )}
                              </div>
                            )}
                            {inq.serviceType === 'training' && (
                              <div>
                                <span className="font-semibold text-slate-800">Attendees:</span> {(inq.details as any).attendeesCount} persons. Payment Ref: <span className="font-mono text-emerald-700">{(inq.details as any).paymentDetails || 'Pending'}</span>
                              </div>
                            )}
                            {inq.serviceType === 'general' && (
                              <div className="italic text-slate-600 pl-2 border-l-2 border-slate-200">
                                "{(inq.details as any).message}"
                              </div>
                            )}
                          </div>

                          {/* Internal Notes Display */}
                          {inq.notes ? (
                            <div className="text-xs text-slate-500 bg-emerald-50/30 border border-emerald-100/40 rounded-xl p-3 flex gap-2 items-start">
                              <FileText size={14} className="text-slate-400 mt-0.5" />
                              <div>
                                <span className="font-semibold text-slate-700">Admin Note:</span> {inq.notes}
                              </div>
                            </div>
                          ) : null}
                        </div>

                        {/* Actions block on right */}
                        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                          <div className="flex items-center gap-1.5">
                            {getStatusBadge(inq.status)}
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Status controls */}
                            <select
                              value={inq.status}
                              onChange={(e) => onUpdateStatus(inq.id, e.target.value as InquiryStatus)}
                              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-2.5 py-1.5 rounded-lg outline-none cursor-pointer border-none transition-all"
                            >
                              <option value="new">Mark New</option>
                              <option value="pending">Mark Pending</option>
                              <option value="shortlisted">Shortlist</option>
                              <option value="confirmed">Confirm Partner</option>
                              <option value="not_interested">Not Interested</option>
                            </select>

                            {/* WhatsApp follow-up link */}
                            <button
                              onClick={() => handleWhatsAppContact(inq)}
                              className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg cursor-pointer transition-colors shadow-sm flex items-center justify-center"
                              title="Direct WhatsApp follow-up"
                            >
                              <PhoneCall size={14} />
                            </button>

                            {/* Expand Notes Editor */}
                            <button
                              onClick={() => handleOpenNotes(inq)}
                              className="px-2.5 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold rounded-lg cursor-pointer transition-all"
                            >
                              Add Note
                            </button>
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Internal Notes Modal Overlay */}
      <AnimatePresence>
        {editingNotesId && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-150"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-display font-semibold text-slate-900">
                  Update Internal Admin Notes
                </h3>
                <button 
                  onClick={() => setEditingNotesId(null)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
                >
                  <X size={18} />
                </button>
              </div>

              <textarea
                rows={4}
                value={tempNotes}
                onChange={(e) => setTempNotes(e.target.value)}
                placeholder="Type internal notes (e.g. 'EcoCash payment cleared, scheduled pond delivery for Tuesday.')"
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:border-emerald-500 outline-none font-sans mb-6"
              />

              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setEditingNotesId(null)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSaveNotes(editingNotesId)}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl cursor-pointer shadow-md shadow-emerald-600/10"
                >
                  Save Internal Note
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
