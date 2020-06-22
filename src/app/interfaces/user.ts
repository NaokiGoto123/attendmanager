import { Notification } from './notification';

export interface User {
  uid: string; // ユニークID
  displayName?: string; // 表示名
  email: string; // メールアドレス
  photoURL: string; // 写真URL
  description: string; // アカウント説明
  notifications: Notification[];
  notificationCount: number;
  showGroups: boolean;
  showAttendingEvents: boolean;
  showAttendedEvents: boolean;
}
