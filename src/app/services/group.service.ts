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
    const id = group.groupid;
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
    await this.db.doc(`groups/${group.groupid}`).set(group, { merge: true });
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
              this.db.doc<Event>(`events/${event.eventid}`).delete();
            });
          });
      });
  }

  getPublicGroups(): Observable<Group[]> {
    return this.db
      .collection<Group>(`groups`, (ref) => ref.where('private', '==', false))
      .valueChanges();
  }

  joinGroup(uid: string, group: Group) {
    this.db
      .doc(`groups/${group.groupid}`)
      .update({ members: firestore.FieldValue.arrayUnion(uid) });
  }

  leaveGroup(uid: string, group: Group) {
    this.db
      .doc(`groups/${group.groupid}`)
      .update({ members: firestore.FieldValue.arrayRemove(uid) })
      .then(() => {
        if (group.adminIds.includes(uid)) {
          this.db
            .doc(`groups/${group.groupid}`)
            .update({ admin: firestore.FieldValue.arrayRemove(uid) });
        }
      });
  }
}
