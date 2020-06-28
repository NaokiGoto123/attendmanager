import { Message } from './message';

export interface ChatRoom {
  id: string;
  name: string;
  groupid: string;
  // memberIds: string[]; // サブコレ
  // messages: Message[]; // サブコレ
  messageCount: number;
}
