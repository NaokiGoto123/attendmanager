import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Event } from '../interfaces/event';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GroupService } from './group.service';
import { map, switchMap } from 'rxjs/operators';
import { Observable, combineLatest, of, ObservableLike } from 'rxjs';
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
        this.db
          .doc(`groups/${event.groupid}/eventIds/${event.id}`)
          .set({ id: event.id })
      );
  }

  getEvent(eventid: string): Observable<Event> {
    return this.db.doc<Event>(`events/${eventid}`).valueChanges();
  }

  getMyEvents(uid: string): Observable<Event[]> {
    return this.db
      .collection<Id>(`users/${uid}/groupIds`)
      .valueChanges()
      .pipe(
        map((Ids: Id[]) => {
          console.log(Ids);
          const groupIds: string[] = [];
          Ids.map((id: Id) => {
            groupIds.push(id.id);
          });
          return groupIds;
        }),
        switchMap((groupIds: string[]) => {
          const eventIdsList: Observable<Id[]>[] = [];
          groupIds.map((groupId: string) => {
            const eventIds: Observable<Id[]> = this.db
              .collection<Id>(`groups/${groupId}/eventIds`)
              .valueChanges();
            eventIdsList.push(eventIds);
          });
          return combineLatest(eventIdsList);
        }),
        switchMap((eventIdsList: Id[][]) => {
          const events: Observable<Event>[] = [];
          eventIdsList.map((eventIds: Id[]) => {
            eventIds.map((eventId: Id) => {
              const event: Observable<Event> = this.db
                .doc<Event>(`events/${eventId.id}`)
                .valueChanges();
              events.push(event);
            });
          });
          console.log(events);
          return combineLatest(events);
        })
      );
  }

  async updateEvent(uid: string, event: Omit<Event, 'createrId'>) {
    await this.db.doc(`events/${event.id}`).set(event, { merge: true });
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
            attendingMemberIds.map((attendingMemberId: Id) => {
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
            waitingJoinningMemberIds.map((waitingJoinningMemberId: Id) => {
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
            waitingPayingMemberIds.map((waitingPayingMemberId: Id) => {
              this.db
                .doc(
                  `groups/${groupId}/attendingMemberIds/${waitingPayingMemberId.id}`
                )
                .delete();
            });
          });
      })
      .then(() => {
        this.db
          .collection(`events/${eventId}/attendingMemberIds`)
          .valueChanges()
          .subscribe((attendingMemberIds: Id[]) => {
            attendingMemberIds.map((attendingMemberId: Id) => {
              this.db
                .doc(`users/${attendingMemberId.id}/eventIds/${eventId}`)
                .delete();
            });
          });
      });
  }

  getSearchableEvents(): Observable<Event[]> {
    return this.db
      .collection<Event>(`events`, (ref) => ref.where('searchable', '==', true))
      .valueChanges();
  }

  getAttendingMemberIds(eventId: string): Observable<string[]> {
    return this.db
      .collection(`events/${eventId}/attendingMemberIds`)
      .valueChanges()
      .pipe(
        map((attendingMemberIds: Id[]) => {
          if (attendingMemberIds.length) {
            const result: string[] = [];
            attendingMemberIds.map((attendingMemberId: Id) => {
              result.push(attendingMemberId.id);
            });
            return result;
          } else {
            return [];
          }
        })
      );
  }

  getWaitingPayingMemberIds(eventId: string): Observable<string[]> {
    return this.db
      .collection(`events/${eventId}/waitingPayingMemberIds`)
      .valueChanges()
      .pipe(
        map((waitingPayingMemberIds: Id[]) => {
          if (waitingPayingMemberIds.length) {
            const result: string[] = [];
            waitingPayingMemberIds.map((waitingPayingMemberId: Id) => {
              result.push(waitingPayingMemberId.id);
            });
            return result;
          } else {
            return [];
          }
        })
      );
  }

  getWaitingJoinningMemberIds(eventId: string): Observable<string[]> {
    return this.db
      .collection(`events/${eventId}/waitingJoinningMemberIds`)
      .valueChanges()
      .pipe(
        map((waitingJoinningMemberIds: Id[]) => {
          if (waitingJoinningMemberIds.length) {
            const result: string[] = [];
            waitingJoinningMemberIds.map((waitingJoinningMemberId: Id) => {
              result.push(waitingJoinningMemberId.id);
            });
            return result;
          } else {
            return [];
          }
        })
      );
  }

  // need to work
  getAttendingEvents(uid: string): Observable<Event[]> {
    return this.db
      .collection(`users/${uid}/eventIds`)
      .valueChanges()
      .pipe(
        switchMap((eventIds: Id[]) => {
          if (eventIds.length) {
            const result: Observable<Event>[] = [];
            eventIds.map((eventId: Id) => {
              const attendingEvent: Observable<Event> = this.db
                .doc<Event>(`events/${eventId.id}`)
                .valueChanges();
              result.push(attendingEvent);
            });
            return combineLatest(result);
          } else {
            return of([]);
          }
        })
      );
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
      .doc(`events/${eventId}/attendingMemberIds/${uid}`)
      .set({ id: uid })
      .then(() => {
        this.db.doc(`users/${uid}/eventIds/${eventId}`).set({ id: eventId });
      })
      .then(() => {
        this.db.doc(`events/${eventId}/waitingPayingMemberIds/${uid}`).delete();
      });
  }

  // attending to nothing (pay+public, pay+private, free+public, free+private)
  async leaveEvent(uid: string, eventId: string) {
    await this.db
      .doc(`events/${eventId}/attendingMemberIds/${uid}`)
      .delete()
      .then(() => {
        this.db.doc(`users/${uid}/eventIds/${eventId}`).delete();
      });
  }

  // nothing to waitingJoinning (pay+private, free+private)
  async joinWaitingJoinningList(uid: string, eventId: string) {
    await this.db
      .doc(`events/${eventId}/waitingJoinningMemberIds/${uid}`)
      .set({ id: uid });
  }

  // waitingJoinning to waitingPaying (pay+private)
  async joinWaitingPayingList(uid: string, eventId: string) {
    await this.db
      .doc(`events/${eventId}/waitingJoinningMemberIds/${uid}`)
      .delete()
      .then(() => {
        this.db
          .doc(`events/${eventId}/waitingPayingMemberIds/${uid}`)
          .set({ id: uid });
      });
  }

  // waitingJoinning to nothing (pay+private, free+private)
  async removeWaitingJoinningMember(uid: string, eventId: string) {
    await this.db
      .doc(`events/${eventId}/waitingJoinningMemberIds/${uid}`)
      .delete();
  }

  // waitingPaying to nothing (pay+private)
  async removeWaitingPayingMember(uid: string, eventId: string) {
    await this.db
      .doc(`events/${eventId}/waitingPayingMemberIds/${uid}`)
      .delete();
  }

  // waitingJoinning to attending (free+private)
  async waitingJoinningMemberToAttendingMember(uid: string, eventId: string) {
    await this.db
      .doc(`events/${eventId}/waitingJoinningMemberIds/${uid}`)
      .delete()
      .then(() => {
        this.db
          .doc(`events/${eventId}/attendingMemberIds/${uid}`)
          .set({ id: uid });
      });
  }
}
