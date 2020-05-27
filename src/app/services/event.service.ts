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
    // GroupリストのObservable
    const groups$: Observable<Group[]> = this.groupService.getMyGroup(uid);
    return groups$.pipe(
      // Groupリストを元に別のObservableを返却する
      switchMap((groups: Group[]) => {
        // Groupリストの中のGroupをイベントIDリストに差し替えている。よってイベントIDリストのリストが生まれている
        const eventIdsList: string[][] = groups.map((group) => group.eventIDs);
        const eventListObs$: Observable<Event[]>[] = eventIdsList.map(
          (eventIds: string[]) => {
            // イベントIDリストをイベントのObservableリストに差し替えている
            const events$: Observable<
              Event
            >[] = eventIds.map((eventId: string) =>
              this.db.doc<Event>(`events/${eventId}`).valueChanges()
            );
            // イベントのObservableリストをcombinaLatestで中身を取り出している
            return combineLatest(events$); // これはイベントIDリストを含むObservableである
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

  async updateEvent(uid: string, event: Event) {
    await this.db
      .doc(`events/${event.eventid}`)
      .set(event, { merge: true })
      .then(() =>
        this.snackbar.open('Successfully updated the event', null, {
          duration: 2000,
        })
      )
      .then(() => this.router.navigateByUrl(''));
  }

  async deleteEvent(eventid: string) {
    await this.db
      .doc(`events/${eventid}`)
      .delete()
      .then(() =>
        this.snackbar.open('Successfully updated the event', null, {
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
