import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

export const joinGroup = functions
  .region('asia-northeast1')
  .firestore.document('groups/{groupId}/memberIds/{memberId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();

    if (!data) return;

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

export const joinEvent = functions
  .region('asia-northeast1')
  .firestore.document('events/{eventId}/attendingMemberIds/{attendingMemberId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();
    if (!data) return;

    const eventId: string = context.params.eventId;
    console.log('this is eventId', eventId);

    const event = (await db.doc(`events/${eventId}`).get()).data();
    console.log('this is event', event);

    const attendingMemberId: string = context.params.attendingMemberId;
    console.log(attendingMemberId);
  });
