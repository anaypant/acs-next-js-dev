/**
 * File: app/types/messages.ts
 * Purpose: Unified type definitions for messages across the application
 */

export type MessageType = 'inbound-email' | 'outbound-email' | 'system' | 'note';

export interface Message {
  // Core message properties
  id: string;
  conversation_id: string;
  response_id?: string;
  type: MessageType;
  
  // Content
  content: string;
  body: string;
  subject: string;
  
  // Metadata
  timestamp: string;
  sender: string;
  recipient: string;
  receiver: string;
  associated_account: string;
  
  // Evaluation
  ev_score?: number;
  in_reply_to: string | null;
  is_first_email: boolean;
  
  // Additional metadata
  metadata?: Record<string, any>;
}

// Type guard for messages with response_id
export type MessageWithResponseId = Message & {
  response_id: string;
};

// Helper type for message display
export interface MessageDisplay {
  id: string;
  conversation_id: string;
  type: MessageType;
  content: string;
  timestamp: string;
  sender: string;
  recipient: string;
  ev_score?: number;
  subject?: string;
  metadata?: Record<string, any>;
}

// Helper type for message data in analytics
export interface MessageData {
  timestamp: string;
  evScore: number;
  conversationId: string;
} 