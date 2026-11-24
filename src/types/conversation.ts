export type ConversationStatus = 'OPEN' | 'CLOSED';
export type MessageDirection = 'INBOUND' | 'OUTBOUND';
export type MessageType = 'TEXT' | 'BUTTON' | 'SYSTEM';

export interface Conversation {
  id: string;
  workspace_id: string;
  instagram_account_id: string;
  contact_id: string;
  status: ConversationStatus;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  direction: MessageDirection;
  message_type: MessageType;
  text: string;
  external_message_id: string | null;
  created_at: string;
}
