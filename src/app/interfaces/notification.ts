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
  date: firestore.Timestamp;
  type:
    | 'joinGroup'
    | 'joinEvent'
    | 'makeEvent'
    | 'makeAdmin'
    | 'joinGroupWaitinglist'
    | 'joinEventWaitinglist'
    | 'invitingUser'
    | 'getInvitation';
}
