import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Event } from '../interfaces/event';
import { AngularFireFunctions } from '@angular/fire/functions';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  constructor(
    private db: AngularFirestore,
    private fns: AngularFireFunctions
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

  async updateEvent(uid: string, event: Omit<Event, 'createrId'>) {
    await this.db.doc(`events/${event.id}`).set(event, { merge: true });
  }

  async deleteEvent(eventId: string, groupId: string) {
    const deleteEventFunction = this.fns.httpsCallable('deleteEvent');
    const result = await deleteEventFunction(eventId).toPromise();
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
      })
      .then(() => {
        this.db.doc(`users/${uid}/waitingPayingEventIds/${eventId}`).delete();
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
      .set({ id: uid })
      .then(() => {
        this.db
          .doc(`users/${uid}/waitingJoinningEventIds/${eventId}`)
          .set({ id: eventId });
      });
  }

  // waitingJoinning to waitingPaying (pay+private)
  async joinWaitingPayingList(uid: string, eventId: string) {
    await this.db
      .doc(`events/${eventId}/waitingJoinningMemberIds/${uid}`)
      .delete()
      .then(() => {
        this.db.doc(`users/${uid}/waitingJoinningEventIds/${eventId}`).delete();
      })
      .then(() => {
        this.db
          .doc(`events/${eventId}/waitingPayingMemberIds/${uid}`)
          .set({ id: uid });
      })
      .then(() => {
        this.db
          .doc(`users/${uid}/waitingPayingEventIds/${eventId}`)
          .set({ id: eventId });
      });
  }

  // waitingJoinning to nothing (pay+private, free+private)
  async removeWaitingJoinningMember(uid: string, eventId: string) {
    await this.db
      .doc(`events/${eventId}/waitingJoinningMemberIds/${uid}`)
      .delete()
      .then(() => {
        this.db.doc(`users/${uid}/waitingJoinningEventIds/${eventId}`).delete();
      });
  }

  // waitingPaying to nothing (pay+private)
  async removeWaitingPayingMember(uid: string, eventId: string) {
    await this.db
      .doc(`events/${eventId}/waitingPayingMemberIds/${uid}`)
      .delete()
      .then(() => {
        this.db.doc(`users/${uid}/waitingPayingEventIds/${eventId}`).delete();
      });
  }

  // waitingJoinning to attending (free+private)
  async waitingJoinningMemberToAttendingMember(uid: string, eventId: string) {
    await this.db
      .doc(`events/${eventId}/waitingJoinningMemberIds/${uid}`)
      .delete()
      .then(() => {
        this.db.doc(`users/${uid}/waitingJoinningEventIds/${eventId}`).delete();
      })
      .then(() => {
        this.db
          .doc(`events/${eventId}/attendingMemberIds/${uid}`)
          .set({ id: uid });
      })
      .then(() => {
        this.db.doc(`users/${uid}/eventIds/${eventId}`).set({ id: eventId });
      });
  }

  // invitingUserIds to attedingMemberIds
  async invitingUserListToAttendingMembers(uid: string, eventId: string) {
    this.db
      .doc(`events/${eventId}/invitingUserIds/${uid}`)
      .delete()
      .then(() => {
        this.db.doc(`users/${uid}/invitedEventIds/${eventId}`).delete();
      })
      .then(() => {
        this.db
          .doc(`events/${eventId}/attendingMemberIds/${uid}`)
          .set({ id: uid });
      })
      .then(() => {
        this.db.doc(`users/${uid}/groupIds/${eventId}`).set({ id: eventId });
      });
  }

  // invitingUserIds to attedingMemberIds
  async PayToInvitingUserListToAttendingMembers(uid: string, eventId: string) {
    this.db
      .doc(`events/${eventId}/invitingUserIds/${uid}`)
      .delete()
      .then(() => {
        this.db.doc(`users/${uid}/invitedEventIds/${eventId}`).delete();
      })
      .then(() => {
        this.db
          .doc(`events/${eventId}/attendingMemberIds/${uid}`)
          .set({ id: uid });
      })
      .then(() => {
        this.db.doc(`users/${uid}/eventIds/${eventId}`).set({ id: eventId });
      });
  }
}
