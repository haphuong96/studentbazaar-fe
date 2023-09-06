import { User } from "./user.interface";

export interface Message {
  id: number;
  message: string;
  conversation: Conversation;
  sender: User;
  messageType: string;
  createdDatetime: string;
}

export interface Conversation {
  id: number;
  participants: User[];
  lastMessage?: Message[];
  isNew?: boolean;
  isRead?: boolean;
}

export interface ConversationParticipant {
  id: number;
  conversation: Conversation;
  participant: User;
  lastReadMessage: Message;
}