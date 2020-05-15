import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Group } from '../interfaces/group';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class GroupService {
  constructor(private db: AngularFirestore, private snackbar: MatSnackBar) {}

  async createGroup(group: Group) {
    const id = group.groupid;
    await this.db.doc(`organizations/${id}`).set(group);
    this.snackbar.open('Successfully created the group', null, {
      duration: 2000,
    });
  }

  getGroup(uid: string): Observable<Group[]> {
    return this.db
      .collection<Group>('organization', (ref) =>
        ref.where('members', 'array-contains', 'uid')
      )
      .valueChanges();
  }
}
