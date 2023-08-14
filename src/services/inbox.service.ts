// import { localStorageKeys } from "../common/storage-keys";
import { Conversation, Message } from "../interfaces/chat.interface";

import { axiosInstance } from "./base.service";

const getMyConversations = async (): Promise<Conversation[]> => {
  return (await axiosInstance.get("conversations")).data;
};

const getConversationById = async(conversationId: number) : Promise<Message[]> => {
    return (await axiosInstance.get(`conversations/${conversationId}/messages`)).data;
}

export const ChatService = {
  getMyConversations,
  getConversationById
};
