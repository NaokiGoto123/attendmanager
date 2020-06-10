import { firestore } from 'firebase';

export interface Message {
  ownerId: string;
  content: string;
  sentAt: firestore.Timestamp;
}
