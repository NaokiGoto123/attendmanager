import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { markEventTried, shouldEventRun } from './util';

const db = admin.firestore();

export const joinGroup = functions
  .region('asia-northeast1')
  .firestore.document('groups/{groupId}/memberIds/{memberId}')
  .onCreate(async (snap, context) => {
    const eventId = context.eventId;
    return shouldEventRun(eventId).then(async (should: boolean) => {
      if (should) {
        const data = snap.data();

        if (!data) return;

        const newMemberId: string = context.params.memberId;

        const newMember = (await db.doc(`users/${newMemberId}`).get()).data();

        const groupId: string = context.params.groupId;

        const group = (await db.doc(`groups/${groupId}`).get()).data();

        const adminIds = (
          await db.collection(`groups/${groupId}/adminIds`).get()
        ).docs.map((doc) => doc.data());

        const sendNotifications = adminIds.map((adminId) => {
          const docRef = db
            .collection(`users/${adminId.id}/notifications`)
            .doc();
          const Id: string = docRef.id;
          return db.doc(`users/${adminId.id}/notifications/${Id}`).set({
            id: Id,
            person: newMember,
            group: group,
            event: null,
            date: admin.firestore.Timestamp.now(),
            type: 'joinGroup',
          });
        });
        await Promise.all(sendNotifications);

        const incrementNotificationCount = adminIds.map((adminId) => {
          return db
            .doc(`users/${adminId.id}`)
            .update(
              'notificationCount',
              admin.firestore.FieldValue.increment(1)
            );
        });
        await Promise.all(incrementNotificationCount);

        return markEventTried(eventId);
      } else {
        return true;
      }
    });
  });

export const joinGroupWaitinglist = functions
  .region('asia-northeast1')
  .firestore.document(
    'groups/{groupId}/waitingJoinningMemberIds/{waitingJoinningMemberId}'
  )
  .onCreate(async (snap, context) => {
    const eventId = context.eventId;
    return shouldEventRun(eventId).then(async (should: boolean) => {
      if (should) {
        const data = snap.data();

        if (!data) return;

        const groupId = context.params.groupId;

        const group = (await db.doc(`groups/${groupId}`).get()).data();

        const waitingJoinningMemberId = context.params.waitingJoinningMemberId;

        const waitingJoinningMember = (
          await db.doc(`users/${waitingJoinningMemberId}`).get()
        ).data();

        const adminIds = (
          await db.collection(`groups/${groupId}/adminIds`).get()
        ).docs.map((doc) => doc.data());

        const sendNotifications = adminIds.map((adminId) => {
          const docRef = db
            .collection(`users/${adminId.id}/notifications`)
            .doc();
          const Id: string = docRef.id;

          return db.doc(`users/${adminId.id}/notifications/${Id}`).set({
            id: Id,
            person: waitingJoinningMember,
            group: group,
            event: null,
            date: admin.firestore.Timestamp.now(),
            type: 'joinGroupWaitinglist',
          });
        });
        await Promise.all(sendNotifications);

        const incrementNotificationCount = adminIds.map((adminId) => {
          return db
            .doc(`users/${adminId.id}`)
            .update(
              'notificationCount',
              admin.firestore.FieldValue.increment(1)
            );
        });
        await Promise.all(incrementNotificationCount);

        return markEventTried(eventId);
      } else {
        return true;
      }
    });
  });

export const makeAdmin = functions
  .region('asia-northeast1')
  .firestore.document('groups/{groupId}/adminIds/{adminId}')
  .onCreate(async (snap, context) => {
    const eventId = context.eventId;
    return shouldEventRun(eventId).then(async (should: boolean) => {
      if (should) {
        const data = snap.data();

        if (!data) return;

        const groupId = context.params.groupId;

        const group = (await db.doc(`groups/${groupId}`).get()).data();

        const newAdminId = context.params.adminId;

        const newAdmin = (await db.doc(`users/${newAdminId}`).get()).data();

        const adminIds = (
          await db.collection(`groups/${groupId}/adminIds`).get()
        ).docs.map((doc) => doc.data());

        const sendNotifications = adminIds.map((adminId) => {
          const docRef = db
            .collection(`users/${adminId.id}/notifications`)
            .doc();
          const Id: string = docRef.id;

          return db.doc(`users/${adminId.id}/notifications/${Id}`).set({
            id: Id,
            person: newAdmin,
            group: group,
            event: null,
            date: admin.firestore.Timestamp.now(),
            type: 'makeAdmin',
          });
        });
        await Promise.all(sendNotifications);

        const incrementNotificationCount = adminIds.map((adminId) => {
          return db
            .doc(`users/${adminId.id}`)
            .update(
              'notificationCount',
              admin.firestore.FieldValue.increment(1)
            );
        });
        await Promise.all(incrementNotificationCount);

        return markEventTried(eventId);
      } else {
        return true;
      }
    });
  });

export const makeEvent = functions
  .region('asia-northeast1')
  .firestore.document('groups/{groupId}/eventIds/{eventId}')
  .onCreate(async (snap, context) => {
    const eventId = context.eventId;
    return shouldEventRun(eventId).then(async (should: boolean) => {
      if (should) {
        const data = snap.data();

        if (!data) return;

        const groupId = context.params.groupId;

        const group = (await db.doc(`groups/${groupId}`).get()).data();

        const EventId = context.params.eventId;

        const event = (await db.doc(`users/${EventId}`).get()).data();

        const adminIds = (
          await db.collection(`groups/${groupId}/adminIds`).get()
        ).docs.map((doc) => doc.data());

        const sendNotifications = adminIds.map((adminId) => {
          const docRef = db
            .collection(`users/${adminId.id}/notifications`)
            .doc();
          const Id: string = docRef.id;

          return db.doc(`users/${adminId.id}/notifications/${Id}`).set({
            id: Id,
            person: null,
            group: group,
            event: event,
            date: admin.firestore.Timestamp.now(),
            type: 'makeEvent',
          });
        });
        await Promise.all(sendNotifications);

        const incrementNotificationCount = adminIds.map((adminId) => {
          return db
            .doc(`users/${adminId.id}`)
            .update(
              'notificationCount',
              admin.firestore.FieldValue.increment(1)
            );
        });
        await Promise.all(incrementNotificationCount);
        return markEventTried(eventId);
      } else {
        return true;
      }
    });
  });

export const joinEvent = functions
  .region('asia-northeast1')
  .firestore.document('events/{eventId}/attendingMemberIds/{attendingMemberId}')
  .onCreate(async (snap, context) => {
    const eventId = context.eventId;
    return shouldEventRun(eventId).then(async (should: boolean) => {
      if (should) {
        const data = snap.data();

        if (!data) return;

        const EventId: string = context.params.eventId;

        const event = (await db.doc(`events/${EventId}`).get()).data();

        const groupId: string = event?.groupid;

        const group = (await db.doc(`groups/${groupId}`).get()).data();

        const adminIds = (
          await db.collection(`groups/${groupId}/adminIds`).get()
        ).docs.map((doc) => doc.data());

        const newAttendingMemberId: string = context.params.attendingMemberId;

        const newAttendingMember = (
          await db.doc(`users/${newAttendingMemberId}`).get()
        ).data();

        const sendNotifications = adminIds.map((adminId) => {
          const docRef = db
            .collection(`users/${adminId.id}/notifications`)
            .doc();
          const Id: string = docRef.id;

          return db.doc(`users/${adminId.id}/notifications/${Id}`).set({
            id: Id,
            person: newAttendingMember,
            group: group,
            event: event,
            date: admin.firestore.Timestamp.now(),
            type: 'joinEvent',
          });
        });
        await Promise.all(sendNotifications);

        const incrementNotificationCount = adminIds.map((adminId) => {
          return db
            .doc(`users/${adminId.id}`)
            .update(
              'notificationCount',
              admin.firestore.FieldValue.increment(1)
            );
        });
        await Promise.all(incrementNotificationCount);

        return markEventTried(eventId);
      } else {
        return true;
      }
    });
  });

export const joinEventWaitinglist = functions
  .region('asia-northeast1')
  .firestore.document(
    'events/{eventId}/waitingJoinningMemberIds/{waitingJoinningMemberId}'
  )
  .onCreate(async (snap, context) => {
    const eventId = context.eventId;
    return shouldEventRun(eventId).then(async (should: boolean) => {
      if (should) {
        const data = snap.data();

        if (!data) return;

        const EventId = context.params.eventId;

        const event = (await db.doc(`events/${EventId}`).get()).data();

        const groupId = event?.groupid;

        const group = (await db.doc(`groups/${groupId}`).get()).data();

        const waitingJoinningMemberId = context.params.waitingJoinningMemberId;

        const waitingJoinningMember = (
          await db.doc(`users/${waitingJoinningMemberId}`).get()
        ).data();

        const adminIds = (
          await db.collection(`groups/${groupId}/adminIds`).get()
        ).docs.map((doc) => doc.data());

        const sendNotifications = adminIds.map((adminId) => {
          const docRef = db
            .collection(`users/${adminId.id}/notifications`)
            .doc();
          const Id: string = docRef.id;

          return db.doc(`users/${adminId.id}/notifications/${Id}`).set({
            id: Id,
            person: waitingJoinningMember,
            group: group,
            event: event,
            date: admin.firestore.Timestamp.now(),
            type: 'joinEventWaitinglist',
          });
        });
        await Promise.all(sendNotifications);

        const incrementNotificationCount = adminIds.map((adminId) => {
          return db
            .doc(`users/${adminId.id}`)
            .update(
              'notificationCount',
              admin.firestore.FieldValue.increment(1)
            );
        });
        await Promise.all(incrementNotificationCount);

        return markEventTried(eventId);
      } else {
        return true;
      }
    });
  });
