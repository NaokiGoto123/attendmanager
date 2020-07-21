import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Id } from '../interfaces/id';
import { switchMap, map } from 'rxjs/operators';
import { Observable, combineLatest, of } from 'rxjs';
import { Group } from '../interfaces/group';
import { Event } from '../interfaces/event';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class InviteGetService {
  constructor(private db: AngularFirestore, private authService: AuthService) {}

  getInvitedGroups(uid: string): Observable<Group[]> {
    return this.db
      .collection<Id>(`users/${uid}/invitedGroupIds`)
      .valueChanges()
      .pipe(
        switchMap((invitedGroupIds: Id[]) => {
          const invitedGroups: Observable<Group>[] = [];
          invitedGroupIds.map((invitedGroupId: Id) => {
            invitedGroups.push(
              this.db.doc<Group>(`groups/${invitedGroupId.id}`).valueChanges()
            );
          });
          return combineLatest(invitedGroups);
        })
      );
  }

  getInvitedGroupIds(uid: string): Observable<string[]> {
    return this.db
      .collection<Id>(`users/${uid}/invitedGroupIds`)
      .valueChanges()
      .pipe(
        map((invitedGroupIds: Id[]) => {
          if (invitedGroupIds.length) {
            const Ids: string[] = [];
            invitedGroupIds.map((invitedGroupId: Id) => {
              Ids.push(invitedGroupId.id);
            });
            return Ids;
          } else {
            return [];
          }
        })
      );
  }

  getGroupInvitingUsers(groupId: string): Observable<User[]> {
    return this.db
      .collection(`groups/${groupId}/invitingUserIds`)
      .valueChanges()
      .pipe(
        switchMap((invitingUserIds: Id[]) => {
          const invitingUsers: Observable<User>[] = [];
          invitingUserIds.map((invitingUserId: Id) => {
            invitingUsers.push(
              this.db.doc<User>(`users/${invitingUserId.id}`).valueChanges()
            );
          });
          return combineLatest(invitingUsers);
        })
      );
  }

  getInvitedEvents(uid: string): Observable<Event[]> {
    return this.db
      .collection<Id>(`users/${uid}/invitedEventIds`)
      .valueChanges()
      .pipe(
        switchMap((invitedEventIds: Id[]) => {
          if (invitedEventIds.length) {
            const invitedEvents: Observable<Event>[] = [];
            invitedEventIds.map((invitedEventId: Id) => {
              invitedEvents.push(
                this.db.doc<Event>(`events/${invitedEventId.id}`).valueChanges()
              );
            });
            return combineLatest(invitedEvents);
          } else {
            return of([]);
          }
        })
      );
  }

  getInvitedEventIds(uid: string): Observable<string[]> {
    return this.db
      .collection<Id>(`users/${uid}/invitedEventIds`)
      .valueChanges()
      .pipe(
        map((invitedEventIds: Id[]) => {
          if (invitedEventIds.length) {
            const Ids: string[] = [];
            invitedEventIds.map((invitedEventId: Id) => {
              Ids.push(invitedEventId.id);
            });
            return Ids;
          } else {
            return [];
          }
        })
      );
  }

  getEventInvitingUsers(eventId: string): Observable<User[]> {
    return this.db
      .collection(`events/${eventId}/invitingUserIds`)
      .valueChanges()
      .pipe(
        switchMap((invitingUserIds: Id[]) => {
          const invitingUsers: Observable<User>[] = [];
          invitingUserIds.map((invitingUserId: Id) => {
            invitingUsers.push(
              this.db.doc<User>(`users/${invitingUserId.id}`).valueChanges()
            );
          });
          return combineLatest(invitingUsers);
        })
      );
  }
}
