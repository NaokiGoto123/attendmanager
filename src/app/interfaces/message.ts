import { firestore } from 'firebase';

export interface Message {
  ownerId: string;
  ownerPhotoURL: string;
  content: string;
  sentAt: firestore.Timestamp;
}
