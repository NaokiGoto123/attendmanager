import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Event } from '../interfaces/event';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { GroupService } from './group.service';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  constructor(
    private db: AngularFirestore,
    private groupService: GroupService,
    private authService: AuthService,
    private router: Router,
    private snackbar: MatSnackBar
  ) {}

  async createEvent(event: Event) {
    const id = event.eventid;
    await this.db
      .doc(`events/${id}`)
      .set(event)
      // eventIDsにeventidを追加したい
      .then(() =>
        this.db
          .doc(`organizations/${event.groupid}`)
          .update({ eventIDs: event.eventid })
      )
      .then(() =>
        this.snackbar.open('Successfully created the event', null, {
          duration: 2000,
        })
      )
      .then(() => this.router.navigateByUrl(''));
  }

  // getEvent(uid: string) {
  //   const myeventids: Observable<string[]> = this.groupService.getMyGroup(this.authService.uid)
  //   .pipe(
  //     map(
  //       (groups) => this.db.doc(`events/${groups[0].eventIDs[0]}`)
  //     )
  //   );
  // }
}
