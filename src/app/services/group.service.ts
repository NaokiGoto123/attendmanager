import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Group } from '../interfaces/group';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  constructor(private db: AngularFirestore, private snackbar: MatSnackBar) {}

  createGroup(group: Group) {
    const id = group.groupid;
    return this.db
      .doc(`organizations/${id}`)
      .set(group)
      .then(() => {
        this.snackbar.open('Successfully created the group', null, {
          duration: 2000,
        });
      });
  }
}
