import { Fish, Calendar, AlertCircle } from 'lucide-react';

interface FingerlingsFormProps {
  species: 'Tilapia' | 'Catfish';
  quantity: string;
  deliveryDate: string;
  errors: Record<string, string>;
  onSpeciesChange: (s: 'Tilapia' | 'Catfish') => void;
  onQuantityChange: (q: string) => void;
  onDeliveryDateChange: (d: string) => void;
}

export default function FingerlingsForm({
  species, quantity, deliveryDate, errors,
  onSpeciesChange, onQuantityChange, onDeliveryDateChange,
}: FingerlingsFormProps) {
  const pricePerThousand = species === 'Tilapia' ? 50 : 70;
  const estimatedCost = ((Math.max(1000, parseInt(quantity) || 0) / 1000) * pricePerThousand).toFixed(2);

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row gap-5 items-stretch backdrop-blur-sm">
        <div className="p-3 bg-brand-gold/20 text-brand-gold rounded-2xl flex items-center justify-center border border-brand-aqua/30">
          <Fish size={40} className="animate-pulse drop-shadow-[0_0_10px_rgba(0,178,220,0.5)]" />
        </div>
        <div className="flex-grow">
          <h4 className="font-display font-bold text-brand-navy text-sm mb-1">
            Sex-Reversed GIFT Tilapia & Resilient Catfish
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed mb-2">
            Our fingerlings complete a 40-day intensive nursery grow-out phase at our Mt Hampden farm. GIFT strain guarantees exceptional food conversion and rapid growth rates in standard Zimbabwean climate conditions.
          </p>
          <div className="flex flex-wrap gap-4 text-xs font-mono">
            <span className="bg-slate-50 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-lg">Tilapia: $50 / 1,000</span>
            <span className="bg-slate-50 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-lg">Catfish: $70 / 1,000</span>
            <span className="bg-brand-gold/20 text-brand-gold font-bold border border-brand-aqua/30 px-2.5 py-1 rounded-lg">GIFT Sex-Reversed Stock</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Species Selection
          </label>
          <div className="flex gap-3">
            {(['Tilapia', 'Catfish'] as const).map(s => (
              <label key={s} className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border border-slate-200 bg-white cursor-pointer hover:bg-slate-50 transition-all select-none backdrop-blur-sm">
                <input
                  type="radio"
                  name="species"
                  checked={species === s}
                  onChange={() => onSpeciesChange(s)}
                  className="accent-brand-aqua h-4 w-4"
                />
                <span className="text-sm font-medium text-brand-navy">{s}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Quantity Required
          </label>
          <div className="relative">
            <input
              type="number"
              min="1000"
              step="1000"
              value={quantity}
              onChange={(e) => onQuantityChange(e.target.value)}
              className="glass-input pl-4 pr-16"
            />
            <span className="absolute inset-y-0 right-4 flex items-center text-xs font-semibold text-slate-400">units</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-2">
            Estimated cost: <span className="font-bold text-brand-gold font-mono text-xs">${estimatedCost}</span>
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Preferred Delivery Date <span className="text-brand-gold">*</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none z-10">
              <Calendar size={16} />
            </span>
            <input
              type="date"
              value={deliveryDate}
              onChange={(e) => onDeliveryDateChange(e.target.value)}
              className="glass-input pl-10"
            />
          </div>
          {errors.deliveryDate && (
            <span className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle size={10} /> {errors.deliveryDate}</span>
          )}
        </div>
      </div>
    </div>
  );
}
