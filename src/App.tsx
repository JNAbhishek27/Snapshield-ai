/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldCheck,
  Cpu,
  Layers,
  FileText,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  Database,
  Lock,
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { SnapdragonBanner } from './components/SnapdragonBanner';
import { PrivacyPanel } from './components/PrivacyPanel';
import { TechnicalDashboard } from './components/TechnicalDashboard';
import { PipelineVisualizer } from './components/PipelineVisualizer';
import { DocumentUploadArea } from './components/DocumentUploadArea';
import { PIITable } from './components/PIITable';
import { DocumentPreview } from './components/DocumentPreview';
import { SummaryPanel } from './components/SummaryPanel';
import { QAPanel } from './components/QAPanel';

import {
  DocumentContext,
  PIIEntity,
  PipelineStage,
  SummaryResult,
  QAResult,
} from './types';
import { aiProviderManager } from './services/ai/AIProviderManager';
import { DocumentProcessor } from './services/document/documentProcessor';
import { DEMO_DOCUMENTS, DemoDocumentPreset } from './services/document/demoDocuments';

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('snapshield_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'document' | 'privacy' | 'technical' | 'pipeline'>('document');

  // Snapdragon AI Mode state (default enabled for maximum privacy)
  const [snapdragonMode, setSnapdragonMode] = useState<boolean>(() =>
    aiProviderManager.isSnapdragonModeEnabled(),
  );

  // Active AI Provider
  const [activeProvider, setActiveProvider] = useState(() =>
    aiProviderManager.getActiveProvider(),
  );

  // Document context state
  const [document, setDocument] = useState<DocumentContext | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStage, setCurrentStage] = useState<PipelineStage>('upload');

  // Redaction selection state
  const [selectedEntityIds, setSelectedEntityIds] = useState<Set<string>>(new Set());

  // Summary & Q&A state
  const [summaryResult, setSummaryResult] = useState<SummaryResult | null>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [qaHistory, setQaHistory] = useState<QAResult[]>([]);
  const [isAnsweringQA, setIsAnsweringQA] = useState(false);

  // Apply dark mode class to html document
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('snapshield_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('snapshield_theme', 'light');
    }
  }, [darkMode]);

  // Handle Snapdragon mode toggle
  const handleToggleSnapdragonMode = (enabled: boolean) => {
    setSnapdragonMode(enabled);
    aiProviderManager.setSnapdragonMode(enabled);
    setActiveProvider(aiProviderManager.getActiveProvider());
  };

  // Pipeline execution: Process a raw document through local detection
  const processDocumentPipeline = useCallback(
    async (
      text: string,
      docName: string,
      fileSize: number,
      mimeType: string,
      isDemo: boolean = false,
      demoTitle?: string,
    ) => {
      setIsProcessing(true);
      setCurrentStage('preprocessing');

      // 1. Preprocessing Stage (small delay to model parsing)
      await new Promise((r) => setTimeout(r, 60));
      setCurrentStage('inference');

      // 2. AI Inference & PII Detection
      const provider = aiProviderManager.getActiveProvider();
      const analysis = await provider.detectPII(text);
      setCurrentStage('detection');

      const initialDoc: DocumentContext = {
        id: `doc-${Date.now()}`,
        name: docName,
        fileSize,
        mimeType,
        rawText: text,
        sanitizedText: text, // initially unredacted until user applies redaction
        entities: analysis.entities,
        isDemo,
        demoTitle,
        createdAt: new Date().toISOString(),
        lastProcessedAt: new Date().toISOString(),
      };

      setDocument(initialDoc);
      setSelectedEntityIds(new Set());
      setSummaryResult(null);
      setQaHistory([]);
      setIsProcessing(false);
      setCurrentStage('detection');
    },
    [],
  );

  // Initial load: Automatically load Primary Demo Document (Maya Sharma HP PC record)
  useEffect(() => {
    const primaryDemo = DEMO_DOCUMENTS[0];
    processDocumentPipeline(
      primaryDemo.rawText,
      primaryDemo.name,
      primaryDemo.rawText.length,
      'text/plain',
      true,
      primaryDemo.name,
    );
  }, [processDocumentPipeline]);

  // Handle Loading a Synthetic Demo Preset
  const handleLoadDemo = (preset: DemoDocumentPreset) => {
    processDocumentPipeline(
      preset.rawText,
      preset.name,
      preset.rawText.length,
      'text/plain',
      true,
      preset.name,
    );
  };

  // Handle File Upload (PDF, PNG, JPG, TXT)
  const handleFileUpload = async (file: File) => {
    try {
      setIsProcessing(true);
      const parsed = await DocumentProcessor.parseUploadedFile(file);
      await processDocumentPipeline(
        parsed.text,
        file.name,
        file.size,
        file.type || 'text/plain',
        false,
      );
    } catch (err) {
      console.error('Failed to parse uploaded document:', err);
      setIsProcessing(false);
    }
  };

  // Redaction Handlers
  const handleRedactAll = () => {
    if (!document) return;
    setCurrentStage('redaction');
    const { sanitizedText, updatedEntities } = DocumentProcessor.redactAll(
      document.rawText,
      document.entities,
    );
    setDocument({
      ...document,
      sanitizedText,
      entities: updatedEntities,
      lastProcessedAt: new Date().toISOString(),
    });
    setCurrentStage('privacy_safe');
  };

  const handleRedactSelected = () => {
    if (!document || selectedEntityIds.size === 0) return;
    setCurrentStage('redaction');
    const { sanitizedText, updatedEntities } = DocumentProcessor.redactSelected(
      document.rawText,
      document.entities,
      selectedEntityIds,
    );
    setDocument({
      ...document,
      sanitizedText,
      entities: updatedEntities,
      lastProcessedAt: new Date().toISOString(),
    });
    setSelectedEntityIds(new Set());
    setCurrentStage('privacy_safe');
  };

  const handleRestorePreview = () => {
    if (!document) return;
    const { sanitizedText, updatedEntities } = DocumentProcessor.restorePreview(
      document.rawText,
      document.entities,
    );
    setDocument({
      ...document,
      sanitizedText,
      entities: updatedEntities,
      lastProcessedAt: new Date().toISOString(),
    });
    setSelectedEntityIds(new Set());
    setCurrentStage('detection');
  };

  const handleRedactSingle = (id: string) => {
    if (!document) return;
    const target = document.entities.find((e) => e.id === id);
    if (!target) return;

    if (target.status === 'redacted') {
      handleRestoreSingle(id);
      return;
    }

    setCurrentStage('redaction');
    const { sanitizedText, updatedEntities } = DocumentProcessor.redactSelected(
      document.rawText,
      document.entities,
      new Set([id]),
    );
    setDocument({
      ...document,
      sanitizedText,
      entities: updatedEntities,
      lastProcessedAt: new Date().toISOString(),
    });
    setCurrentStage('privacy_safe');
  };

  const handleRestoreSingle = (id: string) => {
    if (!document) return;
    const updated = document.entities.map((e) =>
      e.id === id ? { ...e, status: 'pending' as const, replacementText: undefined } : e,
    );
    const { sanitizedText } = DocumentProcessor.applyRedactions(
      document.rawText,
      updated,
    );
    const remainingRedacted = updated.filter((e) => e.status === 'redacted').length;
    setDocument({
      ...document,
      sanitizedText,
      entities: updated,
      lastProcessedAt: new Date().toISOString(),
    });
    if (remainingRedacted === 0) {
      setCurrentStage('detection');
    } else {
      setCurrentStage('privacy_safe');
    }
  };

  const handleIgnoreSingle = (id: string) => {
    if (!document) return;
    const updated = document.entities.map((e) =>
      e.id === id ? { ...e, status: 'ignored' as const, replacementText: undefined } : e,
    );
    const { sanitizedText } = DocumentProcessor.applyRedactions(
      document.rawText,
      updated,
    );
    const remainingRedacted = updated.filter((e) => e.status === 'redacted').length;
    setDocument({
      ...document,
      sanitizedText,
      entities: updated,
      lastProcessedAt: new Date().toISOString(),
    });
    if (remainingRedacted === 0) {
      setCurrentStage('detection');
    } else {
      setCurrentStage('privacy_safe');
    }
  };

  // Selection Checkboxes
  const handleToggleSelectEntity = (id: string) => {
    const next = new Set(selectedEntityIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedEntityIds(next);
  };

  const handleSelectAll = () => {
    if (!document) return;
    setSelectedEntityIds(new Set(document.entities.map((e) => e.id)));
  };

  const handleDeselectAll = () => {
    setSelectedEntityIds(new Set());
  };

  // Summary Generation
  const handleGenerateSummary = async () => {
    if (!document) return;
    try {
      setIsGeneratingSummary(true);
      setCurrentStage('reasoning');
      const provider = aiProviderManager.getActiveProvider();
      // Ensure summary context is safe even if user hasn't explicitly clicked Redact All
      const safeText = DocumentProcessor.redactAll(document.rawText, document.entities).sanitizedText;
      const textToSummarize = document.sanitizedText !== document.rawText ? document.sanitizedText : safeText;
      const res = await provider.generateSummary(textToSummarize);
      setSummaryResult(res);
    } catch (err) {
      console.error('Summary generation error:', err);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  // Q&A Question Handling
  const handleAskQuestion = async (question: string) => {
    if (!document) return;
    try {
      setIsAnsweringQA(true);
      setCurrentStage('reasoning');
      const provider = aiProviderManager.getActiveProvider();
      const safeText = DocumentProcessor.redactAll(document.rawText, document.entities).sanitizedText;
      const textToUse = document.sanitizedText !== document.rawText ? document.sanitizedText : safeText;
      const res = await provider.answerQuestion({
        question,
        sanitizedContext: textToUse,
        documentTitle: document.name,
      });
      setQaHistory((prev) => [res, ...prev]);
    } catch (err) {
      console.error('Q&A error:', err);
    } finally {
      setIsAnsweringQA(false);
    }
  };

  const totalEntities = document?.entities.length || 0;
  const redactedCount = document?.entities.filter((e) => e.status === 'redacted').length || 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Application Navbar */}
      <Navbar
        snapdragonMode={snapdragonMode}
        onToggleSnapdragonMode={handleToggleSnapdragonMode}
        activeProvider={activeProvider}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Prominent Snapdragon AI Mode Banner */}
      <SnapdragonBanner
        enabled={snapdragonMode}
        onOpenTechnical={() => setActiveTab('technical')}
      />

      {/* Hero / Concept Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-6 px-4 sm:px-6 lg:px-8 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-xs font-bold tracking-wider uppercase text-red-600 dark:text-red-400">
                Snapdragon AI Lab Challenge
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                HP PC Architecture
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              SnapShield AI
            </h1>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-1">
              Privacy-first document intelligence designed for Snapdragon-powered HP PCs.
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              Detects personally identifiable information in sensitive documents, orchestrates selective or bulk redaction into <code className="px-1 py-0.5 rounded-sm bg-slate-100 dark:bg-slate-800 font-mono text-[11px] text-red-600 dark:text-red-400">[REDACTED]</code>, creates privacy-safe summaries, and provides document Q&A without leaking personal credentials.
            </p>
          </div>

          {/* Quick Metrics Badges */}
          <div className="flex sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-2 text-xs">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-medium">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Target: Qualcomm AI Hub Local Inference</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
              <span>Hardware: HP OmniBook X (Hexagon NPU)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Tab 1: Document Studio (Primary Workspace) */}
        {activeTab === 'document' && (
          <div className="space-y-6">
            {/* Document Ingestion & Demo Loader */}
            <DocumentUploadArea
              onLoadDemo={handleLoadDemo}
              onFileUpload={handleFileUpload}
              isProcessing={isProcessing}
              currentDocumentName={document?.name}
            />

            {/* Document Intelligence Pipeline Visualizer */}
            <PipelineVisualizer
              currentStage={currentStage}
              isProcessing={isProcessing}
              totalEntities={totalEntities}
              redactedCount={redactedCount}
              onSelectStage={(stage) => {
                setCurrentStage(stage);
                if (stage === 'upload') {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              onTriggerRedaction={handleRedactAll}
            />

            {/* Main Split: Left Document Preview & Right PII Table */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Document Preview (7 Columns on large screens) */}
              <div className="lg:col-span-7 space-y-4">
                <DocumentPreview
                  originalText={document?.rawText || ''}
                  sanitizedText={document?.sanitizedText || ''}
                  entities={document?.entities || []}
                  onRedactAll={handleRedactAll}
                  onRedactSelected={handleRedactSelected}
                  onRestorePreview={handleRestorePreview}
                  hasSelected={selectedEntityIds.size > 0}
                  onRedactSingle={handleRedactSingle}
                />

                {/* Privacy-Safe Summary Panel */}
                <SummaryPanel
                  summary={summaryResult}
                  isGenerating={isGeneratingSummary}
                  onGenerateSummary={handleGenerateSummary}
                  redactedCount={redactedCount}
                  totalEntities={totalEntities}
                />
              </div>

              {/* PII Table & Q&A Panel (5 Columns on large screens) */}
              <div className="lg:col-span-5 space-y-6">
                {/* PII Entities Table */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        Detected Sensitive Entities
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {totalEntities} items identified • Values protected from unnecessary exposure
                      </p>
                    </div>
                    {redactedCount === totalEntities && totalEntities > 0 && (
                      <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                        100% Redacted
                      </span>
                    )}
                  </div>

                  <PIITable
                    entities={document?.entities || []}
                    onRedactEntity={handleRedactSingle}
                    onRestoreEntity={handleRestoreSingle}
                    onIgnoreEntity={handleIgnoreSingle}
                    selectedEntityIds={selectedEntityIds}
                    onToggleSelectEntity={handleToggleSelectEntity}
                    onSelectAll={handleSelectAll}
                    onDeselectAll={handleDeselectAll}
                    onRedactSelected={handleRedactSelected}
                    onRedactAll={handleRedactAll}
                  />
                </div>

                {/* Confidential Document Q&A Panel */}
                <QAPanel
                  onAskQuestion={handleAskQuestion}
                  qaHistory={qaHistory}
                  isAnswering={isAnsweringQA}
                  activeProviderName={activeProvider.name}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Privacy Shield Dashboard */}
        {activeTab === 'privacy' && (
          <PrivacyPanel
            document={document}
            activeProvider={activeProvider}
            snapdragonMode={snapdragonMode}
            onToggleSnapdragonMode={handleToggleSnapdragonMode}
            onSelectProvider={(id) => aiProviderManager.selectProvider(id)}
          />
        )}

        {/* Tab 3: Technical Details Dashboard */}
        {activeTab === 'technical' && (
          <TechnicalDashboard activeProvider={activeProvider} />
        )}

        {/* Tab 4: AI Pipeline Architecture */}
        {activeTab === 'pipeline' && (
          <div className="space-y-6">
            <PipelineVisualizer
              currentStage={currentStage}
              isProcessing={isProcessing}
              totalEntities={totalEntities}
              redactedCount={redactedCount}
              onSelectStage={(stage) => {
                setCurrentStage(stage);
                setActiveTab('document');
              }}
              onTriggerRedaction={() => {
                handleRedactAll();
                setActiveTab('document');
              }}
            />

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Detailed End-to-End Execution Pipeline
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                SnapShield AI replaces traditional cloud-leaking document processing with a strict
                on-device intelligence pipeline tailored for Qualcomm Snapdragon hardware:
              </p>

              <div className="space-y-3 pt-2">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-start gap-3 text-xs">
                  <span className="font-mono font-bold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-950 px-2 py-0.5 rounded-md">
                    Stage 1
                  </span>
                  <div>
                    <strong className="text-slate-900 dark:text-white">Document Ingestion:</strong> Ingests PDF binary streams, image scans (PNG/JPG), or text documents into memory buffers.
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-start gap-3 text-xs">
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-950 px-2 py-0.5 rounded-md">
                    Stage 2
                  </span>
                  <div>
                    <strong className="text-slate-900 dark:text-white">Preprocessing & Tokenization:</strong> Normalizes character encodings, cleans whitespace, and generates boundary offsets.
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-start gap-3 text-xs">
                  <span className="font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded-md">
                    Stage 3
                  </span>
                  <div>
                    <strong className="text-slate-900 dark:text-white">AI Inference (Qualcomm AI Hub Target):</strong> Local NER and token classifiers classify tokens into PII categories without network round-trips.
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-start gap-3 text-xs">
                  <span className="font-mono font-bold text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-950 px-2 py-0.5 rounded-md">
                    Stage 4
                  </span>
                  <div>
                    <strong className="text-slate-900 dark:text-white">PII Detection & Protection:</strong> Evaluates confidence metrics and masks values in the UI table (e.g. <code className="font-mono">M•••• S•••••</code>) to avoid shoulder surfing.
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-start gap-3 text-xs">
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
                    Stage 5
                  </span>
                  <div>
                    <strong className="text-slate-900 dark:text-white">Redaction Engine:</strong> Transforms targeted offsets into standard <code className="font-mono">[REDACTED]</code> tokens with reverse position mapping.
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-start gap-3 text-xs">
                  <span className="font-mono font-bold text-teal-600 dark:text-teal-400 bg-teal-100 dark:bg-teal-950 px-2 py-0.5 rounded-md">
                    Stage 6
                  </span>
                  <div>
                    <strong className="text-slate-900 dark:text-white">Privacy-Safe Representation:</strong> Creates a completely sanitized document representation certified free from raw personal identifiers.
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-start gap-3 text-xs">
                  <span className="font-mono font-bold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-950 px-2 py-0.5 rounded-md">
                    Stage 7
                  </span>
                  <div>
                    <strong className="text-slate-900 dark:text-white">Optional Reasoning:</strong> Summarization and question-answering operate exclusively on the privacy-safe representation.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-4 px-4 sm:px-6 lg:px-8 text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white">SnapShield AI</span>
            <span>•</span>
            <span>Snapdragon AI Lab Build &amp; Present Challenge</span>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <span>Designed for Snapdragon-powered HP PCs</span>
            <span>•</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">Privacy-First Architecture</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
