import { firestore } from 'firebase';

export interface Notification {
  personUid: string; // 対象のユーザーID
  objectId: string; // イベントかグループのIDが入る
  date: firestore.Timestamp; // 参加した時間
}
