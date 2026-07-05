import { BookOpen } from 'lucide-react';

interface TrainingFormProps {
  attendees: string;
  paymentRef: string;
  errors: Record<string, string>;
  onAttendeesChange: (a: string) => void;
  onPaymentRefChange: (p: string) => void;
}

export default function TrainingForm({
  attendees, paymentRef, errors,
  onAttendeesChange, onPaymentRefChange,
}: TrainingFormProps) {
  const cost = (Math.max(1, parseInt(attendees) || 0) * 50).toFixed(2);

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row gap-5 items-stretch backdrop-blur-sm">
        <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center border border-amber-500/30">
          <BookOpen size={40} className="drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
        </div>
        <div className="flex-grow">
          <h4 className="font-display font-bold text-brand-navy text-sm mb-1">
            Hands-On Aquaculture Masterclass
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed mb-2">
            Join our full-day intensive masterclass training at Mt Hampden Farm, Harare. Includes comprehensive lessons in water quality management, feed schedules, hatchery management, and biosecurity protocols. Registration of $50 per person includes high-quality materials and farm lunch.
          </p>
          <div className="flex flex-wrap gap-3 text-xs font-mono">
            <span className="bg-slate-50 text-brand-gold border border-brand-gold/30 px-2.5 py-1 rounded-lg">Practical Pond Exercises</span>
            <span className="bg-slate-50 text-brand-gold border border-brand-gold/30 px-2.5 py-1 rounded-lg">Manuals & Lunch Included</span>
            <span className="bg-slate-50 text-brand-gold border border-brand-gold/30 px-2.5 py-1 rounded-lg">EcoCash Payments Accepted</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Number of Attendees <span className="text-brand-gold">*</span>
          </label>
          <input
            type="number"
            min="1"
            max="20"
            value={attendees}
            onChange={(e) => onAttendeesChange(e.target.value)}
            className="glass-input"
          />
          <p className="text-[10px] text-slate-400 mt-2">
            Registration Cost: <span className="font-bold text-brand-gold font-mono text-xs">${cost}</span>
          </p>
          {errors.attendees && (
            <span className="text-xs text-red-500 mt-1">{errors.attendees}</span>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Payment Confirmation Ref (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. EcoCash Ref or Bank Transfer ID"
            value={paymentRef}
            onChange={(e) => onPaymentRefChange(e.target.value)}
            className="glass-input"
          />
        </div>
      </div>
    </div>
  );
}
