import { CheckCircle2 } from 'lucide-react';
import { ServiceType } from '../../types';

interface SuccessViewProps {
  lastSubmittedId: string;
  selectedService: ServiceType;
  name: string;
  onReset: () => void;
}

const serviceLabels: Record<ServiceType, string> = {
  fingerlings: 'Tilapia / Catfish Fingerlings',
  pond: 'Pond Construction',
  breeding: 'Partnership (Breeding Contract)',
  training: 'Training Registration',
  general: 'General Inquiry',
};

export default function SuccessView({ lastSubmittedId, selectedService, name, onReset }: SuccessViewProps) {
  return (
    <div className="glass-panel p-8 text-center max-w-xl mx-auto">
      <div className="inline-flex p-4 rounded-full bg-brand-aqua/10 text-brand-gold mb-6 border border-brand-aqua/20">
        <CheckCircle2 size={48} className="animate-bounce drop-shadow-[0_0_10px_rgba(0,178,220,0.5)]" />
      </div>

      <h2 className="text-2xl md:text-3xl font-display font-bold text-brand-navy mb-2">
        Submission Received!
      </h2>
      <p className="text-brand-gold font-semibold text-sm mb-6">
        Your ticket reference is #{lastSubmittedId}
      </p>

      <div className="bg-white rounded-2xl p-5 mb-8 border border-slate-200 text-left text-sm text-slate-600 backdrop-blur-sm">
        <div className="flex gap-3 mb-3">
          <span className="font-semibold text-slate-400 min-w-20 uppercase text-xs tracking-wider">Service:</span>
          <span className="text-brand-navy font-medium">{serviceLabels[selectedService]}</span>
        </div>
        <div className="flex gap-3 mb-3">
          <span className="font-semibold text-slate-400 min-w-20 uppercase text-xs tracking-wider">Name:</span>
          <span className="text-brand-navy font-medium">{name}</span>
        </div>
        <div className="flex gap-3">
          <span className="font-semibold text-slate-400 min-w-20 uppercase text-xs tracking-wider">Next Step:</span>
          <span className="text-brand-navy font-medium">
            Our Mt Hampden team is notified. Expect a direct WhatsApp within 24 hours.
          </span>
        </div>
      </div>

      <p className="text-xs text-slate-400 mb-8 leading-relaxed">
        Aquaculture Distributors - Mt Hampden Farm, Harare. We Hatch to Feed.
      </p>

      <button
        type="button"
        onClick={onReset}
        className="px-6 py-3 bg-white border border-slate-200 hover:bg-slate-50 hover:border-brand-gold/30 text-brand-navy font-display font-medium rounded-xl cursor-pointer text-sm transition-all inline-flex items-center gap-2 shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
      >
        Submit Another Inquiry
      </button>
    </div>
  );
}
