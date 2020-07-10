import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Group } from '../interfaces/group';
import { Observable, combineLatest, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Id } from '../interfaces/id';
import { AngularFireFunctions } from '@angular/fire/functions';

@Injectable({
  providedIn: 'root',
})
export class GroupGetService {
  constructor(
    private db: AngularFirestore,
    private fns: AngularFireFunctions
  ) {}

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

  getSearchableGroups(): Observable<Group[]> {
    return this.db
      .collection<Group>(`groups`, (ref) => ref.where('searchable', '==', true))
      .valueChanges();
  }
}
