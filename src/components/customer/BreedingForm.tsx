import { Sparkles, Handshake } from 'lucide-react';

interface BreedingFormProps {
  investment: '$2,500' | '$5,000' | '$10,000+';
  breedingHubsCount: number;
  questions: string;
  referral: string;
  onInvestmentChange: (v: '$2,500' | '$5,000' | '$10,000+') => void;
  onHubsCountChange: (n: number) => void;
  onQuestionsChange: (q: string) => void;
  onReferralChange: (r: string) => void;
}

export default function BreedingForm({
  investment, breedingHubsCount, questions, referral,
  onInvestmentChange, onHubsCountChange, onQuestionsChange, onReferralChange,
}: BreedingFormProps) {
  return (
    <div className="space-y-6">
      <div className="bg-brand-navy text-brand-navy rounded-3xl p-6 border border-brand-navy shadow-xl relative overflow-hidden">
        <div className="absolute top-4 right-4 bg-brand-navy text-brand-navy text-[10px] font-bold px-3 py-1 rounded-full animate-pulse flex items-center gap-1 z-10">
          ONLY 20 PARTNERSHIP SLOTS AVAILABLE!
        </div>
        <div className="max-w-2xl relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-brand-gold tracking-wider uppercase bg-brand-navy/80 px-2.5 py-1 rounded-lg">
              Zimbabwe Commercial Breeding Program
            </span>
          </div>
          <h3 className="text-2xl md:text-4xl font-display font-extrabold tracking-tight text-brand-navy mb-2 leading-tight uppercase">
            TURN $2,500 INTO A FISH BREEDING BUSINESS
          </h3>
          <p className="text-base md:text-xl font-bold text-brand-gold mb-3 flex items-center gap-1.5">
            GENERATES UP TO <span className="text-brand-gold underline decoration-2">$1,400 USD</span> EVERY SINGLE MONTH!
          </p>
          <p className="text-xs text-slate-600 leading-relaxed">
            Join our fully managed Aquaculture Partnership Program. We construct, stock, and protect your ponds, and then <span className="font-bold text-brand-gold">buy back the fingerling output at $35 USD per 1,000</span> every 2 months of production. Setup must commence between <span className="text-brand-gold font-bold underline">June & July</span>.
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h4 className="font-display font-bold text-brand-navy text-sm flex items-center gap-2">
              <Sparkles size={16} className="text-amber-400 animate-spin" />
              Interactive Partnership ROI Planner
            </h4>
            <p className="text-xs text-slate-400">
              Configure your partnership scale to see your custom setup requirements and monthly returns.
            </p>
          </div>
          <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl flex items-center gap-2">
            <span className="text-xs text-slate-600 font-medium">Selected Hubs:</span>
            <span className="text-sm font-bold font-mono text-brand-gold bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200">
              {breedingHubsCount}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <span className="text-xs font-bold text-slate-400 font-mono">1 Hub</span>
          <input
            type="range"
            min="1"
            max="5"
            value={breedingHubsCount}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              onHubsCountChange(val);
              if (val === 1) onInvestmentChange('$2,500');
              else if (val === 2) onInvestmentChange('$5,000');
              else onInvestmentChange('$10,000+');
            }}
            className="flex-grow accent-brand-navy h-2 bg-slate-200 rounded-lg cursor-pointer"
          />
          <span className="text-xs font-bold text-slate-400 font-mono">5 Hubs</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: 'Total Investment', value: `$${(breedingHubsCount * 2500).toLocaleString()} USD`, color: 'text-red-400' },
            { label: 'Ponds to Build', value: `${breedingHubsCount * 4} (10m x 10m)`, color: 'text-slate-700' },
            { label: 'Breeding Stock', value: `${breedingHubsCount * 360} Breeders`, color: 'text-slate-700' },
            { label: 'Expected Output', value: `${(breedingHubsCount * 40000).toLocaleString()}+ / mo`, color: 'text-brand-gold' },
            { label: 'Monthly Return', value: `$${(breedingHubsCount * 1400).toLocaleString()} USD`, color: 'text-brand-gold' },
          ].map(({ label, value, color }) => (
            <div key={label} className={`bg-white p-3 rounded-2xl border border-slate-200 text-center ${label === 'Monthly Return' ? 'col-span-2 md:col-span-1' : ''}`}>
              <div className="text-[9px] uppercase font-bold text-slate-400 mb-1">{label}</div>
              <div className={`text-xs font-extrabold font-mono ${color}`}>{value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <SpecColumn
          title="BREEDING CONTRACT PACKAGE"
          color="bg-brand-navy"
          items={[
            `Pond Infrastructure: Construction of ${breedingHubsCount * 4} ponds (10x10m each) + ${breedingHubsCount * 4} Damliners 300micron UV-treated.`,
            `Breeding Stock: ${breedingHubsCount * 360} Selected premium breeding parents.`,
            `Pond Management: ${breedingHubsCount * 4} x 5L Antifungus treatment & ${breedingHubsCount * 4} x 5L Booster solution.`,
            `Nutrition & Predator Control: ${breedingHubsCount * 4} x 25kgs Broodstock feed & ${breedingHubsCount * 4} Birdnets.`,
          ]}
          footer={`Total Outlay: $${(breedingHubsCount * 2500).toLocaleString()} USD`}
          footerColor="text-red-400"
        />
        <SpecColumn
          title="EXPECTED OUTPUT & REVENUE"
          color="bg-brand-aqua"
          items={[
            { label: 'Expected Production', text: `Produces ${(breedingHubsCount * 40000).toLocaleString()}+ fingerlings per month for 6 months.` },
            { label: 'Guaranteed Buy-Back', text: 'We buy back output at $35 USD per every 1,000 fingerlings harvested every 2 months.' },
            { label: 'Revenue return', text: `Secures a regular $${(breedingHubsCount * 1400).toLocaleString()} USD monthly return.` },
          ]}
          footer={`Guaranteed Monthly Return: $${(breedingHubsCount * 1400).toLocaleString()} USD / mo`}
          footerColor="text-brand-gold"
        />
        <RequirementsColumn hubsCount={breedingHubsCount} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Investment Capacity
          </label>
          <select
            value={investment}
            onChange={(e) => onInvestmentChange(e.target.value as any)}
            className="glass-input"
          >
            <option className="bg-slate-900" value="$2,500">$2,500 (1 Breeding Hub)</option>
            <option className="bg-slate-900" value="$5,000">$5,000 (2 Breeding Hubs)</option>
            <option className="bg-slate-900" value="$10,000+">$10,000+ (Commercial Scale)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            How did you hear about us?
          </label>
          <select
            value={referral}
            onChange={(e) => onReferralChange(e.target.value)}
            className="glass-input"
          >
            <option className="bg-slate-900" value="Facebook">Facebook Page / Comments</option>
            <option className="bg-slate-900" value="WhatsApp">WhatsApp Group</option>
            <option className="bg-slate-900" value="Neighbor">Neighbor / Neighboring farmer</option>
            <option className="bg-slate-900" value="Other">Other Referral</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Contract Questions (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Can I use clay soil hapas?"
            value={questions}
            onChange={(e) => onQuestionsChange(e.target.value)}
            className="glass-input"
          />
        </div>
      </div>
    </div>
  );
}

function SpecColumn({ title, color, items, footer, footerColor }: {
  title: string; color: string; items: { label: string; text: string }[] | string[]; footer: string; footerColor: string;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 relative overflow-hidden flex flex-col justify-between shadow-sm backdrop-blur-md">
      <div className={`absolute top-0 left-0 right-0 h-1 ${color}`} />
      <div>
        <h4 className="font-display font-extrabold text-brand-navy text-xs uppercase tracking-wider mb-4 pb-2 border-b border-slate-200">
          {title}
        </h4>
        <ul className="space-y-3 text-xs text-slate-600">
          {items.map((item, i) => {
            if (typeof item === 'string') {
              return (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-brand-gold font-bold shrink-0 mt-0.5">&#10003;</span>
                  <span>{item}</span>
                </li>
              );
            }
            return (
              <li key={i}>
                <div className="font-semibold text-slate-700 mb-1">{item.label}</div>
                <div className="text-slate-400">{item.text}</div>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="mt-5 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-400 font-medium">
        <span>{footer.split(':')[0]}:</span>
        <span className={`font-bold font-mono ${footerColor}`}>{footer.split(':').slice(1).join(':').trim()}</span>
      </div>
    </div>
  );
}

function RequirementsColumn({ hubsCount }: { hubsCount: number }) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 relative overflow-hidden flex flex-col justify-between shadow-sm backdrop-blur-md">
      <div className="absolute top-0 left-0 right-0 h-1 bg-brand-gold" />
      <div>
        <h4 className="font-display font-extrabold text-brand-navy text-xs uppercase tracking-wider mb-4 pb-2 border-b border-slate-200">
          REQUIREMENTS CHECKLIST
        </h4>
        <div className="space-y-4">
          {[
            { icon: '🏞️', title: 'Land Available', desc: `Need secure area for ${hubsCount * 4} ponds of 10m x 10m each.` },
            { icon: '💧', title: 'Reliable Water Source', desc: 'Borehole, river, stream, or dam with continuous clean supply.' },
            { icon: '💰', title: 'Financial Investment', desc: `Capital starting at $${(hubsCount * 2500).toLocaleString()} USD to construct the hubs.` },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="flex gap-3 items-start">
              <div className="text-lg bg-slate-50 p-1.5 rounded-xl border border-slate-200 shrink-0">{icon}</div>
              <div>
                <div className="text-xs font-bold text-brand-navy">{title}</div>
                <div className="text-[11px] text-slate-400">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-5 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-400 font-medium">
        <span>Work Commencement:</span>
        <span className="font-bold text-slate-700 font-mono">June & July</span>
      </div>
    </div>
  );
}
