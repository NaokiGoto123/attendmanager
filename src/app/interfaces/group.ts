import { Event } from './event';

export interface Group {
  groupid: string; // グループID
  name: string; // グループ名
  description: string; // グループ詳細
  grouppicture: string; // グループ画像
  creater: string; // グループ作成者
  admin: string[]; // グループ管理者（達）
  members: string[]; // グループメンバー（達）
  events: Event[]; // グループ内で作成されたイベント（達）
}
