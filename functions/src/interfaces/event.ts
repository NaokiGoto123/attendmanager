export interface Event {
  id: string; // イベントID
  title: string; // イベントタイトル
  description: string; // イベント詳細
  createrId: string; // イベント作った人
  memberlimit: number; // 参加人数制限
  // attendingMemberIds: string[]; // 参加中の人達 // サブコレ
  date: Date; // イベント日付
  time: string; // イベント時間
  location: string; // イベント場所
  groupid: string; // イベントが作られたグループID
  price: number; // 参加費
  currency: string;
  // waitingJoinningMemberIds: string[]; // サブコレ
  // waitingPayingMemberIds: string[]; // サブコレ
  private: boolean;
  searchable: boolean;
}
