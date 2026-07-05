import { Fish, Hammer, Handshake, BookOpen, MessageSquare } from 'lucide-react';
import { ServiceType } from '../../types';

interface ServiceSelectorProps {
  selectedService: ServiceType;
  onSelect: (service: ServiceType) => void;
}

const SERVICES: { type: ServiceType; label: string; subtitle: string; icon: typeof Fish }[] = [
  { type: 'fingerlings', label: 'Fingerlings', subtitle: '$50/1K', icon: Fish },
  { type: 'pond', label: 'Pond Construction', subtitle: 'From $702', icon: Hammer },
  { type: 'breeding', label: 'Breeding Contract', subtitle: '20 Slots Only', icon: Handshake },
  { type: 'training', label: 'Training Registration', subtitle: '$50/person', icon: BookOpen },
  { type: 'general', label: 'General Inquiry', subtitle: 'Feedback/Qns', icon: MessageSquare },
];

export default function ServiceSelector({ selectedService, onSelect }: ServiceSelectorProps) {
    return (
    <div className="mb-8">
      <h2 className="text-lg font-display font-semibold text-slate-800 mb-4">
        What do you need?
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {SERVICES.map(({ type, label, subtitle, icon: Icon }) => (
          <button
            key={type}
            type="button"
            onClick={() => onSelect(type)}
            className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all cursor-pointer relative ${
              selectedService === type
                ? 'border-brand-aqua bg-brand-aqua/10 text-brand-navy shadow-sm ring-1 ring-brand-aqua'
                : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'
            }`}
          >
            {type === 'breeding' && (
              <div className="absolute top-1 right-1">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-gold opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-gold" />
                </span>
              </div>
            )}
            <Icon className={`mb-2 ${selectedService === type ? 'text-brand-gold' : 'text-slate-400'}`} size={24} />
            <span className="font-display font-medium text-xs">{label}</span>
            <span className="text-[10px] text-slate-400 mt-1 font-mono">{subtitle}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
