import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { DEFAULT_API_URL } from './constants';
import { CompletionOptions } from './types';

class Completion {
  public apiKey: string;
  public apiUrl: string;

  /**
   * Create a new Completion instance.
   * @param options - The options for the Completion instance.
   * @param options.apiKey - The API key to use for the Completion instance. If not provided, the COMPLETION_API_KEY environment variable will be used.
   * @param options.apiUrl - The URL of the Completion API. If not provided, the default URL will be used.
   * @throws An error if the API key is missing.
   * @example
   * ```typescript
   * const completion = new Completion({ apiKey });
   * ```
   */
  constructor(options?: { apiKey?: string; apiUrl?: string }) {
    this.apiKey = options?.apiKey ?? process.env.COMPLETION_API_KEY ?? '';
    if (this.apiKey.length === 0) {
      throw new Error(
        'API key is missing. Please provide an API key or set the COMPLETION_API_KEY environment variable.',
      );
    }
    this.apiUrl = options?.apiUrl ?? DEFAULT_API_URL;
  }

  /**
   * Log a completion to the Completion API. One of promptTemplate, messagesTemplate, compiledPrompt, or compiledMessages is required.
   * @param options - The options for the completion.
   * @param options.logId - The ID to use for the completion log. If not provided, a random UUID will be generated.
   * @param options.templateName - The name of the template used for the completion.
   * @param options.promptTemplate - The template used to generate the prompt.
   * @param options.messagesTemplate - The template used to generate the messages.
   * @param options.promptArguments - The arguments used to fill in the prompt template.
   * @param options.model - The model used for the completion.
   * @param options.modelArguments - The arguments used to configure the model.
   * @param options.output - The output of the completion.
   * @param options.compiledPrompt - The prompt generated from the prompt template and arguments.
   * @param options.compiledMessages - The messages generated from the messages template.
   * @param options.metadata - Additional metadata to include with the completion.
   * @param options.parser - The parser used to compile the prompt and messages.
   * @returns A promise that resolves when the completion is logged.
   * @throws An error if the template name is missing or if neither promptTemplate, messagesTemplate, compiledPrompt, nor compiledMessages is provided.
   * @example
   * ```typescript
   * const completion = new Completion({ apiKey
   * await completion.log({
   *  templateName: 'template_name',
   * promptTemplate: 'prompt_template',
   * messagesTemplate: [{ role: 'system', content: 'Hello, world!' }],
   * promptArguments: { name: 'world' },
   * model: 'gpt-3.5-turbo',
   * modelArguments: { temperature: 0.5 },
   * output: 'Hello, world!',
   * compiledPrompt: 'Hello, world!',
   * compiledMessages: [{ role: 'system', content: 'Hello, world!' }],
   * metadata: { key: 'value' },
   * parser: 'fstring',
   * });
   * ```
   */
  async log(options: CompletionOptions): Promise<void> {
    const {
      logId = uuidv4(),
      templateName,
      promptTemplate,
      messagesTemplate,
      promptArguments,
      model,
      modelArguments,
      output,
      compiledPrompt,
      compiledMessages,
      metadata,
      parser,
    } = options;

    // Template name is required.
    if (!templateName) {
      throw new Error('Template name is required.');
    }

    // User can choose to provide template in two formats: promptTemplate or messagesTemplate
    // Only one of them is required.
    // If neither promptTemplate nor messagesTemplate is provided, then the user must provide compiledPrompt or compiledMessages
    if (
      !promptTemplate &&
      !messagesTemplate &&
      !compiledPrompt &&
      !compiledMessages
    ) {
      throw new Error(
        'Either promptTemplate, messagesTemplate, compiledPrompt, or compiledMessages is required.',
      );
    }

    // Only one of promptTemplate, messagesTemplate, compiledPrompt, or compiledMessages is allowed.
    if (
      [
        promptTemplate,
        messagesTemplate,
        compiledPrompt,
        compiledMessages,
      ].filter(x => x !== undefined).length > 1
    ) {
      throw new Error(
        'Only one of promptTemplate, messagesTemplate, compiledPrompt, or compiledMessages is allowed.',
      );
    }

    const payload = {
      log_id: logId,
      template_name: templateName,
      prompt_template: promptTemplate,
      messages_template: messagesTemplate,
      prompt_arguments: promptArguments,
      model,
      model_arguments: modelArguments,
      output,
      compiled_prompt: compiledPrompt,
      compiled_messages: compiledMessages,
      metadata,
      parser,
    };

    try {
      const response = await axios.post(this.apiUrl, payload, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      });
      console.log('Completion logged successfully:', response.data);
    } catch (error) {
      console.error('Error logging completion:', error);
    }
  }
}

export default Completion;
