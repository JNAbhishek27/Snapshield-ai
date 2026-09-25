import {
  HardwareProfile,
  PIIAnalysisResult,
  SummaryResult,
  QAResult,
  AIProviderType,
} from '../../types';

export interface SummarizeOptions {
  style?: 'executive' | 'concise' | 'detailed';
  requireSanitizedInput?: boolean;
}

export interface QARequest {
  question: string;
  sanitizedContext: string;
  documentTitle?: string;
}

/**
 * Base modular AI Provider interface.
 * UI components must consume this interface rather than tying directly to any specific vendor SDK.
 */
export interface AIProvider {
  readonly id: string;
  readonly name: string;
  readonly type: AIProviderType;
  readonly isLocal: boolean;
  readonly isSimulated: boolean;
  readonly runtimeLabel: string;
  readonly hardwareTarget: string;

  /**
   * Return the hardware telemetry and integration status
   */
  getHardwareProfile(): HardwareProfile;

  /**
   * Analyze document text and detect all PII entities
   */
  detectPII(text: string): Promise<PIIAnalysisResult>;

  /**
   * Generate a privacy-safe summary of the sanitized/redacted document
   */
  generateSummary(sanitizedText: string, options?: SummarizeOptions): Promise<SummaryResult>;

  /**
   * Answer natural language questions strictly grounded on privacy-safe document context
   */
  answerQuestion(request: QARequest): Promise<QAResult>;
}

/**
 * Base class for all On-Device / Local AI Providers.
 * Guarantees zero-network transmission of confidential user documents.
 */
export abstract class LocalAIProvider implements AIProvider {
  abstract readonly id: string;
  abstract readonly name: string;
  readonly type: AIProviderType = 'local';
  readonly isLocal = true;
  abstract readonly isSimulated: boolean;
  abstract readonly runtimeLabel: string;
  abstract readonly hardwareTarget: string;

  abstract getHardwareProfile(): HardwareProfile;
  abstract detectPII(text: string): Promise<PIIAnalysisResult>;
  abstract generateSummary(sanitizedText: string, options?: SummarizeOptions): Promise<SummaryResult>;
  abstract answerQuestion(request: QARequest): Promise<QAResult>;
}

/**
 * Base class for Cloud-assisted AI Providers.
 * Transmits pre-sanitized or user-authorized document fragments over encrypted network.
 */
export abstract class CloudAIProvider implements AIProvider {
  abstract readonly id: string;
  abstract readonly name: string;
  readonly type: AIProviderType = 'cloud';
  readonly isLocal = false;
  readonly isSimulated = false;
  abstract readonly runtimeLabel: string;
  abstract readonly hardwareTarget: string;

  abstract getHardwareProfile(): HardwareProfile;
  abstract detectPII(text: string): Promise<PIIAnalysisResult>;
  abstract generateSummary(sanitizedText: string, options?: SummarizeOptions): Promise<SummaryResult>;
  abstract answerQuestion(request: QARequest): Promise<QAResult>;
}
