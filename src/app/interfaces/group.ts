import { firestore } from 'firebase';

export interface Group {
  id: string;
  name: string;
  description: string;
  grouppicture: string;
  createddate: firestore.Timestamp;
  createrId: string;
  memberlimit: number;
  // adminIds: string[]; サブコレ
  // memberIds: string[]; サブコレ
  // eventIds: string[]; サブコレ
  chatRoomId: string;
  // waitingJoinningMemberIds: string[]; サブコレ
  // waitingPayingMemberIds: string[]; サブコレ
  price: number;
  currency: string;
  private: boolean;
  searchable: boolean;
}
