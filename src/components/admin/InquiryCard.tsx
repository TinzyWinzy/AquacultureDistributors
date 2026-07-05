import React from 'react';
import { Phone, MapPin, Clock, FileText, AlertTriangle, PhoneCall } from 'lucide-react';
import { Inquiry, InquiryStatus, ServiceType } from '../../types';
import StatusBadge from './StatusBadge';

interface InquiryCardProps {
  inquiry: Inquiry;
  oneDayAgo: Date;
  twoDaysAgo: Date;
  onUpdateStatus: (id: string, status: InquiryStatus) => void;
  onOpenNotes: (inq: Inquiry) => void;
  onWhatsAppContact: (inq: Inquiry) => void;
}

const serviceColors: Record<ServiceType, string> = {
  fingerlings: 'bg-sky-50 text-sky-800 border-sky-100',
  pond: 'bg-indigo-50 text-indigo-800 border-indigo-100',
  breeding: 'bg-brand-gold/10 text-brand-gold border-brand-gold/20',
  training: 'bg-brand-aqua/10 text-brand-aqua border-brand-aqua/20',
  general: 'bg-slate-50 text-slate-800 border-slate-100',
};

export default function InquiryCard({ inquiry, oneDayAgo, twoDaysAgo, onUpdateStatus, onOpenNotes, onWhatsAppContact }: InquiryCardProps) {
  const createdDate = new Date(inquiry.createdAt);
  const isRecent = createdDate >= oneDayAgo;
  const isOverdue = createdDate < twoDaysAgo && (inquiry.status === 'new' || inquiry.status === 'pending');

  const details = inquiry.details as any;

  return (
    <div className={`bg-white border rounded-2xl p-5 shadow-sm transition-all hover:border-slate-300 ${
      isOverdue ? 'border-amber-200 bg-amber-50/10' : inquiry.priority === 'high' ? 'border-emerald-100/80 bg-emerald-50/5' : 'border-slate-100'
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-2 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-slate-900 flex items-center gap-1.5">
              {inquiry.name}
              {inquiry.priority === 'high' && (
                <span className="text-[9px] font-extrabold bg-brand-gold text-white px-2 py-0.5 rounded-full">PARTNER LEAD</span>
              )}
            </h3>
            <span className={`text-[10px] px-2 py-0.5 rounded border font-semibold ${serviceColors[inquiry.serviceType]}`}>
              {inquiry.serviceType.toUpperCase()}
            </span>
            {isRecent && <span className="text-[9px] font-bold bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded uppercase font-mono">New Today</span>}
              {isOverdue && (
                <span className="text-[9px] font-semibold bg-brand-gold text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                <AlertTriangle size={10} /> OVER 48H
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
            <span className="flex items-center gap-1 font-mono"><Phone size={12} className="text-slate-400" />{inquiry.phone}</span>
            <span className="flex items-center gap-1"><MapPin size={12} className="text-slate-400" />{inquiry.location}</span>
            <span className="flex items-center gap-1">
              <Clock size={12} className="text-slate-400" />
              {createdDate.toLocaleDateString()} {createdDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-3 text-xs text-slate-700 mt-2 space-y-1">
            {inquiry.serviceType === 'fingerlings' && (
              <div><span className="font-semibold text-slate-800">Order:</span> {details.quantity.toLocaleString()} x {details.species} fingerlings. Delivery: <span className="font-medium">{details.deliveryDate}</span></div>
            )}
            {inquiry.serviceType === 'pond' && (
              <div><span className="font-semibold text-slate-800">Pond Size:</span> {details.size} | Land: <span className="font-medium">{details.landSizeAvailable}</span> | Budget: <span className="font-mono">{details.budgetRange}</span></div>
            )}
            {inquiry.serviceType === 'breeding' && (
              <div className="space-y-1">
                <div><span className="font-semibold text-slate-800">Investment:</span> <span className="font-bold text-amber-800">{details.investmentCapacity}</span> | Source: <span className="italic">{details.referralSource}</span></div>
                {details.questions && <div className="text-slate-500 italic mt-1 pl-2 border-l-2 border-slate-200">"{details.questions}"</div>}
              </div>
            )}
            {inquiry.serviceType === 'training' && (
              <div><span className="font-semibold text-slate-800">Attendees:</span> {details.attendeesCount} persons. Payment: <span className="font-mono text-emerald-700">{details.paymentDetails || 'Pending'}</span></div>
            )}
            {inquiry.serviceType === 'general' && (
              <div className="italic text-slate-600 pl-2 border-l-2 border-slate-200">"{details.message}"</div>
            )}
          </div>

          {inquiry.notes && (
            <div className="text-xs text-slate-500 bg-emerald-50/30 border border-emerald-100/40 rounded-xl p-3 flex gap-2 items-start">
              <FileText size={14} className="text-slate-400 mt-0.5 shrink-0" />
              <div><span className="font-semibold text-slate-700">Admin Note:</span> {inquiry.notes}</div>
            </div>
          )}
        </div>

        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          <StatusBadge status={inquiry.status} />
          <div className="flex items-center gap-2">
            <select
              value={inquiry.status}
              onChange={(e) => onUpdateStatus(inquiry.id, e.target.value as InquiryStatus)}
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-2.5 py-1.5 rounded-lg outline-none cursor-pointer border-none transition-all"
            >
              <option value="new">Mark New</option>
              <option value="pending">Mark Pending</option>
              <option value="shortlisted">Shortlist</option>
              <option value="confirmed">Confirm Partner</option>
              <option value="not_interested">Not Interested</option>
            </select>
            <button
              onClick={() => onWhatsAppContact(inquiry)}
              className="p-1.5 bg-brand-navy hover:bg-brand-navy/90 text-white rounded-lg cursor-pointer transition-colors shadow-sm"
              title="Direct WhatsApp follow-up"
            >
              <PhoneCall size={14} />
            </button>
            <button
              onClick={() => onOpenNotes(inquiry)}
              className="px-2.5 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold rounded-lg cursor-pointer transition-all"
            >
              Add Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
