import React from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, onDiscard, isSaving }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      
      {/* Modal Card */}
      <div className="bg-white rounded-4xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] max-w-md w-full p-8 border border-stone-100 animate-fade-in-up" style={{ animationDuration: '0.3s' }}>
        
        {/* Content */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5">
          <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl shrink-0">
            <AlertTriangle size={28} />
          </div>
          <div className="pt-1">
            <h3 className="text-xl font-bold text-stone-800 tracking-tight">{title}</h3>
            <p className="text-stone-500 mt-2 leading-relaxed font-light text-sm">
              {message}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
          
          {/* Cancel (Stay Here) */}
          <button 
            onClick={onCancel}
            disabled={isSaving}
            className="px-5 py-3 text-stone-500 font-medium hover:bg-stone-50 hover:text-stone-800 rounded-full transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>

          {/* Discard (Leave without saving) */}
          <button 
            onClick={onDiscard}
            disabled={isSaving}
            className="px-5 py-3 text-red-600 font-medium hover:bg-red-50 rounded-full transition-colors cursor-pointer disabled:opacity-50"
          >
            Discard Changes
          </button>

          {/* Save & Leave */}
          <button 
            onClick={onConfirm}
            disabled={isSaving}
            className="px-6 py-3 bg-emerald-600 text-white font-medium rounded-full hover:bg-emerald-700
             transition-all shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.23)] hover:-translate-y-0.5 flex items-center justify-center min-w-30 cursor-pointer disabled:opacity-70 disabled:transform-none"
          >
            {isSaving ? (
                <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                </>
            ) : 'Save & Exit'}
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default ConfirmModal;