import { User } from "./user.interface";

export interface Message {
  id: number;
  message: string;
  conversation: number;
  sender: User;
  messageTypes: string;
  createdDatetime: string;
}

export interface Conversation {
  id: number;
  participants: User[];
  lastMessage?: Message[];
  isNew?: boolean;
}
