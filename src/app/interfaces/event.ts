import { firestore } from 'firebase';

export interface Event {
  eventid: string; // イベントID
  title: string; // イベントタイトル
  description: string; // イベント詳細
  createrId: string; // イベント作った人
  memberlimit: number; // 参加人数制限
  attendingMemberIds: string[]; // 参加中の人達
  date: firestore.Timestamp; // イベント日付
  time: string; // イベント時間
  location: string; // イベント場所
  groupid: string; // イベントが作られたグループID
  price: number; // 参加費
  private: boolean;
  searchable: boolean;
}
