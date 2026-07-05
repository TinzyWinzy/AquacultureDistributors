import { MessageSquare, AlertCircle } from 'lucide-react';

interface GeneralFormProps {
  message: string;
  errors: Record<string, string>;
  onMessageChange: (m: string) => void;
}

export default function GeneralForm({ message, errors, onMessageChange }: GeneralFormProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row gap-5 items-stretch backdrop-blur-sm">
        <div className="p-3 bg-purple-500/20 text-purple-400 rounded-2xl flex items-center justify-center border border-purple-500/30">
          <MessageSquare size={40} className="drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
        </div>
        <div className="flex-grow">
          <h4 className="font-display font-bold text-brand-navy text-sm mb-1">
            Direct Inquiries & Technical Consultation
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed mb-2">
            Need custom pond sizes, specialized transport for catfish breeders, bulk feed deliveries, or a tailored site evaluation? Send us an inquiry, and our professional aquaculture experts will follow up directly via WhatsApp.
          </p>
          <div className="flex flex-wrap gap-3 text-xs font-mono">
            <span className="bg-slate-50 text-brand-navy border border-slate-200 px-2.5 py-1 rounded-lg">WhatsApp Reply &lt; 24h</span>
            <span className="bg-slate-50 text-brand-navy border border-slate-200 px-2.5 py-1 rounded-lg">Custom Commercial Quotes</span>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Inquiry Message <span className="text-brand-gold">*</span>
        </label>
        <textarea
          rows={3}
          placeholder="Type your message about breeding stocks, hapas, nets or general advice..."
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          className="glass-input resize-y"
        />
        {errors.message && (
          <span className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle size={10} /> {errors.message}</span>
        )}
      </div>
    </div>
  );
}
