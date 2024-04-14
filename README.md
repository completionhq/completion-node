# Completion Library

Completion lets you:

- Monitor and debug your LLM prompts in production.
- Track the usage and cost of your LLM models.

## Key Features

- **Monitor Prompts**: Track the prompts sent to your LLM models in real-time. We intentionally separate prompt arguments from the prompt template to ensure that you can monitor the prompts, automatically detect version changes, and debug issues on historical data.
- **Cost Tracking**: Track the usage and cost of your LLM models. We provide a detailed breakdown of the cost of each prompt, including the cost of the model, the cost of the prompt, and the total cost.
- **Version Control**: Manage the versions of your prompts. We automatically detect changes in the prompt template and arguments, allowing you to track the evolution of your prompts over time.

## Installation

Install the Completion Node library using npm or yarn:

```bash
npm install @completionhq/completion-node

# or

yarn add @completionhq/completion-node
```

## Usage

Below are examples demonstrating how to use Completion in your Node.js application.

Completion is LLM-agnostic, meaning it can be used with any LLM model, including those from OpenAI, Anthropic, Google, Mistral etc.

### Basic Logging

```typescript
import { Completion } from '@completionhq/completion-node';

const completion = new Completion({
  apiKey: 'abc123',
});

const promptMessages = [
  {
    role: 'User',
    message: 'Hello, how are you {name}?',
  },
  {
    role: 'Assistant',
    message: 'I am good, thank you. How can I help you today?',
  },
];

const promptArguments = {
  name: 'Alice',
};

const output = "Is there anything I can help you with today?";

await completion.log({
  templateName: 'greeting',
  promptMessages,
  promptArguments,
  output,
  model: 'gpt-3.5-turbo',
});
```

### Log with compiled prompt

```typescript

const compiledMessages = [
  {
    role: 'User',
    message: 'Hello, how are you Alice?',
  },
  {
    role: 'Assistant',
    message: 'I am good, thank you. How can I help you today?',
  },
];
await completion.log({
  templateName: 'greeting',
  compiledMessages,
  output,
  model: 'gpt-3.5-turbo',
});
```

### Use compiled prompt to log

```typescript
const compiledPrompt = "User: Hello, how are you Alice?\nAssistant: I am good, thank you. How can I help you today?";

await completion.log({
  templateName: 'greeting',
  compiledPrompt,
  output,
  model: 'gpt-3.5-turbo',
});
```
