import { firestore } from 'firebase';

export interface Group {
  groupid: string; // グループID
  name: string; // グループ名
  description: string; // グループ詳細
  grouppicture: number; // グループ画像
  createddate: firestore.Timestamp;
  creater: string; // グループ作成者
  admin: string[]; // グループ管理者（達）
  members: string[]; // グループメンバー（達）
  eventIDs: string[]; // グループ内で作成されたイベントID　（複数）
  private: boolean;
  searchable: boolean;
}
