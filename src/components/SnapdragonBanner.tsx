import React from 'react';
import { Cpu, ShieldCheck, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

interface SnapdragonBannerProps {
  enabled: boolean;
  onOpenTechnical: () => void;
}

export const SnapdragonBanner: React.FC<SnapdragonBannerProps> = ({
  enabled,
  onOpenTechnical,
}) => {
  if (!enabled) {
    return (
      <div className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-2.5 px-4 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
            <span>
              Snapdragon AI Mode is currently disabled. Processing is using default local simulation with optional cloud reasoning.
            </span>
          </div>
          <span className="text-slate-500">Enable in header to enforce local-only isolation.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-red-500/10 via-amber-500/5 to-slate-900/0 dark:from-red-950/40 dark:via-slate-900/60 dark:to-slate-950 border-b border-red-200/80 dark:border-red-900/50 py-3 px-4 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2 rounded-lg bg-red-600 text-white shadow-xs shrink-0 mt-0.5 sm:mt-0">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-sm text-slate-900 dark:text-white">
                Snapdragon AI Mode
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300 border border-red-200 dark:border-red-800">
                <CheckCircle2 className="w-3 h-3 text-red-600 dark:text-red-400" />
                Local Isolation Active
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Designed for local AI inference on Snapdragon-powered PCs.
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              Targeting Qualcomm AI Hub on Snapdragon Hexagon NPU. Demo local inference currently running (Zero document data leaves your PC).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-center shrink-0">
          <button
            onClick={onOpenTechnical}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-2xs transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-red-500" />
            View Integration Target Specs
          </button>
        </div>
      </div>
    </div>
  );
};
