import { Message } from './message';

export interface ChatRoom {
  id: string;
  groupid: string;
  members: string[];
  messages: Message[];
}
