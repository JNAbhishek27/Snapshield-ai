import React from 'react';
import {
  Cpu,
  Layers,
  Terminal,
  Server,
  Shield,
  Zap,
  CheckCircle,
  ExternalLink,
  Code2,
} from 'lucide-react';
import { AIProvider } from '../types';

interface TechnicalDashboardProps {
  activeProvider: AIProvider;
}

export const TechnicalDashboard: React.FC<TechnicalDashboardProps> = ({
  activeProvider,
}) => {
  const profile = activeProvider.getHardwareProfile();

  const technicalSpecs = [
    {
      label: 'Target Platform',
      value: profile.targetPlatform,
      subvalue: 'HP OmniBook X / HP EliteBook Ultra (Copilot+ PC class)',
      badge: 'Certified Platform',
      badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
    },
    {
      label: 'AI Framework',
      value: profile.aiFramework,
      subvalue: 'Qualcomm AI Hub repository for optimized on-device models',
      badge: 'Hub Integrated',
      badgeColor: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300',
    },
    {
      label: 'Local Runtime',
      value: profile.localRuntime,
      subvalue: 'Windows ARM64 execution pipeline supporting ONNX EP & QNN',
      badge: 'Runtime Pipeline',
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
    },
    {
      label: 'Execution Target',
      value: profile.executionTarget,
      subvalue: 'Qualcomm Hexagon NPU (45 TOPS rated envelope) / Adreno GPU / Oryon CPU',
      badge: 'Integration target',
      badgeColor: 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
    },
    {
      label: 'Model Architecture',
      value: profile.model,
      subvalue: 'Quantized Presidio NER (INT8/W8A8) + Llama-3.2-1B-Instruct-QNN',
      badge: 'Integration target',
      badgeColor: 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
    },
    {
      label: 'Inference Mode',
      value: profile.inference,
      subvalue: 'Zero-cloud local processing pipeline running on client workstation',
      badge: 'Active Demo Runtime',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-red-600 text-white">
              <Cpu className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Technical Details & Architecture
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Snapdragon AI Lab Build & Present Challenge Specification
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-500 dark:text-slate-400">Current Status: </span>
            <span className="font-semibold text-slate-900 dark:text-white">
              Demo local inference
            </span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 font-semibold">
            Integration Target
          </div>
        </div>
      </div>

      {/* Grid of 6 Core Technical Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {technicalSpecs.map((spec, i) => (
          <div
            key={i}
            className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {spec.label}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${spec.badgeColor}`}>
                  {spec.badge}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-2">
                {spec.value}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {spec.subvalue}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Architecture Integration Blueprint */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Qualcomm AI Hub Integration Blueprint
            </h3>
          </div>
          <span className="text-[11px] font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md text-slate-600 dark:text-slate-300">
            src/services/ai/QualcommAIHubProvider.ts
          </span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          The application is cleanly layered into an abstract <code className="px-1 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-mono text-[11px]">AIProvider</code> interface.
          When deploying to a native Snapdragon HP PC environment (via Windows App SDK, Electron, or WebNN in Chromium), the provider connects to compiled Qualcomm AI Hub binaries without modifying document UI logic:
        </p>

        {/* Code Scaffolding Snippet */}
        <div className="rounded-xl bg-slate-950 p-4 font-mono text-xs text-slate-300 overflow-x-auto border border-slate-800">
          <div className="text-slate-500 mb-2">// 1. Compile Qualcomm AI Hub model targeting Snapdragon X Elite NPU</div>
          <div className="text-emerald-400">
            $ qai-hub compile \
          </div>
          <div className="text-emerald-400 pl-4">
            --model "llama-3.2-1b-instruct" \
          </div>
          <div className="text-emerald-400 pl-4">
            --target-runtime "qnn_lib_windows_arm64" \
          </div>
          <div className="text-emerald-400 pl-4">
            --target-device "Snapdragon X Elite"
          </div>

          <div className="text-slate-500 my-2 pt-2 border-t border-slate-800">// 2. Connect ONNX Runtime Web / Native QNN Execution Provider</div>
          <div className="text-indigo-300">
            import &#123; InferenceSession &#125; from 'onnxruntime-node';
          </div>
          <div className="text-indigo-300">
            const session = await InferenceSession.create('models/llama3_qnn.onnx', &#123;
          </div>
          <div className="text-indigo-300 pl-4">
            executionProviders: [&#123; name: <span className="text-amber-300">'QNN'</span>, deviceType: <span className="text-amber-300">'HTP'</span> /* Hexagon Tensor Processor */ &#125;]
          </div>
          <div className="text-indigo-300">&#125;);</div>
        </div>

        <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-800 dark:text-amber-300">
          <strong>Notice on Qualcomm Performance & Telemetry:</strong> In compliance with the competition requirements, SnapShield AI does not display fabricated benchmark numbers or simulated NPU FLOPS. Real-world telemetry will be surfaced directly from the Qualcomm AI Runtime once physical hardware binding is complete.
        </div>
      </div>
    </div>
  );
};
