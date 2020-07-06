import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Id } from '../interfaces/id';
import { switchMap } from 'rxjs/operators';
import { Observable, combineLatest } from 'rxjs';
import { Group } from '../interfaces/group';
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
            console.log('user is already a member');
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
            console.log('successfully invited the user');
          }
        });
    } else {
      console.log('cannot invite yourself');
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

  getInvitingUsers(groupId: string): Observable<User[]> {
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
}
