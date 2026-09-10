import React, { useState } from 'react';
import { WasteReport, WasteCategoryType } from '../../types/waste';
import { Check, X } from 'lucide-react';

interface SegregationConfirmModalProps {
  report: WasteReport;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (verifiedCategories: WasteCategoryType[], notes: string) => void;
}

export const SegregationConfirmModal: React.FC<SegregationConfirmModalProps> = ({
  report,
  isOpen,
  onClose,
  onConfirm
}) => {
  if (!isOpen) return null;

  const initialCategories = report.aiAnalysis.detectedWaste.map(c => c.category);
  const [confirmedCats, setConfirmedCats] = useState<WasteCategoryType[]>(initialCategories);
  const [notes, setNotes] = useState('Ground segregation verified according to municipal streams.');

  const toggleCategory = (cat: WasteCategoryType) => {
    if (confirmedCats.includes(cat)) {
      setConfirmedCats(confirmedCats.filter(c => c !== cat));
    } else {
      setConfirmedCats([...confirmedCats, cat]);
    }
  };

  const handleSubmit = () => {
    onConfirm(confirmedCats, notes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900">Confirm Segregation</h3>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-600 block">Verified Categories:</label>
          <div className="flex flex-wrap gap-2">
            {report.aiAnalysis.detectedWaste.map(item => {
              const isChecked = confirmedCats.includes(item.category);
              return (
                <button
                  key={item.category}
                  type="button"
                  onClick={() => toggleCategory(item.category)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center space-x-1.5 ${
                    isChecked
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  {isChecked && <Check className="w-3.5 h-3.5" />}
                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-600 block mb-1">Worker Notes:</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full text-xs p-2.5 border border-slate-200 rounded-xl"
          />
        </div>

        <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow"
          >
            Save Confirmation
          </button>
        </div>
      </div>
    </div>
  );
};
