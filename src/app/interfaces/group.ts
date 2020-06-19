import { firestore } from 'firebase';

export interface Group {
  id: string; // グループID
  name: string; // グループ名
  description: string; // グループ詳細
  grouppicture: number; // グループ画像
  createddate: firestore.Timestamp;
  createrId: string; // グループ作成者
  adminIds: string[]; // グループ管理者（達）
  memberIds: string[]; // グループメンバー（達）
  eventIds: string[]; // グループ内で作成されたイベントID　（複数）
  chatRoomId: string; // チャットルームID
  waitingJoinningMemberIds: string[];
  waitingPayingMemberIds: string[];
  price: number; // 入会金
  currency: string;
  private: boolean;
  searchable: boolean;
}
