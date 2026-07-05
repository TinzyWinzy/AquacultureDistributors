import { Search, X } from 'lucide-react';
import { ServiceType } from '../../types';

type TabType = 'all' | 'new_today' | 'pending' | 'shortlisted' | 'confirmed' | 'not_interested';

interface FilterSidebarProps {
  searchTerm: string;
  serviceFilter: ServiceType | 'all';
  activeTab: TabType;
  counts: { all: number; new_today: number; pending: number; shortlisted: number; confirmed: number; not_interested: number };
  onSearchChange: (s: string) => void;
  onServiceFilterChange: (f: ServiceType | 'all') => void;
  onTabChange: (t: TabType) => void;
}

const tabs: { id: TabType; label: string; highlight?: boolean }[] = [
  { id: 'all', label: 'All Inquiries' },
  { id: 'new_today', label: 'New Today (24h)', highlight: true },
  { id: 'pending', label: 'Pending / Action' },
  { id: 'shortlisted', label: 'Shortlisted' },
  { id: 'confirmed', label: 'Confirmed Partners' },
  { id: 'not_interested', label: 'Not Interested' },
];

export default function FilterSidebar({
  searchTerm, serviceFilter, activeTab, counts,
  onSearchChange, onServiceFilterChange, onTabChange,
}: FilterSidebarProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm space-y-3">
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Search Lead</label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Name, phone, city..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-brand-aqua font-sans"
          />
          {searchTerm && (
            <button onClick={() => onSearchChange('')} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm space-y-3">
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Filter by Service</label>
        <select
          value={serviceFilter}
          onChange={(e) => onServiceFilterChange(e.target.value as any)}
          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-brand-aqua bg-white"
        >
          <option value="all">All Services</option>
          <option value="fingerlings">Fingerlings Orders</option>
          <option value="pond">Pond Construction</option>
          <option value="breeding">Breeding Contracts</option>
          <option value="training">Training Course</option>
          <option value="general">General Inquiries</option>
        </select>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl p-2 shadow-sm">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2.5">Status Views</div>
        <nav className="space-y-1">
          {tabs.map(({ id, label, highlight }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl transition-all cursor-pointer ${
                activeTab === id
                  ? 'bg-brand-navy text-white shadow-sm font-semibold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-1.5">
                {label}
                {highlight && <span className="w-1.5 h-1.5 bg-rose-500 rounded-full" />}
              </span>
              <span className={`font-mono text-[10px] px-2 py-0.5 rounded-full ${
                activeTab === id ? 'bg-brand-navy text-white' : 'bg-slate-100 text-slate-500'
              }`}>
                {counts[id]}
              </span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
