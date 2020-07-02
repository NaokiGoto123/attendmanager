import { Message } from './message';

export interface ChatRoom {
  id: string;
  name: string;
  groupid: string;
  messageCount: number;
}
