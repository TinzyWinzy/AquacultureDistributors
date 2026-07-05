import { ShoppingBag } from 'lucide-react';
import { PRODUCT_CATALOG } from '../../data';
import { ServiceType } from '../../types';

interface PricingCatalogProps {
  onSelectBreeding: () => void;
}

export default function PricingCatalog({ onSelectBreeding }: PricingCatalogProps) {
  return (
    <div className="w-full">
      <h3 className="text-xl font-display font-semibold text-brand-navy mb-6 flex items-center gap-2">
        <ShoppingBag size={20} className="text-brand-gold" />
        Products & Setup Reference Pricing
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PRODUCT_CATALOG.map((item) => (
          <div key={item.id} className="glass-card p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start gap-4 mb-3">
                <h4 className="font-display font-semibold text-brand-navy text-base">
                  {item.name}
                </h4>
                <span className="font-mono text-brand-gold font-bold text-xs bg-brand-aqua/10 border border-brand-aqua/20 px-2.5 py-1 rounded-lg shrink-0">
                  {item.price}
                </span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                {item.description}
              </p>
            </div>
            {item.category === 'partnership' && (
              <div className="mt-5 pt-4 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[10px] font-bold text-brand-gold bg-brand-gold/10 border border-brand-gold/20 px-2 py-0.5 rounded">
                  20 SLOTS MAX
                </span>
                <button
                  onClick={onSelectBreeding}
                  className="text-xs text-brand-gold hover:text-brand-navy font-semibold cursor-pointer transition-colors"
                >
                  Apply Now &rarr;
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
