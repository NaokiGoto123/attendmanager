import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

export const joinGroup = functions
  .region('asia-northeast1')
  .firestore.document(`groups/{id}`)
  .onUpdate(async (change, context) => {
    const data = change.after.data();

    if (!data) return;

    console.log(data);

    const adminIds: string[] = data.adminIds;

    //adminIds所在確認済
    console.log(adminIds);

    adminIds.forEach((adminId: string) => {
      return db.collection(`users/${adminId}/notifications`).add({
        text: 'hello this is test',
      });
    });
  });

// export const joinGroupWaitinglist = functions
// .region('asia-northeast1')
// .firestore.document(`groups/{id}/waitingJoinningMemberIds`)
// .onUpdate((change, context) => {
//   const data = change.after.data();

//   if (!data) return;

//   const adminIds: string[] = data.adminIds;

//   const groupId: string = data.groupid;

// })

// export const joinEvent = functions
// .region('asia-northeast1')
// .firestore.document(`events/{id}/attendingMemberIds`)
// .onUpdate((change, context) => {
//   const data = change.after.data();

//   if (!data) return;

//   const adminIds: string[] = data.adminIds;

//   const eventId: string = data.eventid;

// })

// export const joinEventWaitinglist = functions
// .region('asia-northeast1')
// .firestore.document(`events/{id}/waitingJoinningMemberIds`)
// .onUpdate((change, context) => {
//   const data = change.after.data();

//   if (!data) return;

//   const adminIds: string[] = data.adminIds;

//   const eventId: string = data.eventid;

// })
