export interface User {
  uid: string; // ユニークID
  displayName?: string; // 表示名
  email: string; // メールアドレス
  photoURL: string; // 写真URL
  description: string; // アカウント説明
  showGroups: boolean;
  showAttendingEvents: boolean;
  showAttendedEvents: boolean;
}
