import { Layers, Users, TrendingUp } from 'lucide-react';
import { ServiceType } from '../../types';

interface Metrics {
  totalThisMonth: number;
  confirmedPartnersCount: number;
  partnershipSlotsRemaining: number;
  conversionRate: number;
  serviceCounts: Record<ServiceType, number>;
}

export default function MetricsGrid({ metrics }: { metrics: Metrics }) {
  const serviceCategories: { key: ServiceType; label: string; color: string }[] = [
    { key: 'fingerlings', label: 'Seed', color: 'bg-sky-500' },
    { key: 'pond', label: 'Pond', color: 'bg-indigo-500' },
                    { key: 'breeding', label: 'Partner', color: 'bg-brand-gold' },
    { key: 'training', label: 'Train', color: 'bg-emerald-500' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Inquiries</span>
          <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600"><Layers size={16} /></span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-display font-bold text-slate-900 font-mono">{metrics.totalThisMonth}</span>
          <span className="text-xs text-slate-400">active items</span>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Partnership Slots</span>
          <span className="p-1.5 rounded-lg bg-brand-gold/10 text-brand-gold"><Users size={16} /></span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-display font-bold text-slate-900 font-mono">{metrics.confirmedPartnersCount}/20</span>
          <span className="text-xs text-brand-gold font-medium">{metrics.partnershipSlotsRemaining} remaining</span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
          <div className="bg-brand-gold h-full rounded-full transition-all duration-500" style={{ width: `${(metrics.confirmedPartnersCount / 20) * 100}%` }} />
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Overall Conversion</span>
          <span className="p-1.5 rounded-lg bg-brand-aqua/10 text-brand-aqua"><TrendingUp size={16} /></span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-display font-bold text-slate-900 font-mono">{metrics.conversionRate}%</span>
          <span className="text-xs text-slate-400">confirmed queries</span>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Leads Breakdown</div>
        <div className="space-y-1.5">
          {serviceCategories.map(({ key, label, color }) => {
            const count = metrics.serviceCounts[key] || 0;
            const pct = metrics.totalThisMonth > 0 ? (count / metrics.totalThisMonth) * 100 : 0;
            return (
              <div key={key} className="flex items-center gap-2 text-xs">
                <span className="w-12 text-slate-600 text-[11px] truncate">{label}</span>
                <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
                </div>
                <span className="font-mono text-[11px] font-semibold text-slate-800 w-4 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
