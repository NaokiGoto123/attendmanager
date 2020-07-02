import { firestore } from 'firebase';

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
