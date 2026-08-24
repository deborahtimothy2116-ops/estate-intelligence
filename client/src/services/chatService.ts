import { api } from './api';
import { Conversation, Message } from '../types';

export const chatService = {
  async getConversations() {
    const res = await api.get<{ success: boolean; conversations: Conversation[] }>('/chat/conversations');
    return res.data.conversations;
  },

  async getMessages(otherUserId: string) {
    const res = await api.get<{ success: boolean; messages: Message[] }>(`/chat/messages/${otherUserId}`);
    return res.data.messages;
  },
};
