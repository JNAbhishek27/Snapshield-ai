import React from 'react';
import {
  FileText,
  FileCode,
  Cpu,
  Search,
  EyeOff,
  ShieldCheck,
  Brain,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { PipelineStage } from '../types';

interface PipelineVisualizerProps {
  currentStage: PipelineStage;
  isProcessing: boolean;
  totalEntities: number;
  redactedCount: number;
  onSelectStage?: (stage: PipelineStage) => void;
  onTriggerRedaction?: () => void;
}

export const PipelineVisualizer: React.FC<PipelineVisualizerProps> = ({
  currentStage,
  isProcessing,
  totalEntities,
  redactedCount,
  onSelectStage,
  onTriggerRedaction,
}) => {
  const stages: {
    key: PipelineStage;
    label: string;
    icon: React.ElementType;
    description: string;
  }[] = [
    {
      key: 'upload',
      label: 'Document',
      icon: FileText,
      description: 'Ingestion of PDF/PNG/JPG or Synthetic Demo',
    },
    {
      key: 'preprocessing',
      label: 'Preprocessing',
      icon: FileCode,
      description: 'Stream decoding, tokenization, & spatial mapping',
    },
    {
      key: 'inference',
      label: 'AI Inference',
      icon: Cpu,
      description: 'Qualcomm AI Hub target / On-device neural pass',
    },
    {
      key: 'detection',
      label: 'PII Detection',
      icon: Search,
      description: `${totalEntities} sensitive entities identified`,
    },
    {
      key: 'redaction',
      label: 'Redaction',
      icon: EyeOff,
      description: `${redactedCount} entities sanitized into [REDACTED]`,
    },
    {
      key: 'privacy_safe',
      label: 'Privacy-Safe Doc',
      icon: ShieldCheck,
      description: 'Masked representation ready for export',
    },
    {
      key: 'reasoning',
      label: 'Optional Reasoning',
      icon: Brain,
      description: 'Privacy-guarded Q&A and Executive Summary',
    },
  ];

  const stageOrder: PipelineStage[] = [
    'upload',
    'preprocessing',
    'inference',
    'detection',
    'redaction',
    'privacy_safe',
    'reasoning',
  ];

  const currentIdx = stageOrder.indexOf(currentStage);

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Document Intelligence Pipeline
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            End-to-end confidential data transformation workflow
          </p>
        </div>
        <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
          Enforced On-Device Boundary
        </span>
      </div>

      {/* Horizontal Stepper */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          const isPassed = idx < currentIdx;
          const isCurrent = idx === currentIdx;

          return (
            <button
              key={stage.key}
              type="button"
              onClick={() => {
                if (stage.key === 'redaction' && onTriggerRedaction && redactedCount === 0) {
                  onTriggerRedaction();
                } else if (onSelectStage) {
                  onSelectStage(stage.key);
                }
              }}
              className={`p-3 rounded-xl border flex flex-col justify-between text-left transition-all cursor-pointer hover:shadow-xs hover:border-slate-400 dark:hover:border-slate-600 ${
                isCurrent
                  ? 'border-red-500 bg-red-50/50 dark:bg-red-950/20 shadow-xs ring-1 ring-red-500'
                  : isPassed
                  ? 'border-emerald-300 bg-emerald-50/40 dark:border-emerald-900/60 dark:bg-emerald-950/20'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 opacity-80'
              }`}
              title={`Click to view ${stage.label} details`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`p-1.5 rounded-lg ${
                      isCurrent
                        ? 'bg-red-600 text-white animate-pulse'
                        : isPassed
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  {isPassed && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  )}
                </div>

                <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
                  <span>{stage.label}</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {stage.description}
                </div>
              </div>

              <div className="mt-2 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                <span>Step 0{idx + 1}</span>
                {isCurrent && (
                  <span className="text-[9px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
                    Active
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
