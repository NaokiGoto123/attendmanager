import { Message } from './message';

export interface ChatRoom {
  id: string;
  name: string;
  groupid: string;
  members: string[];
  messages: Message[];
  messageCount: number;
}
