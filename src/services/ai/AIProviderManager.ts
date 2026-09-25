import { AIProvider } from './AIProvider';
import { QualcommAIHubProvider } from './QualcommAIHubProvider';
import { GeminiProvider } from './GeminiProvider';

export class AIProviderManager {
  private static instance: AIProviderManager;
  private qualcommProvider: QualcommAIHubProvider;
  private geminiProvider: GeminiProvider;
  private activeProvider: AIProvider;
  private snapdragonMode: boolean = true; // Enabled by default for privacy-first

  private constructor() {
    this.qualcommProvider = new QualcommAIHubProvider();
    this.geminiProvider = new GeminiProvider();
    this.activeProvider = this.qualcommProvider;
  }

  public static getInstance(): AIProviderManager {
    if (!AIProviderManager.instance) {
      AIProviderManager.instance = new AIProviderManager();
    }
    return AIProviderManager.instance;
  }

  public getActiveProvider(): AIProvider {
    return this.activeProvider;
  }

  public getQualcommProvider(): QualcommAIHubProvider {
    return this.qualcommProvider;
  }

  public getGeminiProvider(): GeminiProvider {
    return this.geminiProvider;
  }

  public isSnapdragonModeEnabled(): boolean {
    return this.snapdragonMode;
  }

  public setSnapdragonMode(enabled: boolean): void {
    this.snapdragonMode = enabled;
    if (enabled) {
      // Force local Qualcomm AI Hub provider when Snapdragon AI mode is on
      this.activeProvider = this.qualcommProvider;
    }
  }

  public selectProvider(providerId: string): void {
    if (this.snapdragonMode && providerId !== this.qualcommProvider.id) {
      console.warn('Snapdragon AI Mode is active: provider locked to local Qualcomm AI Hub.');
      return;
    }
    if (providerId === this.geminiProvider.id) {
      this.activeProvider = this.geminiProvider;
    } else {
      this.activeProvider = this.qualcommProvider;
    }
  }
}

export const aiProviderManager = AIProviderManager.getInstance();
