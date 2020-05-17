import { Observable } from 'rxjs';

export interface Event {
  eventid: string; // イベントID
  title: string; // イベントタイトル
  description: string; // イベント詳細
  memberlimit: number; // 参加人数制限
  date: string; // イベント日付
  time: string; // イベント時間
  location: string; // イベント場所
  groupid: string; // イベントが作られたグループID
  grouppicture: number; // イベントが作られたグループ写真
}
