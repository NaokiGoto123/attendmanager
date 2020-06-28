import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

export const joinGroup = functions
  .region('asia-northeast1')
  .firestore.document('groups/{groupId}/memberIds/{memberId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();

    if (!data) return;

    console.log('joinGroup is running');

    const newMemberId: string = context.params.memberId;

    const newMember = (await db.doc(`users/${newMemberId}`).get()).data();

    const groupId: string = context.params.groupId;

    const group = (await db.doc(`groups/${groupId}`).get()).data();

    const adminIds = (
      await db.collection(`groups/${groupId}/adminIds`).get()
    ).docs.map((doc) => doc.data());

    adminIds.map((adminId) => {
      console.log(adminId.id);
      const docRef = db.collection(`users/${adminId.id}/notifications`).doc();
      const Id: string = docRef.id;
      console.log(Id);

      return db
        .doc(`users/${adminId.id}/notifications/${Id}`)
        .set({
          id: Id,
          person: newMember,
          group: group,
          event: null,
          date: admin.firestore.Timestamp.now(),
          type: 'joinGroup',
        })
        .then(() => {
          // tslint:disable-next-line: no-floating-promises
          db.doc(`users/${adminId.id}`).update(
            'notificationCount',
            admin.firestore.FieldValue.increment(1)
          );
        });
    });
  });

export const joinGroupWaitinglist = functions
  .region('asia-northeast1')
  .firestore.document(
    'groups/{groupId}/waitingJoinningMemberIds/{waitingJoinningMemberId}'
  )
  .onCreate(async (snap, context) => {
    const data = snap.data();
    if (!data) return;

    console.log('joinGroupWaitinglist is running');

    const groupId = context.params.groupId;

    const group = (await db.doc(`groups/${groupId}`).get()).data();

    const waitingJoinningMemberId = context.params.waitingJoinningMemberId;

    const waitingJoinningMember = (
      await db.doc(`users/${waitingJoinningMemberId}`).get()
    ).data();

    const adminIds = (
      await db.collection(`groups/${groupId}/adminIds`).get()
    ).docs.map((doc) => doc.data());

    adminIds.map((adminId) => {
      console.log(adminId.id);
      const docRef = db.collection(`users/${adminId.id}/notifications`).doc();
      const Id: string = docRef.id;

      return db
        .doc(`users/${adminId.id}/notifications/${Id}`)
        .set({
          id: Id,
          person: waitingJoinningMember,
          group: group,
          event: null,
          date: admin.firestore.Timestamp.now(),
          type: 'joinGroupWaitinglist',
        })
        .then(() => {
          // tslint:disable-next-line: no-floating-promises
          db.doc(`users/${adminId.id}`).update(
            'notificationCount',
            admin.firestore.FieldValue.increment(1)
          );
        });
    });
  });

export const makeAdmin = functions
  .region('asia-northeast1')
  .firestore.document('groups/{groupId}/adminIds/{adminId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();
    if (!data) return;

    console.log('makeAdmin is running');

    const groupId = context.params.groupId;

    const group = (await db.doc(`groups/${groupId}`).get()).data();

    const newAdminId = context.params.adminId;

    const newAdmin = (await db.doc(`users/${newAdminId}`).get()).data();

    const adminIds = (
      await db.collection(`groups/${groupId}/adminIds`).get()
    ).docs.map((doc) => doc.data());

    adminIds.map((adminId) => {
      console.log(adminId.id);
      const docRef = db.collection(`users/${adminId.id}/notifications`).doc();
      const Id: string = docRef.id;

      return db
        .doc(`users/${adminId.id}/notifications/${Id}`)
        .set({
          id: Id,
          person: newAdmin,
          group: group,
          event: null,
          date: admin.firestore.Timestamp.now(),
          type: 'makeAdmin',
        })
        .then(() => {
          // tslint:disable-next-line: no-floating-promises
          db.doc(`users/${adminId.id}`).update(
            'notificationCount',
            admin.firestore.FieldValue.increment(1)
          );
        });
    });
  });

export const makeEvent = functions
  .region('asia-northeast1')
  .firestore.document('groups/{groupId}/eventIds/{eventId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();
    if (!data) return;

    console.log('makeEvent is running');

    const groupId = context.params.groupId;

    const group = (await db.doc(`groups/${groupId}`).get()).data();

    const eventId = context.params.eventId;

    const event = (await db.doc(`users/${eventId}`).get()).data();

    const adminIds = (
      await db.collection(`groups/${groupId}/adminIds`).get()
    ).docs.map((doc) => doc.data());

    adminIds.map((adminId) => {
      console.log(adminId.id);
      const docRef = db.collection(`users/${adminId.id}/notifications`).doc();
      const Id: string = docRef.id;

      return db
        .doc(`users/${adminId.id}/notifications/${Id}`)
        .set({
          id: Id,
          person: null,
          group: group,
          event: event,
          date: admin.firestore.Timestamp.now(),
          type: 'makeEvent',
        })
        .then(() => {
          // tslint:disable-next-line: no-floating-promises
          db.doc(`users/${adminId.id}`).update(
            'notificationCount',
            admin.firestore.FieldValue.increment(1)
          );
        });
    });
  });

export const joinEvent = functions
  .region('asia-northeast1')
  .firestore.document('events/{eventId}/attendingMemberIds/{attendingMemberId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();
    if (!data) return;

    console.log('joinEvent is running');

    const eventId: string = context.params.eventId;

    const event = (await db.doc(`events/${eventId}`).get()).data();

    const groupId: string = event?.groupid;

    const group = (await db.doc(`groups/${groupId}`).get()).data();

    const adminIds = (
      await db.collection(`groups/${groupId}/adminIds`).get()
    ).docs.map((doc) => doc.data());

    const newAttendingMemberId: string = context.params.attendingMemberId;

    const newAttendingMember = (
      await db.doc(`users/${newAttendingMemberId}`).get()
    ).data();

    adminIds.map((adminId) => {
      console.log(adminId.id);
      const docRef = db.collection(`users/${adminId.id}/notifications`).doc();
      const Id: string = docRef.id;

      return db
        .doc(`users/${adminId.id}/notifications/${Id}`)
        .set({
          id: Id,
          person: newAttendingMember,
          group: group,
          event: event,
          date: admin.firestore.Timestamp.now(),
          type: 'joinEvent',
        })
        .then(() => {
          // tslint:disable-next-line: no-floating-promises
          db.doc(`users/${adminId.id}`).update(
            'notificationCount',
            admin.firestore.FieldValue.increment(1)
          );
        });
    });
  });

export const joinEventWaitinglist = functions
  .region('asia-northeast1')
  .firestore.document(
    'events/{eventId}/waitingJoinningMemberIds/{waitingJoinningMemberId}'
  )
  .onCreate(async (snap, context) => {
    const data = snap.data();
    if (!data) return;

    console.log('joinEventWaitinglist is running');

    const eventId = context.params.eventId;

    const event = (await db.doc(`events/${eventId}`).get()).data();

    const groupId = event?.groupid;

    const group = (await db.doc(`groups/${groupId}`).get()).data();

    const waitingJoinningMemberId = context.params.waitingJoinningMemberId;

    const waitingJoinningMember = (
      await db.doc(`users/${waitingJoinningMemberId}`).get()
    ).data();

    const adminIds = (
      await db.collection(`groups/${groupId}/adminIds`).get()
    ).docs.map((doc) => doc.data());

    adminIds.map((adminId) => {
      console.log(adminId.id);
      const docRef = db.collection(`users/${adminId.id}/notifications`).doc();
      const Id: string = docRef.id;

      return db
        .doc(`users/${adminId.id}/notifications/${Id}`)
        .set({
          id: Id,
          person: waitingJoinningMember,
          group: group,
          event: event,
          date: admin.firestore.Timestamp.now(),
          type: 'joinEventWaitinglist',
        })
        .then(() => {
          // tslint:disable-next-line: no-floating-promises
          db.doc(`users/${adminId.id}`).update(
            'notificationCount',
            admin.firestore.FieldValue.increment(1)
          );
        });
    });
  });
