import { createOpenAI } from "@ai-sdk/openai";
import { LanguageModelV1, ProviderV1 } from "@ai-sdk/provider";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

/**
 * AIProvider acts as an abstract factory for different AI model providers
 * It unifies the interface for interacting with different provider types
 */

export type ModelType = "default" | "reasoning" | "output";

export class AIProvider {
  private providers: Map<string, ProviderV1> = new Map();
  private models: {
    default: LanguageModelV1;
    reasoning: LanguageModelV1;
    output: LanguageModelV1;
  };

  /**
   * Initialize the provider with API keys from config and optional custom models
   */
  constructor({
    OPENAI_API_KEY,
    DEEPINFRA_API_KEY,
    defaultModel,
    reasoningModel,
    outputModel,
    OPENROUTER_API_KEY,
  }: {
    OPENAI_API_KEY?: string;
    DEEPINFRA_API_KEY?: string;
    defaultModel?: LanguageModelV1;
    reasoningModel?: LanguageModelV1;
    outputModel?: LanguageModelV1;
    OPENROUTER_API_KEY?: string;
  }) {
    // Set default models
    this.models = {
      default: defaultModel || createOpenRouter({ apiKey: OPENROUTER_API_KEY! }).languageModel("moonshotai/kimi-k2-0905"),
      reasoning:
        reasoningModel ||
        createOpenRouter({ apiKey: OPENROUTER_API_KEY! }).languageModel("x-ai/grok-4.1-fast", {
          reasoning: { effort: "medium" },
        }),
      output: outputModel || createOpenRouter({ apiKey: OPENROUTER_API_KEY! }).languageModel("moonshotai/kimi-k2-0905"),
    };
  }

  getModel(key: ModelType) {
    return this.models[key];
  }

  /**
   * Get a specific provider by name
   */
  getProvider(name: string): ProviderV1 | undefined {
    return this.providers.get(name);
  }
}

export default AIProvider;
