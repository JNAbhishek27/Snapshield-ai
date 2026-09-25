import React from 'react';
import {
  FileText,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Cpu,
  Layers,
} from 'lucide-react';
import { SummaryResult } from '../types';

interface SummaryPanelProps {
  summary: SummaryResult | null;
  isGenerating: boolean;
  onGenerateSummary: () => void;
  redactedCount: number;
  totalEntities: number;
}

export const SummaryPanel: React.FC<SummaryPanelProps> = ({
  summary,
  isGenerating,
  onGenerateSummary,
  redactedCount,
  totalEntities,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/60">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Privacy-Safe Document Summary
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Summarizes core intent while strictly guarding all personal identifiers
            </p>
          </div>
        </div>

        <button
          onClick={onGenerateSummary}
          disabled={isGenerating}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Analyzing Sanitized Text...</span>
            </>
          ) : (
            <>
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{summary ? 'Regenerate Summary' : 'Generate Summary'}</span>
            </>
          )}
        </button>
      </div>

      {/* PII Protection Status Banner */}
      <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 flex items-center justify-between text-xs text-emerald-900 dark:text-emerald-200">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>
            <strong>Zero PII Reproduction Guarantee:</strong> Reasoning executed on the privacy-safe sanitized document buffer.
          </span>
        </div>
        <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-300">
          {redactedCount}/{totalEntities} Redacted
        </span>
      </div>

      {/* Summary Content */}
      {summary ? (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
            <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-500" />
              Executive Overview
            </h4>
            <p className="text-slate-700 dark:text-slate-300">
              {summary.summary}
            </p>
          </div>

          {summary.keyPoints && summary.keyPoints.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2 uppercase tracking-wider">
                Key Topics & Operational Findings
              </h4>
              <ul className="space-y-2">
                {summary.keyPoints.map((point, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Telemetry info */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 font-mono">
            <span>Provider: {summary.providerName}</span>
            <span>Latency: {summary.executionTimeMs} ms</span>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center rounded-xl bg-slate-50/50 dark:bg-slate-950/30 border border-dashed border-slate-200 dark:border-slate-800 text-slate-500 text-xs">
          <p className="font-semibold text-slate-700 dark:text-slate-300">
            Click &ldquo;Generate Summary&rdquo; to create a privacy-safe overview
          </p>
          <p className="text-slate-400 mt-1">
            SnapShield AI extracts operational facts without leaking detected identities or credentials.
          </p>
        </div>
      )}
    </div>
  );
};
