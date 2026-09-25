import React, { useState } from 'react';
import {
  EyeOff,
  RotateCcw,
  CheckCheck,
  Copy,
  Download,
  Check,
  Sparkles,
  SlidersHorizontal,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import { PIIEntity, PIIEntityType } from '../types';

interface DocumentPreviewProps {
  originalText: string;
  sanitizedText: string;
  entities: PIIEntity[];
  onRedactAll: () => void;
  onRedactSelected: () => void;
  onRestorePreview: () => void;
  hasSelected: boolean;
  onRedactSingle: (id: string) => void;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  originalText,
  sanitizedText,
  entities,
  onRedactAll,
  onRedactSelected,
  onRestorePreview,
  hasSelected,
  onRedactSingle,
}) => {
  const [viewMode, setViewMode] = useState<'highlight' | 'redacted'>('highlight');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    // Privacy safeguard: If redactions are active or in redacted view, always copy sanitized text
    const textToCopy = viewMode === 'redacted' || redactedCount > 0 ? sanitizedText : originalText;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([sanitizedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `snapshield-redacted-doc-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const totalEntities = entities.length;
  const redactedCount = entities.filter((e) => e.status === 'redacted').length;

  /**
   * Render original text with highlighted sensitive spans
   */
  const renderHighlightedText = () => {
    if (entities.length === 0) {
      return <span>{originalText}</span>;
    }

    // Sort entities ascending
    const sorted = [...entities].sort((a, b) => a.startIndex - b.startIndex);
    const elements: React.ReactNode[] = [];
    let lastIndex = 0;

    sorted.forEach((entity, idx) => {
      // Non-sensitive prefix text
      if (entity.startIndex > lastIndex) {
        elements.push(
          <span key={`text-${idx}`}>{originalText.slice(lastIndex, entity.startIndex)}</span>,
        );
      }

      // Highlighted entity
      const isRedacted = entity.status === 'redacted';
      const isIgnored = entity.status === 'ignored';

      let bgClass = 'bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-100 border-b-2 border-amber-500';
      if (isRedacted) {
        bgClass = 'bg-emerald-200 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 border-b-2 border-emerald-500';
      } else if (isIgnored) {
        bgClass = 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300';
      }

      elements.push(
        <button
          key={`entity-${entity.id}`}
          type="button"
          onClick={() => onRedactSingle(entity.id)}
          className={`relative group inline-flex items-baseline px-1 py-0.5 rounded-sm font-medium transition-colors text-left cursor-pointer hover:ring-1 hover:ring-offset-1 hover:ring-slate-400 ${bgClass}`}
          title={`Click to ${isRedacted ? 'restore' : 'redact'} this entity`}
        >
          {isRedacted ? (
            <span className="font-mono font-bold tracking-wider text-[11px]">
              {entity.replacementText || '[REDACTED]'}
            </span>
          ) : (
            <span>{entity.rawValue}</span>
          )}

          {/* Quick Hover Tooltip */}
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:flex flex-col items-center z-30 pointer-events-none">
            <span className="bg-slate-950 text-white text-[10px] px-2 py-1 rounded-md shadow-lg whitespace-nowrap border border-slate-700">
              <span className="font-bold">{entity.label}</span>
              <span className="text-slate-400"> ({entity.confidence}%)</span>
              <span className="block text-slate-300">
                Status: {entity.status} • Click to {isRedacted ? 'Restore' : 'Redact'}
              </span>
            </span>
            <span className="w-1.5 h-1.5 bg-slate-950 rotate-45 -mt-1 border-r border-b border-slate-700" />
          </span>
        </button>,
      );

      lastIndex = entity.endIndex;
    });

    if (lastIndex < originalText.length) {
      elements.push(
        <span key="text-end">{originalText.slice(lastIndex)}</span>,
      );
    }

    return elements;
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs overflow-hidden flex flex-col">
      {/* Top Toolbar */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-950/40">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Document Preview
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {redactedCount} of {totalEntities} sensitive regions redacted
            </p>
          </div>
        </div>

        {/* Action Controls Required by Prompt */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Redact All Button */}
          <button
            onClick={onRedactAll}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-600 hover:bg-red-500 text-white shadow-xs transition-colors cursor-pointer"
            title="Redacts all detected sensitive entities into [REDACTED]"
          >
            <EyeOff className="w-3.5 h-3.5" />
            Redact All
          </button>

          {/* Redact Selected Button */}
          <button
            onClick={onRedactSelected}
            disabled={!hasSelected}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
              hasSelected
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700 hover:bg-slate-50'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-transparent cursor-not-allowed'
            }`}
            title="Redacts only entities selected in the table"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Redact Selected
          </button>

          {/* Restore Preview Button */}
          <button
            onClick={onRestorePreview}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            title="Restores original document preview state"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restore Preview
          </button>
        </div>
      </div>

      {/* Sub-toolbar: View modes & Copy/Export */}
      <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="inline-flex rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5">
          <button
            onClick={() => setViewMode('highlight')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              viewMode === 'highlight'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs font-semibold'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Interactive Highlight View
          </button>
          <button
            onClick={() => setViewMode('redacted')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              viewMode === 'redacted'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs font-semibold'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Privacy-Safe Redacted Output
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Copy current document text"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Text</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Download sanitized text document"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Clean Doc</span>
          </button>
        </div>
      </div>

      {/* Document Content Display */}
      <div className="p-6 bg-slate-50/30 dark:bg-slate-950/30 font-mono text-xs text-slate-800 dark:text-slate-200 leading-relaxed overflow-x-auto whitespace-pre-wrap select-text max-h-[520px] overflow-y-auto">
        {viewMode === 'highlight' ? renderHighlightedText() : sanitizedText}
      </div>

      {/* Legend Footer */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-[11px] text-slate-500 dark:text-slate-400 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-amber-400" />
            <span>Detected Sensitive Region</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" />
            <span>Redacted into [REDACTED]</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Local memory buffer isolation</span>
        </div>
      </div>
    </div>
  );
};
