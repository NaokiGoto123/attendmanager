import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Group } from '../interfaces/group';
import { Observable, combineLatest, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { User } from '../interfaces/user';
import { Id } from '../interfaces/id';
import { Message } from '../interfaces/message';
import { AngularFireFunctions } from '@angular/fire/functions';
import { GroupGetService } from './group-get.service';
@Injectable({
  providedIn: 'root',
})
export class GroupService {
  constructor(
    private db: AngularFirestore,
    private fns: AngularFireFunctions,
    private groupGetService: GroupGetService
  ) {}

  async createGroup(uid: string, group: Group) {
    await this.db
      .doc(`groups/${group.id}`)
      .set(group)
      .then(() => {
        this.db.doc(`users/${uid}/groupIds/${group.id}`).set({ id: group.id });
      })
      .then(() => {
        this.db
          .doc(`users/${uid}/adminGroupIds/${group.id}`)
          .set({ id: group.id });
      })
      .then(() => {
        this.db.doc(`groups/${group.id}/adminIds/${uid}`).set({ id: uid });
      })
      .then(() => {
        this.db.doc(`groups/${group.id}/memberIds/${uid}`).set({ id: uid });
      });
  }

  ifAdmin(uid: string, groupId: string): Observable<boolean> {
    return this.db
      .collection<Id>(`groups/${groupId}/adminIds`)
      .valueChanges()
      .pipe(
        map((adminIds: Id[]) => {
          const AdminIds: string[] = [];
          adminIds.forEach((adminId: Id) => {
            AdminIds.push(adminId.id);
          });
          if (AdminIds.includes(uid)) {
            return true;
          } else {
            return false;
          }
        })
      );
  }

  makeAdmin(uid: string, groupId: string) {
    this.groupGetService
      .getAdminIds(groupId)
      .subscribe((adminIds: string[]) => {
        if (!adminIds.includes(uid)) {
          this.db
            .doc(`groups/${groupId}/adminIds/${uid}`)
            .set({ id: uid })
            .then(() => {
              this.db
                .doc(`users/${uid}/adminGroupIds/${groupId}`)
                .set({ id: groupId });
            });
        } else {
          return;
        }
      });
  }

  deleteAdmin(uid: string, groupId: string) {
    this.groupGetService
      .getAdminIds(groupId)
      .subscribe((adminIds: string[]) => {
        if (adminIds.includes(uid)) {
          this.db
            .doc(`groups/${groupId}/adminIds/${uid}`)
            .delete()
            .then(() => {
              this.db.doc(`users/${uid}/adminGroupIds/${groupId}`).delete();
            });
        } else {
          return;
        }
      });
  }

  async updateGroup(
    group: Omit<
      Group,
      | 'createddate'
      | 'createrId'
      | 'eventIds'
      | 'chatRoomId'
      | 'waitingJoinningMemberIds'
      | 'waitingPayingMemberIds'
    >
  ) {
    await this.db.doc(`groups/${group.id}`).set(group, { merge: true });
  }

  // delete chatroom at the same time
  async deleteGroup(groupId: string) {
    const deleteGroupFunction = this.fns.httpsCallable('deleteGroup');
    const deleteGroup = await deleteGroupFunction(groupId).toPromise();
  }

  getSearchableGroups(): Observable<Group[]> {
    return this.db
      .collection<Group>(`groups`, (ref) => ref.where('searchable', '==', true))
      .valueChanges();
  }

  // nothing to waitingJoinning (private+pay, private+free)
  async joinWaitingJoinningList(uid: string, groupId: string) {
    await this.db
      .doc(`groups/${groupId}/waitingJoinningMemberIds/${uid}`)
      .set({ id: uid })
      .then(() => {
        this.db
          .doc(`users/${uid}/waitingJoinningGroupIds/${groupId}`)
          .set({ id: groupId });
      });
  }

  // waitingJoinning list to nothing (private+pay, private+free)
  async leaveWaitingList(uid: string, groupId: string) {
    await this.db
      .doc(`groups/${groupId}/waitingJoinningMemberIds/${uid}`)
      .delete()
      .then(() => {
        this.db.doc(`users/${uid}/waitingJoinningGroupIds/${groupId}`).delete();
      });
  }

  // waitingJoinning to waitingPaying (private+pay)
  async waitingJoinningMemberToWaitingPayingMember(
    uid: string,
    groupId: string
  ) {
    await this.db
      .doc(`groups/${groupId}/waitingJoinningMemberIds/${uid}`)
      .delete()
      .then(() => {
        this.db.doc(`users/${uid}/waitingJoinningGroupIds/${groupId}`).delete();
      })
      .then(() => {
        this.db
          .doc(`groups/${groupId}/waitingPayingMemberIds/${uid}`)
          .set({ id: uid });
      })
      .then(() => {
        this.db
          .doc(`users/${uid}/waitingPayingGroupIds/${groupId}`)
          .set({ id: groupId });
      });
  }

  // waitingPayinglist to member (private+pay)
  async waitingPayinglistToMember(uid: string, groupId: string) {
    await this.db
      .doc(`groups/${groupId}/memberIds/${uid}`)
      .set({ id: uid })
      .then(() => {
        this.db.doc(`users/${uid}/groupIds/${groupId}`).set({ id: groupId });
      })
      .then(() => {
        this.db.doc(`groups/${groupId}/waitingPayingMemberIds/${uid}`).delete();
      })
      .then(() => {
        this.db.doc(`users/${uid}/waitingPayingGroupIds/${groupId}`).delete();
      });
  }

  // waitingPaying to nothing (private+pay)
  async removeWaitingPayingMember(uid: string, groupId: string) {
    await this.db
      .doc(`groups/${groupId}/waitingPayingMemberIds/${uid}`)
      .delete()
      .then(() => {
        this.db.doc(`users/${uid}/waitingPayingGroupIds/${groupId}`).delete();
      });
  }

  // member to nothing (private+free, private+pay, public+free, public+pay)
  leaveGroup(uid: string, groupId: string) {
    this.groupGetService
      .getMemberIds(groupId)
      .subscribe((memberIds: string[]) => {
        this.groupGetService
          .getAdminIds(groupId)
          .subscribe((adminIds: string[]) => {
            if (memberIds.includes(uid) && memberIds.length === 1) {
              this.deleteGroup(groupId);
            } else if (adminIds.includes(uid) && adminIds.length === 1) {
              this.deleteGroup(groupId);
            } else {
              this.db
                .doc(`groups/${groupId}/memberIds/${uid}`)
                .delete()
                .then(() => {
                  this.db.doc(`groups/${groupId}/adminIds/${uid}`).delete();
                })
                .then(() => {
                  this.db.doc(`users/${uid}/groupIds/${groupId}`).delete();
                })
                .then(() => {
                  this.db
                    .doc(`groups/${uid}/adminGroupIds/${groupId}`)
                    .delete();
                });
            }
          });
      });
  }

  // nothing to member (public+free)
  joinGroup(uid: string, groupId: string) {
    this.db
      .doc(`groups/${groupId}/memberIds/${uid}`)
      .set({ id: uid })
      .then(() => {
        this.db.doc(`users/${uid}/groupIds/${groupId}`).set({ id: groupId });
      });
  }

  // nothing to member (public+pay)
  payToJoinGroup(uid: string, groupId: string) {
    this.db
      .doc(`groups/${groupId}/memberIds/${uid}`)
      .set({ id: uid })
      .then(() => {
        this.db.doc(`users/${uid}/groupIds/${groupId}`).set({ id: groupId });
      });
  }

  // waitingJoinningMember list to member list (private+free)
  async allowWaitingMember(uid: string, groupId: string) {
    this.db
      .doc(`groups/${groupId}/waitingJoinningMemberIds/${uid}`)
      .delete()
      .then(() => {
        this.db.doc(`users/${uid}/waitingJoinningGroupIds/${groupId}`).delete();
      })
      .then(() => {
        this.db.doc(`groups/${groupId}/memberIds/${uid}`).set({ id: uid });
      })
      .then(() => {
        this.db.doc(`users/${uid}/groupIds/${groupId}`).set({ id: groupId });
      });
  }

  // invitingUserIds to memberIds
  async invitingUserListToMembers(uid: string, groupId: string) {
    this.db
      .doc(`groups/${groupId}/invitingUserIds/${uid}`)
      .delete()
      .then(() => {
        this.db.doc(`users/${uid}/invitedGroupIds/${groupId}`).delete();
      })
      .then(() => {
        this.db.doc(`groups/${groupId}/memberIds/${uid}`).set({ id: uid });
      })
      .then(() => {
        this.db.doc(`users/${uid}/groupIds/${groupId}`).set({ id: groupId });
      });
  }

  // invitingUserIds to memberIds
  async PayToInvitingUserListToMembers(uid: string, groupId: string) {
    this.db
      .doc(`groups/${groupId}/invitingUserIds/${uid}`)
      .delete()
      .then(() => {
        this.db.doc(`users/${uid}/invitedGroupIds/${groupId}`).delete();
      })
      .then(() => {
        this.db.doc(`groups/${groupId}/memberIds/${uid}`).set({ id: uid });
      })
      .then(() => {
        this.db.doc(`users/${uid}/groupIds/${groupId}`).set({ id: groupId });
      });
  }
}
