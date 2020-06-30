import * as functions from 'firebase-functions';
// import * as admin from 'firebase-admin';

const firebase_tools = require('firebase-tools');
// import * as firebase_tools from 'firebase-tools';

// const db = admin.firestore();

export const deleteGroup = functions
  .runWith({
    timeoutSeconds: 540,
    memory: '2GB',
  })
  .https.onCall((data, context) => {
    const path = data.path;

    return firebase_tools.firestore
      .delete(path, {
        project: process.env.GCLOUD_PROJECT,
        recursive: true,
        yes: true,
        token: functions.config().fb.token,
      })
      .then(() => {
        return {
          path: path,
        };
      });
  });

// export const deleteGroup = functions
//   .runWith({
//     timeoutSeconds: 540,
//     memory: '2GB',
//   })
//   .region('asia-northeast1')
//   .firestore.document('groups/{groupId}')
//   .onDelete(async (snap, context) => {
//     if (!snap.data()) return;

//     const groupId = context.params.groupId;

//     const memberIds = (
//       await db.collection(`groups/${groupId}/memberIds`).get()
//     ).docs.map((doc) => doc.data());
//     const memberDeletions: Promise<any>[] = memberIds.map((memberId) => {
//       return db.doc(`users/${memberId.id}/groupIds/${groupId}`).delete();
//     });
//     await Promise.all(memberDeletions);

//     const adminIds = (
//       await db.collection(`groups/${groupId}/adminIds`).get()
//     ).docs.map((doc) => doc.data());
//     const adminDeletions: Promise<any>[] = adminIds.map((adminId) => {
//       return db.doc(`users/${adminId.id}/adminGroupIds/${groupId}`).delete();
//     });
//     await Promise.all(adminDeletions);
//   });

// export const deleteEvent = functions
//   .runWith({
//     timeoutSeconds: 540,
//     memory: '2GB',
//   })
//   .region('asia-northeast1')
//   .firestore.document('events/{eventId}')
//   .onDelete(async (snap, context) => {
//     try {
//       const eventId = context.params.eventId;
//       const event = (await db.doc(`events/${eventId}`).get()).data();
//       const groupId = event?.groupid;
//       await db.doc(`groups/${groupId}/eventIds/${eventId}`).delete();
//       await firebase_tools.firestore.delete(snap.ref.path, {
//         project: process.env.GCLOUD_PROJECT,
//         recursive: true,
//         yes: true,
//         token: functions.config().fb.token,
//       });
//     } catch (err) {
//       console.log(snap.ref.path);
//       console.log(process.env.GCLOUD_PROJECT);
//       console.log(functions.config().fb.token);
//       console.log(err);
//     }
//   });

// export const deleteGroup =
//   functions
//     .runWith({
//       timeoutSeconds: 540,
//       memory: '2GB'
//     })
//     .region('asia-northeast1')
//     .firestore.document('groups/{groupId}')
//     .onDelete(async (snap, context) => {
//       const data = snap.data();
//       if (!data) return;

//       const groupId = context.params.groupId;

//       const group = (await db.doc(`groups/${groupId}`).get()).data();

//       // グループのサブコレ削除（1/5）
//       const adminIds = (
//         await db.collection(`groups/${groupId}/adminIds`).get()
//       ).docs.map((doc) => doc.data());

//       adminIds.map((adminId) => {
//         db.doc(`groups/${groupId}/adminIds/${adminId.id}`).delete();
//       })

//       // グループのサブコレ削除（2/5）
//       const memberIds = (
//         await db.collection(`groups/${groupId}/memberIds`).get()
//       ).docs.map((doc) => doc.data());

//       memberIds.map((memberId) => {
//         db.doc(`groups/${groupId}/memberIds/${memberId.id}`).delete();
//       })

//       // グループのサブコレ削除（3/5）
//       const waitingJoinningMemberIds = (
//         await db.collection(`groups/${groupId}/waitingJoinningMemberIds`).get()
//       ).docs.map((doc) => doc.data());

//       waitingJoinningMemberIds.map((waitingJoinningMemberId) => {
//         db.doc(`groups/${groupId}/waitingJoinningMemberIds/${waitingJoinningMemberId.id}`).delete();
//       })

//       // グループのサブコレ削除（4/5）
//       const waitingPayingMemberIds = (
//         await db.collection(`groups/${groupId}/waitingPayingMemberIds`).get()
//       ).docs.map((doc) => doc.data());

//       waitingPayingMemberIds.map((waitingPayingMemberId) => {
//         db.doc(`groups/${groupId}/waitingPayingMemberId/${waitingPayingMemberId.id}`).delete();
//       })

//       // グループのサブコレ削除（5/5）
//       const eventIds = (
//         await db.collection(`groups/${groupId}/eventIds`).get()
//       ).docs.map((doc) => doc.data());

//       eventIds.map((eventId) => {
//         db.doc(`groups/${groupId}/eventIds/${eventId.id}`).delete();
//       })

//       // イベントとイベントのサブコレ削除
//       eventIds.map(async (eventId) => {
//         // イベントの削除
//         db.doc(`events/${eventId.id}`).delete();

//         // イベントのサブコレ削除（1/3）
//         const attendingMemberIds = (await db.collection(`events/${eventId.id}/attendingMemberIds`).get()).docs.map((doc) => doc.data());
//         attendingMemberIds.map((attendingMemberId) => {
//           db.doc(`events/${eventId.id}/attendingMemberIds/${attendingMemberId.id}`).delete();
//         })

//         // イベントのサブコレ削除（2/3）
//         const waitingJoinningMemberIds = (await db.collection(`events/${eventId.id}/waitingJoinningMemberIds`).get()).docs.map((doc) => doc.data());
//         waitingJoinningMemberIds.map((waitingJoinningMemberId) => {
//           db.doc(`events/${eventId.id}/waitingJoinningMemberIds/${waitingJoinningMemberId.id}`).delete();
//         })

//         // イベントのサブコレ削除（3/3）
//         const waitingPayingMemberIds = (await db.collection(`events/${eventId.id}/waitingPayingMemberIds`).get()).docs.map((doc) => doc.data());
//         waitingPayingMemberIds.map((waitingPayingMemberId) => {
//           db.doc(`events/${eventId.id}/waitingPayingMemberIds/${waitingPayingMemberId.id}`).delete();
//         })
//       })

//       const chatRoomId = group?.chatRoomId

//       // チャットルームの削除
//       db.doc(`chatRooms/${chatRoomId}`).delete();

//       const messages = (await db.collection(`chatRooms/${chatRoomId}/messages`).get()).docs.map((doc) => doc.data());

//       // チャットルームのサブコレ削除（1/2）
//       messages.map((message) => {
//         db.doc(`chatRooms/${chatRoomId}/messages/${message.id}`).delete();
//       })

//       const chatRoomMemberIds = (await db.collection(`chatRooms/${chatRoomId}/memberIds`).get()).docs.map((doc) => doc.data());

//       // チャットルームのサブコレ削除（2/2）
//       chatRoomMemberIds.map((chatRoomMemberId) => {
//         db.doc(`chatRooms/${chatRoomId}/memberIds/${chatRoomMemberId.id}`).delete();
//       })

//     })

// export const deleteEvent =
//   functions
//     .runWith({
//       timeoutSeconds: 540,
//       memory: '2GB'
//     })
//     .region('asia-northeast1')
//     .firestore.document('events/{eventId}')
//     .onDelete(async (snap, context) => {
//       const data = snap.data();
//       if (data) return;

//       const eventId = context.params.eventId;

//       const event = (await db.doc(`events/${eventId}`).get()).data();

//       const groupId = event?.groupid;

//       // グループのサブコレからの削除
//       db.doc(`groups/${groupId}/eventIds/${eventId}`).delete();

//       // イベントのサブコレを削除（1/3）
//       const attendingMemberIds = (await db.collection(`events/${eventId}/attendingMemberIds`).get()).docs.map((doc) => doc.data());

//       const promises: Promise<any>[] = attendingMemberIds.map((attendingMemberId) => {
//         return db.doc(`events/${eventId}/attendingMemberIds/${attendingMemberId.id}`).delete();
//       })

//       await Promise.all(promises)

//       // イベントのサブコレを削除（2/3）
//       const waitingJoinningMemberIds = (await db.collection(`events/${eventId}/waitingJoinningMemberIds`).get()).docs.map((doc) => doc.data());

//       waitingJoinningMemberIds.map((waitingJoinningMemberId) => {
//         db.doc(`events/${eventId}/waitingJoinningMemberIds/${waitingJoinningMemberId.id}`).delete();
//       })

//       // イベントのサブコレを削除（3/3）
//       const waitingPayingMemberIds = (await db.collection(`events/${eventId}/waitingPayingMemberIds`).get()).docs.map((doc) => doc.data());

//       waitingPayingMemberIds.map((waitingPayingMemberId) => {
//         db.doc(`events/${eventId}/waitingPayingMemberIds/${waitingPayingMemberId.id}`).delete();
//       })
//     })
