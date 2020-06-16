import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Group } from '../interfaces/group';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Event } from '../interfaces/event';
import { firestore } from 'firebase';
@Injectable({
  providedIn: 'root',
})
export class GroupService {
  constructor(private db: AngularFirestore, private snackbar: MatSnackBar) {}

  async createGroup(group: Group) {
    const id = group.id;
    await this.db
      .doc(`groups/${id}`)
      .set(group)
      .then(() =>
        this.snackbar.open('Successfully created the group', null, {
          duration: 2000,
        })
      );
  }

  getGroupName(groupid: string): Observable<string> {
    return this.db
      .doc<Group>(`groups/${groupid}`)
      .valueChanges()
      .pipe(
        map((group: Group) => {
          return group.name;
        })
      );
  }

  getMyGroup(uid: string): Observable<Group[]> {
    return this.db
      .collection<Group>(`groups`, (ref) =>
        ref.where(`memberIds`, 'array-contains', uid)
      )
      .valueChanges();
  }

  getAdminGroup(uid: string): Observable<Group[]> {
    return this.db
      .collection<Group>(`groups`, (ref) =>
        ref.where(`adminIds`, 'array-contains', uid)
      )
      .valueChanges();
  }

  getGroupinfo(groupid: string): Observable<Group> {
    return this.db.doc<Group>(`groups/${groupid}`).valueChanges();
  }

  checkIfAdmin(uid: string, groupid: string): Observable<boolean> {
    return this.db
      .doc<Group>(`groups/${groupid}`)
      .valueChanges()
      .pipe(
        map((group: Group) => {
          if (group.adminIds.includes(uid)) {
            return true;
          } else {
            return false;
          }
        })
      );
  }

  getGrouppicture(groupid: string): Observable<number> {
    return this.db
      .doc<Group>(`groups/${groupid}`)
      .valueChanges()
      .pipe(
        map((group: Group) => {
          return group.grouppicture;
        })
      );
  }

  async updateGroup(
    group: Omit<
      Group,
      'createddate' | 'createrId' | 'adminIds' | 'memberIds' | 'eventIds'
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
        console.log(groupid);
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

  getPublicGroups(): Observable<Group[]> {
    return this.db
      .collection<Group>(`groups`, (ref) => ref.where('private', '==', false))
      .valueChanges();
  }

  getSearchableGroups(): Observable<Group[]> {
    return this.db
      .collection<Group>(`groups`, (ref) => ref.where('searchable', '==', true))
      .valueChanges();
  }

  joinGroup(uid: string, group: Group) {
    this.db
      .doc(`groups/${group.id}`)
      .update({ memberIds: firestore.FieldValue.arrayUnion(uid) });
  }

  leaveGroup(uid: string, group: Group) {
    if (group.adminIds.includes(uid) && group.adminIds.length === 1) {
      this.deleteGroup(group.id);
    } else if (
      !group.adminIds.includes(uid) &&
      group.memberIds.length === 1 &&
      group.adminIds.length === 0
    ) {
      this.deleteGroup(group.id);
    } else {
      this.db
        .doc(`groups/${group.id}`)
        .update({ memberIds: firestore.FieldValue.arrayRemove(uid) })
        .then(() => {
          if (group.adminIds.includes(uid)) {
            this.db
              .doc(`groups/${group.id}`)
              .update({ adminIds: firestore.FieldValue.arrayRemove(uid) });
          }
        });
    }
  }

  async removeMember(uid: string, groupId: string) {
    await this.db
      .doc(`groups/${groupId}`)
      .update({ memberIds: firestore.FieldValue.arrayRemove(uid) });
  }

  // for a user who wants to join
  async joinWaitingList(uid: string, groupId: string) {
    await this.db
      .doc(`groups/${groupId}`)
      .update({ waitingMemberIds: firestore.FieldValue.arrayUnion(uid) });
  }

  // for a user who wants to join
  async leaveWaitingList(uid: string, groupId: string) {
    await this.db
      .doc(`groups/${groupId}`)
      .update({ waitingMemberIds: firestore.FieldValue.arrayRemove(uid) });
  }

  // for an admin to use
  async removeWaitingMember(uid: string, groupId: string) {
    await this.db
      .doc(`groups/${groupId}`)
      .update({ waitingMemberIds: firestore.FieldValue.arrayRemove(uid) });
  }

  // for an admin to use
  async allowWaitingMember(uid: string, groupId: string) {
    await this.db
      .doc(`groups/${groupId}`)
      .update({ waitingMemberIds: firestore.FieldValue.arrayRemove(uid) });
    await this.db
      .doc(`groups/${groupId}`)
      .update({ memberIds: firestore.FieldValue.arrayUnion(uid) });
  }
}
