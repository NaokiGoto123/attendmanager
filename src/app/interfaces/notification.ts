import { firestore } from 'firebase';

export interface Notification {
  id: string;
  personUid: string; // 対象のユーザーID
  objectId: string; // イベントかグループのIDが入る
  date: firestore.Timestamp; // 参加した時間
  // グループに新規のユーザーが入った、イベントに新規のユーザーが入った、イベントが新規に作成された、新規に管理者が増えた, 待ちリストに新規ユーザーが追加
  type:
    | 'joinGroup'
    | 'joinEvent'
    | 'makeEvent'
    | 'makeAdmin'
    | 'joinGroupWaitinglist'
    | 'joinEventWaitinglist';
}
