export interface Event {
  eventid: string; // イベントID
  title: string; // イベントタイトル
  description: string; // イベント詳細
  memberlimit: number; // 参加人数制限
  attendingmembers: string[]; // 参加中の人達
  date: string; // イベント日付
  time: string; // イベント時間
  location: string; // イベント場所
  groupid: string; // イベントが作られたグループID
}
