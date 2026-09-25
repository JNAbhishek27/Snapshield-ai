import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  Sparkles,
  ShieldCheck,
  Cpu,
  CornerDownLeft,
  Bot,
  User,
  RefreshCw,
  HelpCircle,
} from 'lucide-react';
import { QAResult } from '../types';

interface QAPanelProps {
  onAskQuestion: (question: string) => Promise<void>;
  qaHistory: QAResult[];
  isAnswering: boolean;
  activeProviderName: string;
}

export const QAPanel: React.FC<QAPanelProps> = ({
  onAskQuestion,
  qaHistory,
  isAnswering,
  activeProviderName,
}) => {
  const [inputQuestion, setInputQuestion] = useState('');

  const exampleQuestions = [
    'What is this document about?',
    'What are the important dates?',
    'What organization is mentioned?',
    'Summarize the document.',
    'What are the main sections?',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuestion.trim() || isAnswering) return;
    const q = inputQuestion.trim();
    setInputQuestion('');
    onAskQuestion(q);
  };

  const handleChipClick = (q: string) => {
    if (isAnswering) return;
    onAskQuestion(q);
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/60">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Confidential Document Q&A
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Query document contents with automated PII guardrails
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
          <ShieldCheck className="w-4 h-4" />
          <span className="hidden sm:inline">PII Leak Prevention Active</span>
        </div>
      </div>

      {/* Suggested Questions Required by Prompt */}
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5" />
          Recommended Inquiries
        </div>
        <div className="flex flex-wrap gap-1.5">
          {exampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleChipClick(q)}
              disabled={isAnswering}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors cursor-pointer text-left disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Q&A Conversation History Stream */}
      <div className="space-y-3 min-h-[160px] max-h-[380px] overflow-y-auto p-1">
        {qaHistory.length === 0 ? (
          <div className="p-6 text-center rounded-xl bg-slate-50/50 dark:bg-slate-950/30 border border-dashed border-slate-200 dark:border-slate-800 text-slate-500 text-xs">
            <p className="font-semibold text-slate-700 dark:text-slate-300">
              Ask a question above or type your own prompt below
            </p>
            <p className="text-slate-400 mt-1">
              SnapShield answers strictly on redacted context without revealing underlying sensitive identifiers.
            </p>
          </div>
        ) : (
          qaHistory.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs"
            >
              {/* Question */}
              <div className="flex items-start gap-2 text-slate-900 dark:text-white font-semibold">
                <div className="p-1 rounded-md bg-slate-200 dark:bg-slate-800 shrink-0">
                  <User className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                </div>
                <span>{item.question}</span>
              </div>

              {/* Answer */}
              <div className="flex items-start gap-2 pl-1 border-l-2 border-red-500/40 ml-2 pt-1">
                <div className="space-y-1.5 text-slate-700 dark:text-slate-300 leading-relaxed">
                  <div className="whitespace-pre-wrap">{item.answer}</div>

                  <div className="flex items-center gap-3 pt-1 text-[10px] text-slate-400 font-mono">
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                      <ShieldCheck className="w-3 h-3" />
                      PII Protected (Confidence: {item.piiSafeConfidence}%)
                    </span>
                    <span>Provider: {item.providerName}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}

        {isAnswering && (
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center gap-3 text-xs text-slate-500">
            <RefreshCw className="w-4 h-4 animate-spin text-red-500" />
            <span>Consulting local document buffer with privacy boundary verification...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <input
          type="text"
          value={inputQuestion}
          onChange={(e) => setInputQuestion(e.target.value)}
          placeholder="Ask a question about the document..."
          disabled={isAnswering}
          className="w-full pl-4 pr-12 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-red-500 transition-colors"
        />
        <button
          type="submit"
          disabled={!inputQuestion.trim() || isAnswering}
          className="absolute right-1.5 p-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white disabled:opacity-40 transition-colors cursor-pointer"
          title="Send question"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
