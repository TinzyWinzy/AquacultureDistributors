import { InquiryStatus } from '../../types';

const styles: Record<InquiryStatus, string> = {
  new: 'bg-blue-100 text-blue-800 border border-blue-200',
  pending: 'bg-brand-gold/10 text-brand-gold border border-brand-gold/20',
  shortlisted: 'bg-purple-100 text-purple-800 border border-purple-200',
  confirmed: 'bg-brand-aqua/10 text-brand-aqua border border-brand-aqua/20',
  not_interested: 'bg-slate-100 text-slate-500 border border-slate-200',
};

export default function StatusBadge({ status }: { status: InquiryStatus }) {
  return (
    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${styles[status]}`}>
      {status === 'not_interested' ? 'Not Interested' : status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
