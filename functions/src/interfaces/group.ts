export interface Group {
  id: string; // グループID
  name: string; // グループ名
  description: string; // グループ詳細
  grouppicture: string; // グループ画像
  createddate: Date;
  createrId: string; // グループ作成者
  chatRoomId: string; // チャットルームID
  price: number; // 入会金
  currency: string;
  private: boolean;
  searchable: boolean;
}
