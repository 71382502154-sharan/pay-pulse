import React, { useState } from 'react';
import { motion } from 'motion/react';
import { downloadBatchTemplateCSV } from '../utils/downloadUtils';

interface BatchUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const BatchUploadModal: React.FC<BatchUploadModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleUpload = () => {
    if (!selectedFile) {
      onShowToast('Please select or drop a spreadsheet file.');
      return;
    }
    onShowToast(`Processed ${selectedFile}: 48 adjustments applied across engineering and operations.`);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-[#131b2e]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#eaedff]"
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#eaedff]">
          <div>
            <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-base text-[#131b2e]">
              Batch Upload Adjustments
            </h3>
            <p className="text-xs text-[#45464f]">Import Excel (.xlsx) or CSV for monthly allowances, LOP, and bonuses</p>
          </div>
          <button onClick={onClose} className="text-[#767680] hover:text-[#131b2e]">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="py-4 space-y-4 text-xs">
          {/* Drag & Drop Area */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              if (e.dataTransfer.files?.[0]) {
                setSelectedFile(e.dataTransfer.files[0].name);
              }
            }}
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = '.csv,.xlsx,.xls';
              input.onchange = (e) => {
                const f = (e.target as HTMLInputElement).files?.[0];
                if (f) setSelectedFile(f.name);
              };
              input.click();
            }}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors flex flex-col items-center justify-center gap-2 ${
              dragOver ? 'border-[#006a63] bg-[#99efe5]/20' : 'border-[#c6c5d0] bg-[#faf8ff] hover:bg-[#f2f3ff]'
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-[#eaedff] flex items-center justify-center text-[#006a63]">
              <span className="material-symbols-outlined text-[1.75rem]">cloud_upload</span>
            </div>
            <div>
              <div className="font-semibold text-sm text-[#131b2e]">
                {selectedFile || 'Click or drag & drop payroll adjustments file'}
              </div>
              <div className="text-[0.6875rem] text-[#45464f] mt-0.5">
                Supports Standard PayPulse Schema (.xlsx, .csv, up to 25MB)
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-[#f2f3ff] text-[0.6875rem] text-[#45464f] border border-[#eaedff]">
            <span>Need sample format?</span>
            <button
              type="button"
              onClick={() => {
                downloadBatchTemplateCSV();
                onShowToast('Downloaded template: PayPulse_Adjustments_Template_v2.csv');
              }}
              className="text-[#006a63] font-semibold hover:underline flex items-center gap-1 active:scale-95"
            >
              <span className="material-symbols-outlined text-[0.875rem]">download</span>
              Download CSV Template
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-[#eaedff]">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-[#eaedff] text-[#131b2e] font-semibold text-xs">
            Cancel
          </button>
          <button
            onClick={handleUpload}
            className="px-4 py-2 rounded-lg bg-[#006a63] text-white font-semibold text-xs hover:bg-[#00504a]"
          >
            Validate &amp; Process
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
