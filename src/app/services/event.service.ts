import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Event } from '../interfaces/event';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { GroupService } from './group.service';
import { map, switchMap } from 'rxjs/operators';
import { Observable, combineLatest } from 'rxjs';
import { firestore } from 'firebase';
import { Group } from '../interfaces/group';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  constructor(
    private db: AngularFirestore,
    private groupService: GroupService,
    private router: Router,
    private snackbar: MatSnackBar
  ) {}

  async createEvent(event: Event) {
    const id = event.eventid;
    await this.db
      .doc(`events/${id}`)
      .set(event)
      .then(() =>
        this.db
          .doc(`organizations/${event.groupid}`)
          .update({ eventIDs: firestore.FieldValue.arrayUnion(event.eventid) })
      )
      .then(() =>
        this.snackbar.open('Successfully created the event', null, {
          duration: 2000,
        })
      )
      .then(() => this.router.navigateByUrl(''));
  }

  getEvents(uid: string): Observable<Event[]> {
    const groups$: Observable<Group[]> = this.groupService.getMyGroup(uid);
    return groups$.pipe(
      switchMap((groups: Group[]) => {
        const eventIdsList: string[][] = groups.map((group) => group.eventIDs);
        const eventListObs$: Observable<Event[]>[] = eventIdsList.map(
          (eventIds: string[]) => {
            return combineLatest(
              eventIds.map((eventId) =>
                this.db.doc<Event>(`events/${eventId}`).valueChanges()
              )
            );
          }
        );
        return combineLatest(eventListObs$);
      }),
      map((eventsList: Event[][]) => {
        const results = [];
        eventsList.forEach((events) => results.push(events));
        // debug
        console.log(results);
        return results;
      })
    );
  }

  // attendEvent(uid: string, eventid: string) {
  //   this.db.doc<Event>(`events/${eventid}`)
  //   .update({attendingmembers: firestore.FieldValue.arrayUnion(uid)});
  // }
}
