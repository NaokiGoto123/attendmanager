import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Group } from '../interfaces/group';
import { Observable, combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Event } from '../interfaces/event';
import { firestore } from 'firebase';
import { User } from '../interfaces/user';
@Injectable({
  providedIn: 'root',
})
export class GroupService {
  constructor(private db: AngularFirestore) {}

  async createGroup(uid: string, group: Group) {
    console.log('complete');
    await this.db
      .doc(`groups/${group.id}`)
      .set(group)
      .then(() => {
        console.log('test');
        this.db.doc(`users/${uid}/groupIds/${group.id}`).set(group.id);
        console.log('complete1');
      })
      .then(() => {
        this.db.doc(`users/${uid}/adminGroupIds/${group.id}`).set(group.id);
        console.log('complete2');
      })
      .then(() => {
        this.db.doc(`groups/${group.id}/adminIds/${uid}`).set(uid);
        console.log('complete3');
      })
      .then(() => {
        this.db.doc(`groups/${group.id}/memberIds/${uid}`).set(uid);
        console.log('complete4');
      });
  }

  getMyGroup(uid: string): Observable<Group[]> {
    return this.db
      .collection<string>(`usres/${uid}/groupIds`)
      .valueChanges()
      .pipe(
        switchMap((groupIds: string[]) => {
          const myGroups: Observable<Group>[] = [];
          groupIds.forEach((groupId: string) => {
            console.log(groupId);
            myGroups.push(
              this.db.doc<Group>(`groups/${groupId}`).valueChanges()
            );
          });
          console.log(myGroups);
          return combineLatest(myGroups);
        })
      );
  }

  getAdminGroup(uid: string): Observable<Group[]> {
    return this.db
      .collection<string>(`usres/${uid}/adminGroupIds`)
      .valueChanges()
      .pipe(
        switchMap((adminGroupIds: string[]) => {
          const myAdminGroups: Observable<Group>[] = [];
          adminGroupIds.forEach((adminGroupId: string) => {
            console.log(adminGroupId);
            myAdminGroups.push(
              this.db.doc<Group>(`groups/${adminGroupId}`).valueChanges()
            );
          });
          console.log(myAdminGroups);
          return combineLatest(myAdminGroups);
        })
      );
  }

  getGroupinfo(groupId: string): Observable<Group> {
    return this.db.doc<Group>(`groups/${groupId}`).valueChanges();
  }

  ifAdmin(uid: string, groupId: string): Observable<boolean> {
    return this.db
      .collection<string>(`groups/${groupId}/adminIds`)
      .valueChanges()
      .pipe(
        map((adminIds: string[]) => {
          if (adminIds.includes(uid)) {
            return true;
          } else {
            return false;
          }
        })
      );
  }

  getMemberIds(groupId: string): Observable<string[]> {
    return this.db
      .collection<string>(`groups/${groupId}/memberIds`)
      .valueChanges();
  }

  getAdminIds(groupId: string): Observable<string[]> {
    return this.db
      .collection<string>(`groups/${groupId}/adminIds`)
      .valueChanges();
  }

  makeAdmin(uid: string, groupId: string) {
    this.db
      .collection(`groups/${groupId}/adminIds`)
      .valueChanges()
      .subscribe((adminIds: string[]) => {
        if (!adminIds.includes(uid)) {
          this.db
            .doc(`groups/${groupId}/adminIds/${uid}`)
            .set(uid)
            .then(() => {
              this.db.doc(`users/${uid}/adminGroupIds/${groupId}`).set(groupId);
            });
        } else {
          return;
        }
      });
  }

  deleteAdmin(uid: string, groupId: string) {
    this.db
      .collection(`groups/${groupId}/adminIds`)
      .valueChanges()
      .subscribe((adminIds: string[]) => {
        if (adminIds.includes(uid)) {
          this.db.doc(`groups/${groupId}/${uid}`).delete();
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
    await this.db
      .doc(`groups/${groupId}`)
      .delete()
      .then(() => {
        this.db
          .doc(`groups/${groupId}`)
          .valueChanges()
          .pipe(
            map((group: Group) => {
              return group.chatRoomId;
            })
          )
          .subscribe((chatRoomId: string) => {
            this.db.doc(`chatRooms/${chatRoomId}`).delete();
          });
      })
      .then(() => {
        this.db
          .collection(`gruops/${groupId}/memberIds`)
          .valueChanges()
          .subscribe((memberIds: string[]) => {
            memberIds.forEach((memberId: string) => {
              this.db.doc(`users/${memberId}/groupIds/${groupId}`).delete();
            });
          });
      })
      .then(() => {
        this.db
          .collection(`gruops/${groupId}/adminIds`)
          .valueChanges()
          .subscribe((adminIds: string[]) => {
            adminIds.forEach((adminId: string) => {
              this.db.doc(`users/${adminId}/groupIds/${groupId}`).delete();
            });
          });
      })
      .then(() => {
        const memberIds: string[] = [];
        const adminIds: string[] = [];
        this.getMemberIds(groupId).subscribe((MemberIds: string[]) => {
          MemberIds.forEach((MemberId: string) => {
            memberIds.push(MemberId);
          });
        });
        this.getAdminIds(groupId).subscribe((AdminIds: string[]) => {
          AdminIds.forEach((AdminId: string) => {
            adminIds.push(AdminId);
          });
        });
        memberIds.forEach((memberId: string) => {
          this.db.doc(`users/${memberId}/groupIds/${groupId}`).delete();
        });
        adminIds.forEach((adminId: string) => {
          this.db.doc(`users/${adminId}/adminGroupIds/${groupId}`).delete();
        });
      })
      .then(() => {
        this.db
          .collection(`events`, (ref) => ref.where('groupid', '==', groupId))
          .valueChanges()
          .subscribe((events: Event[]) => {
            events.forEach((event) => {
              this.db.doc<Event>(`events/${event.id}`).delete();
            });
          });
      });
  }

  getSearchableGroups(): Observable<Group[]> {
    return this.db
      .collection<Group>(`groups`, (ref) => ref.where('searchable', '==', true))
      .valueChanges();
  }

  // nothing to waitingJoinning (private+pay, private+free)
  async joinWaitingJoinningList(uid: string, groupId: string) {
    await this.db.doc(`groups/${groupId}`).update({
      waitingJoinningMemberIds: firestore.FieldValue.arrayUnion(uid),
    });
  }

  // waitingJoinning list to nothing (private+pay, private+free)
  async leaveWaitingList(uid: string, groupId: string) {
    await this.db.doc(`groups/${groupId}`).update({
      waitingJoinningMemberIds: firestore.FieldValue.arrayRemove(uid),
    });
  }

  // waitingJoinning to waitingPaying (private+pay)
  async waitingJoinningMemberToWaitingPayingMember(
    uid: string,
    groupId: string
  ) {
    await this.db
      .doc(`groups/${groupId}`)
      .update({
        waitingJoinningMemberIds: firestore.FieldValue.arrayRemove(uid),
      })
      .then(() => {
        this.db.doc(`groups/${groupId}`).update({
          waitingPayingMemberIds: firestore.FieldValue.arrayUnion(uid),
        });
      });
  }

  // waitingPayinglist to member (private+pay)
  async waitingPayinglistToMember(uid: string, groupId: string) {
    await this.db
      .doc(`groups/${groupId}/memberIds`)
      .set(uid)
      .then(() => {
        this.db.doc(`users/${uid}/groupIds/${groupId}`).set(groupId);
      })
      .then(() => {
        this.db.doc(`groups/${groupId}`).update({
          waitingPayingMemberIds: firestore.FieldValue.arrayRemove(uid),
        });
      });
  }

  // waitingPaying to nothing (private+pay)
  async removeWaitingPayingMember(uid: string, groupId: string) {
    await this.db.doc(`groups/${groupId}`).update({
      waitingPayingMemberIds: firestore.FieldValue.arrayRemove(uid),
    });
  }

  // member to nothing (private+free, private+pay, public+free, public+pay)
  leaveGroup(uid: string, groupId: string) {
    const memberIds: string[] = [];
    const adminIds: string[] = [];
    this.getMemberIds(groupId).subscribe((MemberIds: string[]) => {
      MemberIds.forEach((MemberId: string) => {
        memberIds.push(MemberId);
      });
    });
    this.getAdminIds(groupId).subscribe((AdminIds: string[]) => {
      AdminIds.forEach((AdminId: string) => {
        adminIds.push(AdminId);
      });
    });
    if (adminIds.includes(uid) && adminIds.length === 1) {
      this.deleteGroup(groupId);
    } else if (
      !adminIds.includes(uid) &&
      memberIds.length === 1 &&
      adminIds.length === 0
    ) {
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
  }

  // nothing to member (public+free)
  joinGroup(uid: string, groupId: string) {
    this.db
      .doc(`groups/${groupId}/memberIds`)
      .set(uid)
      .then(() => {
        this.db.doc(`users/${uid}/groupIds/${groupId}`).set(groupId);
      });
  }

  // waitingPayinglist to member (public+pay)
  patToJoinGroup(uid: string, groupId: string) {
    this.db
      .doc(`groups/${groupId}/memberIds`)
      .set(uid)
      .then(() => {
        this.db.doc(`users/${uid}/groupIds/${groupId}`).set(groupId);
      });
  }

  // waitingJoinningMember list to member list (private+free)
  async allowWaitingMember(uid: string, groupId: string) {
    await this.db.doc(`groups/${groupId}`).update({
      waitingJoinningMemberIds: firestore.FieldValue.arrayRemove(uid),
    });
    this.db
      .doc(`groups/${groupId}/memberIds`)
      .set(uid)
      .then(() => {
        this.db.doc(`users/${uid}/groupIds/${groupId}`).set(groupId);
      });
  }
}
