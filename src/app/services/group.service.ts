import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Group } from '../interfaces/group';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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

  getGroupinfo(groupid: string) {
    return this.db.doc<Group>(`organizations/${groupid}`).valueChanges();
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
}
