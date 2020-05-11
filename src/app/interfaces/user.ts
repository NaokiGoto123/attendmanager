import { Group } from './group';
import { Event } from './event';

export interface User {
  uid: string; // ユニークID
  diplayname: string; // 表示名
  email: string; // メールアドレス
  groups: Group[]; // 参加しているグループ（複数）
  Events: Event[]; // 参加しているイベント（複数）
}
