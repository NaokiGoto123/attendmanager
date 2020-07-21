import { firestore } from 'firebase';
import { Group } from './group';

export interface Event {
  id: string;
  title: string;
  description: string;
  createrId: string;
  memberlimit: number;
  date: firestore.Timestamp;
  time: string;
  location: string;
  groupid: string;
  price: number;
  currency: string;
  private: boolean;
  searchable: boolean;
}

export interface EventWithGroupId extends Event {
  groupName: string;
}
