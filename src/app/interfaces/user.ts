import { Group } from './group';
import { Event } from './event';

export interface User {
  uid: string; // ユニークID
  displayname: string; // 表示名
  email: string; // メールアドレス
  groups: Group[]; // 参加しているグループ（複数）
  events: Event[]; // 参加しているイベント（複数）
}
