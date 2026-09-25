import React, { useRef, useState } from 'react';
import {
  Upload,
  FileText,
  Image as ImageIcon,
  Sparkles,
  AlertCircle,
  FileCheck,
  ChevronDown,
  Layers,
} from 'lucide-react';
import { DEMO_DOCUMENTS, DemoDocumentPreset } from '../services/document/demoDocuments';

interface DocumentUploadAreaProps {
  onLoadDemo: (preset: DemoDocumentPreset) => void;
  onFileUpload: (file: File) => void;
  isProcessing: boolean;
  currentDocumentName?: string;
}

export const DocumentUploadArea: React.FC<DocumentUploadAreaProps> = ({
  onLoadDemo,
  onFileUpload,
  isProcessing,
  currentDocumentName,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showPresetsMenu, setShowPresetsMenu] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      onFileUpload(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      onFileUpload(file);
    }
  };

  const primaryDemo = DEMO_DOCUMENTS[0]; // Maya Sharma HP PC record

  return (
    <div className="space-y-4">
      {/* Upload Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all ${
          isDragging
            ? 'border-red-500 bg-red-50/50 dark:bg-red-950/20'
            : 'border-slate-300 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 hover:border-slate-400 dark:hover:border-slate-700'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,.txt"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center max-w-md mx-auto space-y-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-xs border border-slate-200 dark:border-slate-700">
            <Upload className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Upload Sensitive Document for Local Redaction
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Supports <span className="font-semibold text-slate-700 dark:text-slate-300">PDF, PNG, JPG</span>, or text files. All scanning occurs locally on your machine.
            </p>
          </div>

          {/* Action Buttons Row */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 shadow-xs transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              Choose File
            </button>

            {/* Primary Demo Load Button */}
            <div className="relative inline-flex items-center">
              <button
                type="button"
                onClick={() => onLoadDemo(primaryDemo)}
                disabled={isProcessing}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-l-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white shadow-xs transition-all cursor-pointer"
                title="Loads Maya Sharma HP PC Diagnostics Intake synthetic document"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Load Demo Document
              </button>
              <button
                type="button"
                onClick={() => setShowPresetsMenu(!showPresetsMenu)}
                className="px-2 py-2 text-xs font-semibold rounded-r-xl bg-amber-700 hover:bg-amber-600 text-white border-l border-amber-500 transition-colors cursor-pointer"
                title="Select other synthetic demo templates"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {/* Presets Dropdown */}
              {showPresetsMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowPresetsMenu(false)}
                  />
                  <div className="absolute top-full left-0 mt-1.5 w-72 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-20 py-1 text-left">
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Synthetic Demo Templates
                    </div>
                    {DEMO_DOCUMENTS.map((doc) => (
                      <button
                        key={doc.id}
                        type="button"
                        onClick={() => {
                          onLoadDemo(doc);
                          setShowPresetsMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex flex-col cursor-pointer"
                      >
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {doc.name}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {doc.description}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {currentDocumentName && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200/80 dark:bg-slate-800 text-[11px] text-slate-700 dark:text-slate-300">
              <FileCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Loaded: <strong className="font-semibold">{currentDocumentName}</strong></span>
            </div>
          )}
        </div>
      </div>

      {/* Synthetic Demo Disclaimer Badge */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-900 dark:text-amber-300">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span className="font-medium">
            <strong>SYNTHETIC DEMO DATA — NOT REAL PERSONAL INFORMATION</strong>: All demo records (Maya Sharma, etc.) are 100% fictional and generated exclusively for safe testing.
          </span>
        </div>
      </div>
    </div>
  );
};
