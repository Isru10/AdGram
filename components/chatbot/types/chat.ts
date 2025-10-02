// src/types/chat.ts

// The roles used by the Gemini API in conversation history are 'user' and 'model'.
export type Role = 'user' | 'model';

/**
 * Defines the structure for a single message in the conversation.
 */
export interface ChatMessage {
  role: Role;
  content: string;
  timestamp: number; // Useful for sorting and uniqueness
}

/**
 * Defines the structure for the API request sent from the client to the server.
 * It contains the entire history of the conversation to maintain context.
 */
export interface ChatApiRequest {
  history: ChatMessage[];
  // Optional: If you want to allow the client to set model config
  // config?: { temperature: number };
}

/**
 * Defines the structure for the API response.
 * Since we are streaming, this is often less critical, but good for error definitions.
 */
export interface ChatApiResponse {
  // In a non-streaming scenario, this would hold the full message.
  // In a streaming scenario, the body is the raw text stream.
  message?: ChatMessage;
  error?: string;
}