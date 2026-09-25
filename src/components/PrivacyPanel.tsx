import React from 'react';
import {
  ShieldCheck,
  Lock,
  Cpu,
  CloudOff,
  Cloud,
  CheckCircle,
  AlertTriangle,
  EyeOff,
  Info,
} from 'lucide-react';
import { AIProvider, DocumentContext } from '../types';

interface PrivacyPanelProps {
  document: DocumentContext | null;
  activeProvider: AIProvider;
  snapdragonMode: boolean;
  onToggleSnapdragonMode: (val: boolean) => void;
  onSelectProvider: (id: string) => void;
}

export const PrivacyPanel: React.FC<PrivacyPanelProps> = ({
  document,
  activeProvider,
  snapdragonMode,
  onToggleSnapdragonMode,
  onSelectProvider,
}) => {
  const totalEntities = document?.entities.length || 0;
  const redactedEntities = document?.entities.filter((e) => e.status === 'redacted').length || 0;
  const pendingEntities = document?.entities.filter((e) => e.status === 'pending').length || 0;

  return (
    <div className="space-y-6">
      {/* Primary Privacy Policy Notice */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-200 dark:border-emerald-900/60 dark:bg-emerald-950/20">
        <div className="flex items-start gap-4">
          <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-xs shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Privacy-First Document Directive
            </h3>
            <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300 mt-0.5">
              &ldquo;Your sensitive document should be processed locally whenever possible.&rdquo;
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              SnapShield AI enforces confidential processing boundaries. Sensitive personal identifiers, credentials,
              and account records are detected on-device so unredacted data is never exposed.
            </p>
          </div>
        </div>
      </div>

      {/* Required Privacy Metrics Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Metric 1: Processing Mode */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Processing Mode
            </span>
            {activeProvider.isLocal ? (
              <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Cloud className="w-4 h-4 text-indigo-500" />
            )}
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              {activeProvider.isLocal ? 'Local' : 'Cloud'}
            </span>
            <span
              className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${
                activeProvider.isLocal
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
              }`}
            >
              {activeProvider.isLocal ? 'On-Device Pipeline' : 'Cloud Reasoning'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
            {activeProvider.isLocal
              ? 'Demo local inference runtime active.'
              : 'External API network call.'}
          </p>
        </div>

        {/* Metric 2: Sensitive Data */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Sensitive Data
            </span>
            {totalEntities > 0 ? (
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            ) : (
              <CheckCircle className="w-4 h-4 text-emerald-500" />
            )}
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              {totalEntities > 0 ? 'Detected' : 'None Detected'}
            </span>
            {totalEntities > 0 && (
              <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded-md">
                {totalEntities} Found
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
            {totalEntities > 0
              ? `${pendingEntities} pending redaction, ${redactedEntities} masked.`
              : 'Scan document to detect PII.'}
          </p>
        </div>

        {/* Metric 3: Redaction */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Redaction
            </span>
            <EyeOff className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              Available
            </span>
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
              {redactedEntities}/{totalEntities} Masked
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
            Transforms sensitive entities into standard [REDACTED] tokens.
          </p>
        </div>

        {/* Metric 4: Snapdragon AI */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Snapdragon AI
              </span>
              <Cpu
                className={`w-4 h-4 ${
                  snapdragonMode ? 'text-red-600 dark:text-red-400' : 'text-slate-400'
                }`}
              />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                {snapdragonMode ? 'Enabled' : 'Disabled'}
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={snapdragonMode}
                onClick={() => onToggleSnapdragonMode(!snapdragonMode)}
                className={`cursor-pointer text-[11px] font-semibold px-2 py-0.5 rounded-md transition-colors ${
                  snapdragonMode
                    ? 'bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-950 dark:text-red-300'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}
                title="Click to toggle Snapdragon AI Mode"
              >
                {snapdragonMode ? 'Active Guard (Click to toggle)' : 'Inactive (Click to enable)'}
              </button>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
              Enforces local on-device inference isolation.
            </p>
          </div>
        </div>

        {/* Metric 5: Cloud Processing */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Cloud Processing
              </span>
              {snapdragonMode ? (
                <CloudOff className="w-4 h-4 text-emerald-600" />
              ) : (
                <Cloud className="w-4 h-4 text-indigo-500" />
              )}
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                Optional
              </span>
              <span
                className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${
                  snapdragonMode
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}
              >
                {snapdragonMode ? 'Blocked by Policy' : 'Available as Option'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
              {snapdragonMode
                ? 'Zero network transmission enforced.'
                : 'Requires pre-sanitized redaction payload.'}
            </p>
          </div>
        </div>
      </div>

      {/* Honest Local Architecture & Disclaimer Card */}
      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Architecture Truth & Hardware Integration Transparency
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              In accordance with engineering integrity principles, SnapShield AI does not falsely claim
              direct browser-to-NPU hardware execution before the compiled Qualcomm AI Hub runtime package
              is bound.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Current Execution State:
                </span>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Demo local inference runtime running client-side with zero network calls. All PII detection
                  and document redaction is contained entirely on your local machine.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Snapdragon Hardware Target:
                </span>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  HP OmniBook X / EliteBook with Qualcomm Snapdragon X Elite (Hexagon NPU 45 TOPS)
                  using Qualcomm AI Hub ONNX Runtime / QNN Execution Provider.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
