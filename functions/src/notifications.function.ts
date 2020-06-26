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
    console.log(newMember);
    const groupId: string = context.params.groupId;
    const group = (await db.doc(`groups/${groupId}`).get()).data();
    console.log(group);
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
          personUid: newMemberId,
          personDisplayname: newMember,
          objectId: groupId,
          objectName: group,
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
