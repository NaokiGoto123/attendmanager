import { Group } from './group';
import { Event } from './event';

export interface User {
  uid: string; // ユニークID
  displayName?: string; // 表示名
  email: string; // メールアドレス
  photoURL: string; // 写真URL
  groups: string[]; // 参加しているグループID（複数）
  events: string[]; // 参加しているイベントID（複数）
}
