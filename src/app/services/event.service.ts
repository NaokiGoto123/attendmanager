import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Event } from '../interfaces/event';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { GroupService } from './group.service';
import { map, switchMap } from 'rxjs/operators';
import { Observable, combineLatest, of, pipe } from 'rxjs';
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
          .doc(`groups/${event.groupid}`)
          .update({ eventIDs: firestore.FieldValue.arrayUnion(event.eventid) })
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
          return group.eventIDs;
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
    // GroupリストのObservable
    const groups$: Observable<Group[]> = this.groupService.getMyGroup(uid);
    return groups$.pipe(
      // Groupリストを元に別のObservableを返却する
      switchMap((groups: Group[]) => {
        // Groupリストの中のGroupをイベントIDリストに差し替えている。よってイベントIDリストのリストが生まれている
        const eventIdsList: string[][] = groups.map((group) => group.eventIDs);
        const eventListObs$: Observable<Event[]>[] = eventIdsList.map(
          (eventIds: string[]) => {
            if (eventIds?.length) {
              // イベントIDリストをイベントのObservableリストに差し替えている
              const events$: Observable<
                Event
              >[] = eventIds.map((eventId: string) =>
                this.db.doc<Event>(`events/${eventId}`).valueChanges()
              );
              // イベントのObservableリストをcombinaLatestで中身を取り出している
              return combineLatest(events$); // これはイベントIDリストを含むObservableである
            } else {
              return of([]);
            }
          }
        );
        // eventListObs$はObservabeのリストなのでcombineLatestで解決する
        return combineLatest(eventListObs$);
      }),
      // 二次元配列をフラットな配列にして返却
      map((eventsList: Event[][]) => {
        const results = [].concat(...eventsList);
        // debug
        console.log(results);
        return results;
      })
    );
  }

  async updateEvent(uid: string, event: Omit<Event, 'creater'>) {
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
      //   this.db
      //     .doc(`organizations/${event.groupid}`)
      //     .update({ eventIDs: firestore.FieldValue.arrayUnion(event.eventid) })
      // )
      .then(() =>
        this.db
          .doc(`groups/${groupid}`)
          .update({ eventIDs: firestore.FieldValue.arrayRemove(eventid) })
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
      .update({ attendingmembers: firestore.FieldValue.arrayUnion(uid) });
  }

  async leaveEvent(uid: string, eventid: string) {
    await this.db
      .doc(`events/${eventid}`)
      .update({ attendingmembers: firestore.FieldValue.arrayRemove(uid) });
  }
}
