import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Group } from '../interfaces/group';
import { Observable, combineLatest, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Id } from '../interfaces/id';
import { AngularFireFunctions } from '@angular/fire/functions';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class GroupGetService {
  constructor(
    private db: AngularFirestore,
    private fns: AngularFireFunctions
  ) {}

  getGroupinfo(groupId: string): Observable<Group> {
    if (this.db.doc<Group>(`groups/${groupId}`).valueChanges()) {
      return this.db.doc<Group>(`groups/${groupId}`).valueChanges();
    } else {
      return null;
    }
  }

  getMemberIds(groupId: string): Observable<string[]> {
    return this.db
      .collection<Id>(`groups/${groupId}/memberIds`)
      .valueChanges()
      .pipe(
        map((memberIds: Id[]) => {
          const MemberIds: string[] = [];
          memberIds.forEach((memberId: Id) => {
            MemberIds.push(memberId.id);
          });
          return MemberIds;
        })
      );
  }

  getMembers(groupId: string) {
    return this.db
      .collection<Id>(`groups/${groupId}/memberIds`)
      .valueChanges()
      .pipe(
        map((memberIds: Id[]) => {
          if (memberIds.length) {
            const MemberIds: string[] = [];
            memberIds.forEach((memberId: Id) => {
              MemberIds.push(memberId.id);
            });
            return MemberIds;
          } else {
            return [];
          }
        }),
        switchMap((memberIds: string[]) => {
          if (memberIds.length) {
            const members: Observable<User>[] = [];
            memberIds.map((memberId: string) => {
              members.push(
                this.db.doc<User>(`users/${memberId}`).valueChanges()
              );
            });
            return combineLatest(members);
          } else {
            return of([]);
          }
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

  getAdmins(groupId: string): Observable<User[]> {
    return this.db
      .collection<Id>(`groups/${groupId}/adminIds`)
      .valueChanges()
      .pipe(
        map((adminIds: Id[]) => {
          if (adminIds.length) {
            const AdminIds: string[] = [];
            adminIds.forEach((adminId: Id) => {
              AdminIds.push(adminId.id);
            });
            return AdminIds;
          } else {
            return [];
          }
        }),
        switchMap((adminIds: string[]) => {
          if (adminIds.length) {
            const admins: Observable<User>[] = [];
            adminIds.map((adminId: string) => {
              admins.push(this.db.doc<User>(`users/${adminId}`).valueChanges());
            });
            return combineLatest(admins);
          } else {
            return of([]);
          }
        })
      );
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

  getWaitingJoinningGroupIds(uid: string): Observable<string[]> {
    return this.db
      .collection<Id>(`users/${uid}/waitingJoinningGroupIds`)
      .valueChanges()
      .pipe(
        map((waitingJoinningGroupIds: Id[]) => {
          if (waitingJoinningGroupIds.length) {
            const Ids: string[] = [];
            waitingJoinningGroupIds.map((waitingJoinningGroupId: Id) => {
              Ids.push(waitingJoinningGroupId.id);
            });
            return Ids;
          } else {
            return [];
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

  getWaitingPayingGroupIds(uid: string): Observable<string[]> {
    return this.db
      .collection<Id>(`users/${uid}/waitingPayingGroupIds`)
      .valueChanges()
      .pipe(
        map((waitingPayingGroupIds: Id[]) => {
          if (waitingPayingGroupIds.length) {
            const Ids: string[] = [];
            waitingPayingGroupIds.map((waitingPayingGroupId: Id) => {
              Ids.push(waitingPayingGroupId.id);
            });
            return Ids;
          } else {
            return [];
          }
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

  getWaitingPayingMembers(groupId: string): Observable<User[]> {
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
        }),
        switchMap((waitingPayingMemberIds: string[]) => {
          if (waitingPayingMemberIds.length) {
            const waitingPayingMembers: Observable<User>[] = [];
            waitingPayingMemberIds.map((waitingPayingMemberId: string) => {
              waitingPayingMembers.push(
                this.db
                  .doc<User>(`users/${waitingPayingMemberId}`)
                  .valueChanges()
              );
            });
            return combineLatest(waitingPayingMembers);
          } else {
            return of([]);
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

  getWaitingJoinningMembers(groupId: string): Observable<User[]> {
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
        }),
        switchMap((waitingJoinningMemberIds: string[]) => {
          if (waitingJoinningMemberIds.length) {
            const waitingJoinningMembers: Observable<User>[] = [];
            waitingJoinningMemberIds.map((waitingJoinningMemberId: string) => {
              waitingJoinningMembers.push(
                this.db
                  .doc<User>(`users/${waitingJoinningMemberId}`)
                  .valueChanges()
              );
            });
            return combineLatest(waitingJoinningMembers);
          } else {
            return of([]);
          }
        })
      );
  }

  getSearchableGroups(): Observable<Group[]> {
    return this.db
      .collection<Group>(`groups`, (ref) => ref.where('searchable', '==', true))
      .valueChanges();
  }
}
