import React from 'react';
import { AlertTriangle } from 'lucide-react';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, onDiscard, isSaving }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-[#2C4C3B]/10 scale-100">
        
        <div className="flex items-start gap-4">
          <div className="p-3 bg-yellow-50 text-yellow-600 rounded-full">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#2C4C3B]">{title}</h3>
            <p className="text-[#2C4C3B]/70 mt-2 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-end">
          {/* Cancel (Stay Here) */}
          <button 
            onClick={onCancel}
            className="px-4 py-2 text-[#2C4C3B] font-medium hover:bg-[#F3F0E7] rounded-lg transition-colors"
          >
            Cancel
          </button>

          {/* Discard (Leave without saving) */}
          <button 
            onClick={onDiscard}
            className="px-4 py-2 text-red-600 font-medium hover:bg-red-50 rounded-lg transition-colors"
          >
            Discard Changes
          </button>

          {/* Save & Leave */}
          <button 
            onClick={onConfirm}
            disabled={isSaving}
            className="px-6 py-2 bg-[#228B22] text-white font-medium rounded-lg hover:bg-[#1e7a1e]
             transition-colors shadow-lg shadow-green-900/10 flex items-center justify-center min-w-25"
          >
            {isSaving ? 'Saving...' : 'Save & Exit'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;