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

  async createGroup(user: User, group: Group) {
    const id = group.id;
    await this.db
      .doc(`groups/${id}`)
      .set(group)
      .then(() => {
        this.db.doc(`groups/${id}/members/${user.uid}`).set(user);
      });
  }

  getMyGroup(uid: string): Observable<Group[]> {
    return this.db
      .collection(`groups`)
      .valueChanges()
      .pipe(
        map((allGroups: Group[]) => {
          const allGroupIds: string[] = [];
          allGroups.forEach((group: Group) => {
            allGroupIds.push(group.id);
          });
          console.log(allGroupIds);
          return allGroupIds;
        }),
        map((allGroupIds: string[]) => {
          console.log(allGroupIds);
          const myGroupIds: string[] = [];
          allGroupIds.forEach((groupId: string) => {
            this.db.collection(`groups/${groupId}/members`).valueChanges();
          });
          return myGroupIds;
        }),
        switchMap((myGroupIds: string[]) => {
          const result: Observable<Group>[] = [];
          myGroupIds.forEach((myGroupId: string) => {
            result.push(
              this.db.doc<Group>(`groups/${myGroupId}`).valueChanges()
            );
          });
          console.log(result);
          return combineLatest(result);
        })
      );
  }

  getAdminGroup(uid: string): Observable<Group[]> {
    const allGroupIds: string[] = [];
    const adminGroupIds: string[] = [];
    const adminGroups: Observable<Group>[] = [];
    this.db
      .collection(`groups`)
      .valueChanges()
      .subscribe((allGroups: Group[]) => {
        allGroups.forEach((group: Group) => {
          allGroupIds.push(group.id);
        });
        allGroupIds.forEach((groupId: string) => {
          this.db
            .collection(`groups/${groupId}/admins`)
            .valueChanges()
            .subscribe((admins: User[]) => {
              admins.forEach((admin: User) => {
                if (admin.uid === uid) {
                  adminGroupIds.push(groupId);
                }
              });
            });
        });
      });
    console.log(adminGroupIds);
    adminGroupIds.forEach((adminGroupId: string) => {
      adminGroups.push(
        this.db.doc<Group>(`groups/${adminGroupId}`).valueChanges()
      );
    });
    return combineLatest(adminGroups);
  }

  getGroupinfo(groupId: string): Observable<Group> {
    return this.db.doc<Group>(`groups/${groupId}`).valueChanges();
  }

  ifAdmin(uid: string, groupId: string): Observable<boolean> {
    return this.db
      .collection(`groups/${groupId}/admins`)
      .valueChanges()
      .pipe(
        map((admins: User[]) => {
          const adminIds: string[] = [];
          admins.forEach((admin: User) => {
            adminIds.push(admin.uid);
          });
          if (adminIds.includes(uid)) {
            return true;
          } else {
            return false;
          }
        })
      );
  }

  getMembers(groupId: string): Observable<User[]> {
    return this.db.collection<User>(`groups/${groupId}/members`).valueChanges();
  }

  getAdmins(groupId: string): Observable<User[]> {
    return this.db.collection<User>(`groups/${groupId}/admins`).valueChanges();
  }

  makeAdmin(user: User, groupId: string) {
    this.db
      .collection(`groups/${groupId}/admins`)
      .valueChanges()
      .subscribe((admins: User[]) => {
        const adminIds: string[] = [];
        admins.forEach((admin: User) => {
          adminIds.push(admin.uid);
        });
        if (!adminIds.includes(user.uid)) {
          this.db.doc(`groups/${groupId}/${user.uid}`).set(user);
        } else {
          return;
        }
      });
  }

  deleteAdmin(user: User, groupId: string) {
    this.db
      .collection(`groups/${groupId}/admins`)
      .valueChanges()
      .subscribe((admins: User[]) => {
        const adminIds: string[] = [];
        admins.forEach((admin: User) => {
          adminIds.push(admin.uid);
        });
        if (!adminIds.includes(user.uid)) {
          this.db.doc(`groups/${groupId}/${user.uid}`).delete();
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
  async deleteGroup(groupid: string) {
    await this.db
      .doc(`groups/${groupid}`)
      .delete()
      .then(() => {
        this.db
          .doc(`groups/${groupid}`)
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
          .collection(`events`, (ref) => ref.where('groupid', '==', groupid))
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
  async waitingPayinglistToMember(user: User, groupId: string) {
    await this.db
      .doc(`groups/${groupId}/members`)
      .set(user)
      .then(() => {
        this.db.doc(`groups/${groupId}`).update({
          waitingPayingMemberIds: firestore.FieldValue.arrayRemove(user.uid),
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
  leaveGroup(user: User, group: Group) {
    const memberIds: string[] = [];
    const adminIds: string[] = [];
    this.getMembers(group.id).subscribe((Members: User[]) => {
      Members.forEach((Member: User) => {
        memberIds.push(Member.uid);
      });
    });
    this.getAdmins(group.id).subscribe((Admins: User[]) => {
      Admins.forEach((Admin: User) => {
        adminIds.push(Admin.uid);
      });
    });
    if (adminIds.includes(user.uid) && adminIds.length === 1) {
      this.deleteGroup(group.id);
    } else if (
      !adminIds.includes(user.uid) &&
      memberIds.length === 1 &&
      adminIds.length === 0
    ) {
      this.deleteGroup(group.id);
    } else {
      this.db
        .doc(`groups/${group.id}/members/${user.uid}`)
        .delete()
        .then(() => {
          if (adminIds.includes(user.uid)) {
            this.db.doc(`groups/${group.id}/admins/${user.uid}`).delete();
          }
        });
    }
  }

  // nothing to member (public+free)
  joinGroup(user: User, groupId: string) {
    this.db.doc(`groups/${groupId}/members`).set(user);
  }

  // waitingPayinglist to member (public+pay)
  patToJoinGroup(user: User, groupId: string) {
    this.db.doc(`groups/${groupId}/members`).set(user);
  }

  // waitingJoinningMember list to member list (private+free)
  async allowWaitingMember(user: User, groupId: string) {
    await this.db.doc(`groups/${groupId}`).update({
      waitingJoinningMemberIds: firestore.FieldValue.arrayRemove(user.uid),
    });
    this.db.doc(`groups/${groupId}/members`).set(user);
  }
}
