import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface NotesModalProps {
  editingNotesId: string | null;
  tempNotes: string;
  onTempNotesChange: (n: string) => void;
  onSave: () => void;
  onClose: () => void;
}

export default function NotesModal({ editingNotesId, tempNotes, onTempNotesChange, onSave, onClose }: NotesModalProps) {
  return (
    <AnimatePresence>
      {editingNotesId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-150"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-display font-semibold text-slate-900">Update Internal Admin Notes</h3>
              <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 cursor-pointer">
                <X size={18} />
              </button>
            </div>
            <textarea
              rows={4}
              value={tempNotes}
              onChange={(e) => onTempNotesChange(e.target.value)}
              placeholder="Type internal notes (e.g. 'EcoCash payment cleared, scheduled pond delivery for Tuesday.')"
              className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:border-brand-aqua outline-none font-sans mb-6"
            />
            <div className="flex items-center justify-end gap-3">
              <button onClick={onClose} className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-semibold rounded-xl cursor-pointer">
                Cancel
              </button>
              <button onClick={onSave} className="px-5 py-2 bg-brand-navy hover:bg-brand-navy/90 text-white text-sm font-semibold rounded-xl cursor-pointer shadow-md shadow-brand-navy/10">
                Save Internal Note
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
