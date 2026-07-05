import { Hammer, AlertCircle } from 'lucide-react';

interface PondFormProps {
  pondSize: '10x10' | '20x10' | '20x20' | '20x30' | 'Custom';
  landSize: string;
  budgetRange: string;
  errors: Record<string, string>;
  onPondSizeChange: (s: '10x10' | '20x10' | '20x20' | '20x30' | 'Custom') => void;
  onLandSizeChange: (s: string) => void;
  onBudgetChange: (b: string) => void;
}

export default function PondForm({
  pondSize, landSize, budgetRange, errors,
  onPondSizeChange, onLandSizeChange, onBudgetChange,
}: PondFormProps) {
  return (
    <div className="space-y-6">
      <div className="relative bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm backdrop-blur-sm">
        <div className="absolute inset-0 w-48">
          <img src="/images/pools.jpg" alt="Pond construction" className="w-full h-full object-cover opacity-10" />
        </div>
        <div className="relative p-5 flex flex-col md:flex-row gap-5 items-stretch">
          <div className="p-3 bg-brand-gold/20 text-brand-gold rounded-2xl flex items-center justify-center shrink-0 border border-brand-aqua/30">
            <Hammer size={40} className="drop-shadow-[0_0_10px_rgba(0,178,220,0.5)]" />
          </div>
          <div className="flex-grow">
            <h4 className="font-display font-bold text-brand-navy text-sm mb-1">
              Professional Pond Infrastructure Construction
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed mb-2">
              We handle complete site evaluation, high-performance earth excavation, specialized clay compaction, and premium 300micron UV-treated Damliner membranes for maximum water retention. Standard sizes range from 10m x 10m ($702) to 20m x 30m ($3,228).
            </p>
            <div className="flex flex-wrap gap-3 text-xs font-mono">
              <span className="bg-slate-50 text-brand-navy border border-slate-200 px-2.5 py-1 rounded-lg">300&mu; UV-Treated Liner</span>
              <span className="bg-slate-50 text-brand-navy border border-slate-200 px-2.5 py-1 rounded-lg">Inlet & Outlet Plumbing</span>
              <span className="bg-slate-50 text-brand-navy border border-slate-200 px-2.5 py-1 rounded-lg">Clay Seal Option</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Pond Size Desired
          </label>
          <select
            value={pondSize}
            onChange={(e) => onPondSizeChange(e.target.value as any)}
            className="glass-input"
          >
            <option className="bg-slate-900" value="10x10">10m x 10m ($702)</option>
            <option className="bg-slate-900" value="20x10">20m x 10m ($1,100)</option>
            <option className="bg-slate-900" value="20x20">20m x 20m ($2,200)</option>
            <option className="bg-slate-900" value="20x30">20m x 30m ($3,228)</option>
            <option className="bg-slate-900" value="Custom">Custom Dimensions</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Land Size Available <span className="text-brand-gold">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g., 0.5 Acres, backyard"
            value={landSize}
            onChange={(e) => onLandSizeChange(e.target.value)}
            className="glass-input"
          />
          {errors.landSize && (
            <span className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle size={10} /> {errors.landSize}</span>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Construction Budget Range
          </label>
          <select
            value={budgetRange}
            onChange={(e) => onBudgetChange(e.target.value)}
            className="glass-input"
          >
            <option className="bg-slate-900" value="Under $1,000">Under $1,000</option>
            <option className="bg-slate-900" value="$1,000 - $2,500">$1,000 - $2,500</option>
            <option className="bg-slate-900" value="$2,500 - $5,000">$2,500 - $5,000</option>
            <option className="bg-slate-900" value="$5,000+">$5,000+ (Commercial project)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
