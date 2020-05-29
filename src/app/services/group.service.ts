import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Group } from '../interfaces/group';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { firestore } from 'firebase';
@Injectable({
  providedIn: 'root',
})
export class GroupService {
  constructor(private db: AngularFirestore, private snackbar: MatSnackBar) {}

  async createGroup(group: Group) {
    const id = group.groupid;
    await this.db
      .doc(`organizations/${id}`)
      .set(group)
      .then(() =>
        this.snackbar.open('Successfully created the group', null, {
          duration: 2000,
        })
      );
  }

  getGroupName(groupid: string): Observable<string> {
    return this.db
      .doc<Group>(`organizations/${groupid}`)
      .valueChanges()
      .pipe(
        map((group: Group) => {
          return group.name;
        })
      );
  }

  getMyGroup(uid: string): Observable<Group[]> {
    return this.db
      .collection<Group>(`organizations`, (ref) =>
        ref.where(`members`, 'array-contains', uid)
      )
      .valueChanges();
  }

  getAdminGroup(uid: string): Observable<Group[]> {
    return this.db
      .collection<Group>(`organizations`, (ref) =>
        ref.where(`admin`, 'array-contains', uid)
      )
      .valueChanges();
  }

  getGroupinfo(groupid: string): Observable<Group> {
    return this.db.doc<Group>(`organizations/${groupid}`).valueChanges();
  }

  checkIfAdmin(uid: string, groupid: string): Observable<boolean> {
    return this.db
      .doc<Group>(`organizations/${groupid}`)
      .valueChanges()
      .pipe(
        map((group: Group) => {
          if (group.admin.includes(uid)) {
            return true;
          } else {
            return false;
          }
        })
      );
  }

  getGrouppicture(groupid: string): Observable<number> {
    return this.db
      .doc<Group>(`organizations/${groupid}`)
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
      'createddate' | 'creater' | 'admin' | 'members' | 'eventIDs'
    >
  ) {
    await this.db
      .doc(`organizations/${group.groupid}`)
      .set(group, { merge: true });
  }

  async deleteGroup(groupid: string) {
    await this.db
      .doc(`organizations/${groupid}`)
      .delete()
      .then(() => {
        this.db
          .doc<Group>(`organizaitons/${groupid}`)
          .valueChanges()
          .pipe(
            map((group: Group) => {
              return group.eventIDs;
            }),
            map((eventids: string[]) => {
              eventids.forEach((eventid) => {
                this.db.doc(`events/${eventid}`).delete();
              });
            })
          );
      });
  }
}
