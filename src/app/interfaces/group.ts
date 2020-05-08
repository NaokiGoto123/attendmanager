export interface Group {
  name: string; // グループ名
  description: string; // グループ詳細
  creater: string; // グループ作成者
  admin: string[]; // グループ管理者（達）
  members: string[]; // グループメンバー（達）
  events: Event[]; // グループ内で作成されたイベント（達）
}
