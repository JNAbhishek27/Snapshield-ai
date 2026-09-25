export type PIIEntityType =
  | 'PERSON_NAME'
  | 'EMAIL'
  | 'PHONE'
  | 'ADDRESS'
  | 'GOV_ID'
  | 'ACCOUNT_NUMBER'
  | 'DOB'
  | 'CREDIT_CARD'
  | 'URL'
  | 'SENSITIVE_OTHER';

export interface PIIEntity {
  id: string;
  type: PIIEntityType;
  label: string;
  rawValue: string;
  maskedValue: string;
  startIndex: number;
  endIndex: number;
  confidence: number; // 0 - 100
  status: 'pending' | 'redacted' | 'ignored';
  detectedBy: string;
  explanation: string;
  replacementText?: string;
}

export interface DocumentContext {
  id: string;
  name: string;
  fileSize: number;
  mimeType: string;
  rawText: string;
  sanitizedText: string;
  entities: PIIEntity[];
  isDemo: boolean;
  demoTitle?: string;
  createdAt: string;
  lastProcessedAt: string;
}

export type AIProviderType = 'local' | 'cloud';

export type { AIProvider } from '../services/ai/AIProvider';

export interface HardwareProfile {
  targetPlatform: string;
  hardwareDevice: string;
  aiFramework: string;
  localRuntime: string;
  executionTarget: string;
  model: string;
  inference: string;
  isSimulated: boolean;
  npuStatus: string;
}

export interface PIIAnalysisResult {
  entities: PIIEntity[];
  executionTimeMs: number;
  providerId: string;
  providerName: string;
  runtimeLabel: string;
  hardwareTarget: string;
  isSimulated: boolean;
}

export interface SummaryResult {
  summary: string;
  keyPoints: string[];
  piiProtectionNote: string;
  providerId: string;
  providerName: string;
  executionTimeMs: number;
  timestamp: string;
}

export interface QAResult {
  question: string;
  answer: string;
  piiSafeConfidence: number;
  providerId: string;
  providerName: string;
  timestamp: string;
}

export type PipelineStage =
  | 'upload'
  | 'preprocessing'
  | 'inference'
  | 'detection'
  | 'redaction'
  | 'privacy_safe'
  | 'reasoning';

export interface PipelineStep {
  stage: PipelineStage;
  title: string;
  description: string;
  status: 'idle' | 'processing' | 'completed' | 'skipped';
  metrics?: string;
}
