import { firestore } from 'firebase';

export interface Message {
  id: string;
  ownerId: string;
  ownerPhotoURL: string;
  content: string;
  sentAt: firestore.Timestamp;
}
