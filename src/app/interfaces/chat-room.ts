import { Message } from './message';

export interface ChatRoom {
  id: string;
  members: string[];
  messages: Message[];
}
