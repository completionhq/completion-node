import { ChatCompletionMessageParam } from 'openai/resources';

export type CompletionMessage = ChatCompletionMessageParam;

export interface CompletionOptions {
  logId?: string;
  templateName: string;
  promptTemplate?: string;
  messagesTemplate?: Array<CompletionMessage>;
  promptArguments?: Record<string, unknown>;
  model: string;
  modelArguments?: Record<string, unknown>;
  output: string;
  compiledPrompt?: string;
  compiledMessages?: Array<CompletionMessage>;
  metadata?: Record<string, unknown>;
  parser?: 'fstring' | 'handlebars' | string;
}
