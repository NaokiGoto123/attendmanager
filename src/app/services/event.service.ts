import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Event } from '../interfaces/event';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GroupService } from './group.service';
import { map, switchMap } from 'rxjs/operators';
import { Observable, combineLatest, of } from 'rxjs';
import { firestore } from 'firebase';
import { Group } from '../interfaces/group';
import { Id } from '../interfaces/id';
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
    const id = event.id;
    await this.db
      .doc(`events/${id}`)
      .set(event)
      .then(() =>
        this.db.doc(`groups/${event.groupid}/eventIds`).set({ id: event.id })
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

  getMyEvents(uid: string): Observable<Event[]> {
    return this.db
      .collection<Id>(`users/${uid}/eventIds`)
      .valueChanges()
      .pipe(
        map((eventIds: Id[]) => {
          if (eventIds.length) {
            const result: Observable<Event>[] = [];
            eventIds.forEach((eventId: Id) => {
              const event: Observable<Event> = this.db
                .doc<Event>(`events/${eventId.id}`)
                .valueChanges();
              result.push(event);
            });
            return combineLatest(result);
          } else {
            return of([]);
          }
        })
      );
  }

  async updateEvent(uid: string, event: Omit<Event, 'createrId'>) {
    await this.db
      .doc(`events/${event.id}`)
      .set(event, { merge: true })
      .then(() =>
        this.snackbar.open('Successfully updated the event', null, {
          duration: 2000,
        })
      );
  }

  async deleteEvent(eventId: string, groupId: string) {
    await this.db
      .doc(`events/${eventId}`)
      .delete()
      .then(() => this.db.doc(`groups/${groupId}/eventIds/${eventId}`).delete())
      .then(() => {
        this.db
          .collection<Id>(`groups/${groupId}/attendingMemberIds`)
          .valueChanges()
          .subscribe((attendingMemberIds: Id[]) => {
            attendingMemberIds.forEach((attendingMemberId: Id) => {
              this.db
                .doc(
                  `groups/${groupId}/attendingMemberIds/${attendingMemberId.id}`
                )
                .delete();
            });
          });
      })
      .then(() => {
        this.db
          .collection(`groups/${groupId}/waitingJoinningMemberIds`)
          .valueChanges()
          .subscribe((waitingJoinningMemberIds: Id[]) => {
            waitingJoinningMemberIds.forEach((waitingJoinningMemberId: Id) => {
              this.db
                .doc(
                  `groups/${groupId}/attendingMemberIds/${waitingJoinningMemberId.id}`
                )
                .delete();
            });
          });
      })
      .then(() => {
        this.db
          .collection(`groups/${groupId}/waitingPayingMemberIds`)
          .valueChanges()
          .subscribe((waitingPayingMemberIds: Id[]) => {
            waitingPayingMemberIds.forEach((waitingPayingMemberId: Id) => {
              this.db
                .doc(
                  `groups/${groupId}/attendingMemberIds/${waitingPayingMemberId.id}`
                )
                .delete();
            });
          });
      })
      .then(() =>
        this.snackbar.open('Successfully deleted the event', null, {
          duration: 2000,
        })
      );
  }

  getSearchableEvents(): Observable<Event[]> {
    return this.db
      .collection<Event>(`events`, (ref) => ref.where('searchable', '==', true))
      .valueChanges();
  }

  // need to work
  getAttendingEvents(uid: string): Observable<Event[]> {
    this.db.collection(`events`);
    return this.db
      .collection<Event>(`events`, (ref) =>
        ref.where('attendingMemberIds', 'array-contains', uid)
      )
      .valueChanges();
  }

  // nothing to attending (pay+public, pay+private, free+public, free+private)
  async attendEvent(uid: string, eventId: string) {
    await this.db
      .doc(`events/${eventId}/attendingMemberIds/${uid}`)
      .set({ id: uid })
      .then(() => {
        this.db.doc(`users/${uid}/eventIds/${eventId}`).set({ id: eventId });
      });
  }

  // waitingPayinglist to attending (pay+public, pay+private, free+public, free+private)
  async payToAttendEvent(uid: string, eventId: string) {
    await this.db
      .doc(`events/${eventId}/'attendingMemberIds'/${uid}`)
      .set({ id: uid })
      .then(() => {
        this.db
          .doc(`events/${eventId}/'waitingPayingMemberIds'/${uid}`)
          .delete();
      })
      .then(() => {
        this.db.doc(`users/${uid}/eventIds/${eventId}`).set({ id: eventId });
      });
  }

  // attending to nothing (pay+public, pay+private, free+public, free+private)
  async leaveEvent(uid: string, eventid: string) {
    await this.db
      .doc(`events/${eventid}`)
      .update({ attendingMemberIds: firestore.FieldValue.arrayRemove(uid) });
  }

  // nothing to waitingJoinning (pay+private, free+private)
  async joinWaitingJoinningList(uid: string, eventId: string) {
    await this.db.doc(`events/${eventId}`).update({
      waitingJoinningMemberIds: firestore.FieldValue.arrayUnion(uid),
    });
  }

  // waitingJoinning to waitingPaying (pay+private)
  async joinWaitingPayingList(uid: string, eventId: string) {
    await this.db
      .doc(`events/${eventId}`)
      .update({
        waitingJoinningMemberIds: firestore.FieldValue.arrayRemove(uid),
      })
      .then(() => {
        this.db.doc(`events/${eventId}`).update({
          waitingPayingMemberIds: firestore.FieldValue.arrayUnion(uid),
        });
      });
  }

  // waitingJoinning to nothing (pay+private, free+private)
  async removeWaitingJoinningMember(uid: string, eventId: string) {
    await this.db.doc(`events/${eventId}`).update({
      waitingJoinningMemberIds: firestore.FieldValue.arrayRemove(uid),
    });
  }

  // waitingPaying to nothing (pay+private)
  async removeWaitingPayingMember(uid: string, eventId: string) {
    await this.db.doc(`events/${eventId}`).update({
      waitingPayingMemberIds: firestore.FieldValue.arrayRemove(uid),
    });
  }

  // waitingJoinning to attending (free+private)
  async waitingJoinningMemberToAttendingMember(uid: string, eventId: string) {
    await this.db
      .doc(`events/${eventId}`)
      .update({
        waitingJoinningMemberIds: firestore.FieldValue.arrayRemove(uid),
      })
      .then(() => {
        this.db
          .doc(`events/${eventId}`)
          .update({ attendingMemberIds: firestore.FieldValue.arrayUnion(uid) });
      });
  }
}
