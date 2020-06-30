import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Group } from '../interfaces/group';
import { Observable, combineLatest, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Event } from '../interfaces/event';
import { firestore } from 'firebase';
import { User } from '../interfaces/user';
import { Id } from '../interfaces/id';
import { Message } from '../interfaces/message';
import { AngularFireFunctions } from '@angular/fire/functions';
@Injectable({
  providedIn: 'root',
})
export class GroupService {
  data: any;
  deleteGroupFunction: any;

  constructor(private db: AngularFirestore, private fns: AngularFireFunctions) {
    this.deleteGroupFunction = fns.httpsCallable('deleteGroup');
  }

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

  getMyGroup(uid: string): Observable<Group[]> {
    return this.db
      .collection<Id>(`users/${uid}/groupIds`)
      .valueChanges()
      .pipe(
        switchMap((groupIds: Id[]) => {
          if (groupIds.length) {
            const myGroups: Observable<Group>[] = [];
            groupIds.forEach((groupId: Id) => {
              console.log(groupId);
              myGroups.push(
                this.db.doc<Group>(`groups/${groupId.id}`).valueChanges()
              );
            });
            return combineLatest(myGroups);
          } else {
            return of([]);
          }
        })
      );
  }

  getAdminGroup(uid: string): Observable<Group[]> {
    return this.db
      .collection<Id>(`users/${uid}/adminGroupIds`)
      .valueChanges()
      .pipe(
        switchMap((adminGroupIds: Id[]) => {
          if (adminGroupIds.length) {
            const myAdminGroups: Observable<Group>[] = [];
            adminGroupIds.forEach((adminGroupId: Id) => {
              console.log(adminGroupId);
              myAdminGroups.push(
                this.db.doc<Group>(`groups/${adminGroupId.id}`).valueChanges()
              );
            });
            return combineLatest(myAdminGroups);
          } else {
            return of([]);
          }
        })
      );
  }

  getWaitingJoinningGroups(uid: string): Observable<Group[]> {
    return this.db
      .collection<Id>(`users/${uid}/waitingJoinningGroupIds`)
      .valueChanges()
      .pipe(
        switchMap((waitingJoinningGroupIds: Id[]) => {
          if (waitingJoinningGroupIds.length) {
            const result: Observable<Group>[] = [];
            waitingJoinningGroupIds.map((waitingJoinningGroupId: Id) => {
              result.push(
                this.db
                  .doc<Group>(`groups/${waitingJoinningGroupId.id}`)
                  .valueChanges()
              );
            });
            return combineLatest(result);
          } else {
            return of([]);
          }
        })
      );
  }

  getWaitingPayingGroups(uid: string) {
    return this.db
      .collection<Id>(`users/${uid}/waitingPayingGroupIds`)
      .valueChanges()
      .pipe(
        switchMap((waitingPayingGroupIds: Id[]) => {
          if (waitingPayingGroupIds.length) {
            const result: Observable<Group>[] = [];
            waitingPayingGroupIds.map((waitingPayingGroupId: Id) => {
              result.push(
                this.db
                  .doc<Group>(`groups/${waitingPayingGroupId.id}`)
                  .valueChanges()
              );
            });
            return combineLatest(result);
          } else {
            return of([]);
          }
        })
      );
  }

  getGroupinfo(groupId: string): Observable<Group> {
    return this.db.doc<Group>(`groups/${groupId}`).valueChanges();
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

  getMemberIds(groupId: string): Observable<string[]> {
    return this.db
      .collection<Id>(`groups/${groupId}/memberIds`)
      .valueChanges()
      .pipe(
        map((memberIds: Id[]) => {
          console.log(memberIds, 'service');
          const MemberIds: string[] = [];
          memberIds.forEach((memberId: Id) => {
            MemberIds.push(memberId.id);
          });
          return MemberIds;
        })
      );
  }

  getAdminIds(groupId: string): Observable<string[]> {
    return this.db
      .collection<Id>(`groups/${groupId}/adminIds`)
      .valueChanges()
      .pipe(
        map((adminIds: Id[]) => {
          const AdminIds: string[] = [];
          adminIds.forEach((adminId: Id) => {
            AdminIds.push(adminId.id);
          });
          return AdminIds;
        })
      );
  }

  getWaitingPayingMemberIds(groupId: string): Observable<string[]> {
    return this.db
      .collection(`groups/${groupId}/waitingPayingMemberIds`)
      .valueChanges()
      .pipe(
        map((waitingPayingMemberIds: Id[]) => {
          if (waitingPayingMemberIds.length) {
            const result: string[] = [];
            waitingPayingMemberIds.map((waitingPayingMemberId: Id) => {
              result.push(waitingPayingMemberId.id);
            });
            return result;
          } else {
            return [];
          }
        })
      );
  }

  getWaitingJoinningMemberIds(groupId: string): Observable<string[]> {
    return this.db
      .collection(`groups/${groupId}/waitingJoinningMemberIds`)
      .valueChanges()
      .pipe(
        map((waitingJoinningMemberIds: Id[]) => {
          if (waitingJoinningMemberIds.length) {
            const result: string[] = [];
            waitingJoinningMemberIds.map((waitingJoinningMemberId: Id) => {
              result.push(waitingJoinningMemberId.id);
            });
            return result;
          } else {
            return [];
          }
        })
      );
  }

  makeAdmin(uid: string, groupId: string) {
    this.getAdminIds(groupId).subscribe((adminIds: string[]) => {
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
    this.getAdminIds(groupId).subscribe((adminIds: string[]) => {
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
    const result = await this.deleteGroupFunction(
      `groups/${groupId}`
    ).toPromise();
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
        console.log('test');
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
    this.getMemberIds(groupId).subscribe((memberIds: string[]) => {
      this.getAdminIds(groupId).subscribe((adminIds: string[]) => {
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
              this.db.doc(`groups/${uid}/adminGroupIds/${groupId}`).delete();
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
}
