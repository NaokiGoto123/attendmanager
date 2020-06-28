import { firestore } from 'firebase';
import { Group } from './group';
import { User } from './user';
import { Event } from './event';

export interface Notification {
  id: string;
  person: User;
  target: User;
  group: Group;
  event: Event;
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
