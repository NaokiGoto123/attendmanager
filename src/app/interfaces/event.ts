import { Group } from './group'; // なんでgroup.tsでEventを使う時にはインポートする必要がなかったのに、groupを使う時にはインポート四角てはいけなかったのか

export interface Event {
  eventid: string; // イベントID
  title: string; // イベントタイトル
  desription: string; // イベント詳細
  limit: number; // 参加人数制限
  date: string; // イベント日付
  time: string; // イベント時間
  location: string; // イベント場所
  group: Group; // イベントが作られたグループ
}
