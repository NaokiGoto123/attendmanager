import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Id } from '../interfaces/id';
import { switchMap } from 'rxjs/operators';
import { Observable, combineLatest, of } from 'rxjs';
import { Group } from '../interfaces/group';
import { Event } from '../interfaces/event';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class InviteService {
  constructor(private db: AngularFirestore, private authService: AuthService) {}

  async inviteToGroup(uid: string, groupId: string) {
    if (uid !== this.authService.uid) {
      const memberIds: string[] = [];
      this.db
        .collection<Id>(`groups/${groupId}/memberIds`)
        .valueChanges()
        .subscribe((MemberIds: Id[]) => {
          MemberIds.map((MemberId: Id) => {
            memberIds.push(MemberId.id);
          });
          if (memberIds.includes(uid)) {
            return;
          } else {
            this.db
              .doc(`groups/${groupId}/invitingUserIds/${uid}`)
              .set({ id: uid })
              .then(() => {
                this.db
                  .doc(`users/${uid}/invitedGroupIds/${groupId}`)
                  .set({ id: groupId });
              });
          }
        });
    } else {
      return;
    }
  }

  uninviteFromGroup(uid: string, groupId: string) {
    this.db
      .doc(`groups/${groupId}/invitingUserIds/${uid}`)
      .delete()
      .then(() => {
        this.db.doc(`users/${uid}/invitedGroupIds/${groupId}`).delete();
      });
  }

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

  // inviteToEvent(uid: string, eventId: string) {
  //   this.db
  //     .doc(`events/${eventId}/invitingUserIds/${uid}`)
  //     .set({ id: uid })
  //     .then(() => {
  //       this.db
  //         .doc(`users/${uid}/invitedEventIds/${eventId}`)
  //         .set({ id: eventId });
  //     });
  // }
  inviteToEvent(uid: string, eventId: string) {
    if (uid !== this.authService.uid) {
      const memberIds: string[] = [];
      this.db
        .collection<Id>(`events/${eventId}/attendingMemberIds`)
        .valueChanges()
        .subscribe((attendingMemberIds: Id[]) => {
          attendingMemberIds.map((attendingMemberId: Id) => {
            memberIds.push(attendingMemberId.id);
          });
          if (memberIds.includes(uid)) {
            console.log('already attending');
            return;
          } else {
            this.db
              .doc(`events/${eventId}/invitingUserIds/${uid}`)
              .set({ id: uid })
              .then(() => {
                this.db
                  .doc(`users/${uid}/invitedEventIds/${eventId}`)
                  .set({ id: eventId });
              });
          }
        });
    } else {
      console.log('cannot invite yourself');
      return;
    }
  }

  uninviteFromEvent(uid: string, eventId: string) {
    this.db
      .doc(`events/${eventId}/invitingUserIds/${uid}`)
      .delete()
      .then(() => {
        this.db.doc(`users/${uid}/invitedEventIds/${eventId}`).delete();
      });
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
