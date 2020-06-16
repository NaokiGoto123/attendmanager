import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Event } from '../interfaces/event';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { GroupService } from './group.service';
import { map, switchMap } from 'rxjs/operators';
import { Observable, combineLatest, of } from 'rxjs';
import { firestore } from 'firebase';
import { Group } from '../interfaces/group';
@Injectable({
  providedIn: 'root',
})
export class EventService {
  constructor(
    private db: AngularFirestore,
    private groupService: GroupService,
    private snackbar: MatSnackBar
  ) {}

  async createEvent(event: Event) {
    const id = event.eventid;
    await this.db
      .doc(`events/${id}`)
      .set(event)
      .then(() =>
        this.db
          .doc(`groups/${event.groupid}`)
          .update({ eventIds: firestore.FieldValue.arrayUnion(event.eventid) })
      )
      .then(() =>
        this.snackbar.open('Successfully created the event', null, {
          duration: 2000,
        })
      );
  }

  getEvent(eventid: string): Observable<Event> {
    return this.db.doc<Event>(`events/${eventid}`).valueChanges();
  }

  getOneGroupEvents(groupid: string): Observable<Event[]> {
    return this.db
      .doc<Group>(`groups/${groupid}`)
      .valueChanges()
      .pipe(
        map((group: Group) => {
          return group.eventIds;
        }),
        switchMap(
          (eventids: string[]): Observable<Event[]> => {
            const result: Observable<Event>[] = [];
            eventids.forEach((eventid) => {
              result.push(
                this.db.doc<Event>(`events/${eventid}`).valueChanges()
              );
            });
            return combineLatest(result);
          }
        )
      );
  }

  getEvents(uid: string): Observable<Event[]> {
    const groups$: Observable<Group[]> = this.groupService.getMyGroup(uid);
    return groups$.pipe(
      switchMap((groups: Group[]) => {
        const eventIdsList: string[][] = groups.map((group) => group.eventIds);
        const eventListObs$: Observable<Event[]>[] = eventIdsList.map(
          (eventIds: string[]) => {
            if (eventIds?.length) {
              const events$: Observable<
                Event
              >[] = eventIds.map((eventId: string) =>
                this.db.doc<Event>(`events/${eventId}`).valueChanges()
              );
              return combineLatest(events$);
            } else {
              return of([]);
            }
          }
        );
        return combineLatest(eventListObs$);
      }),
      map((eventsList: Event[][]) => {
        const results: Event[] = [].concat(...eventsList);
        console.log(results);
        return results;
      })
    );
  }

  async updateEvent(uid: string, event: Omit<Event, 'createrId'>) {
    await this.db
      .doc(`events/${event.eventid}`)
      .set(event, { merge: true })
      .then(() =>
        this.snackbar.open('Successfully updated the event', null, {
          duration: 2000,
        })
      );
  }

  async deleteEvent(eventid: string, groupid: string) {
    await this.db
      .doc(`events/${eventid}`)
      .delete()
      .then(() =>
        this.db
          .doc(`groups/${groupid}`)
          .update({ eventIds: firestore.FieldValue.arrayRemove(eventid) })
      )
      .then(() =>
        this.snackbar.open('Successfully deleted the event', null, {
          duration: 2000,
        })
      );
  }

  async attendEvent(uid: string, eventid: string) {
    await this.db
      .doc(`events/${eventid}`)
      .update({ attendingMemberIds: firestore.FieldValue.arrayUnion(uid) });
  }

  async leaveEvent(uid: string, eventid: string) {
    await this.db
      .doc(`events/${eventid}`)
      .update({ attendingMemberIds: firestore.FieldValue.arrayRemove(uid) });
  }

  getPublicEvents(): Observable<Event[]> {
    return this.db
      .collection<Event>(`events`, (ref) => ref.where('private', '==', false))
      .valueChanges();
  }

  getSearchableEvents(): Observable<Event[]> {
    return this.db
      .collection<Event>(`events`, (ref) => ref.where('searchable', '==', true))
      .valueChanges();
  }

  getAttendingEvents(uid: string): Observable<Event[]> {
    return this.db
      .collection<Event>(`events`, (ref) =>
        ref.where('attendingMemberIds', 'array-contains', uid)
      )
      .valueChanges();
  }
}
