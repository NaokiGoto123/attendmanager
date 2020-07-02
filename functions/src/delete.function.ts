import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const firebase_tools = require('firebase-tools');

const db = admin.firestore();

export const deleteGroup = functions
  .runWith({
    timeoutSeconds: 540,
    memory: '2GB',
  })
  .region('asia-northeast1')
  .https.onCall(async (groupId, context) => {
    const group = (await db.doc(`groups/${groupId}`).get()).data();

    // ユーザーのサブコレ（group系）から削除
    const adminIds = (
      await db.collection(`groups/${groupId}/adminIds`).get()
    ).docs.map((doc) => doc.data());
    const adminIdsDeletion: Promise<any>[] = adminIds.map((adminId) => {
      return db.doc(`users/${adminId.id}/adminGroupIds/${groupId}`).delete();
    });
    await Promise.all(adminIdsDeletion);

    const memberIds = (
      await db.collection(`groups/${groupId}/memberIds`).get()
    ).docs.map((doc) => doc.data());
    const memberIdsDeletion: Promise<any>[] = memberIds.map((memberId) => {
      return db.doc(`users/${memberId.id}/groupIds/${groupId}`).delete();
    });
    await Promise.all(memberIdsDeletion);

    const waitingJoinningMemberIds = (
      await db.collection(`groups/${groupId}/waitingJoinningMemberIds`).get()
    ).docs.map((doc) => doc.data());
    const waitingJoinningMemberIdsDeletion: Promise<
      any
    >[] = waitingJoinningMemberIds.map((waitingJoinningMemberId) => {
      return db
        .doc(
          `users/${waitingJoinningMemberId.id}/waitingJoinningGroupIds/${groupId}`
        )
        .delete();
    });
    await Promise.all(waitingJoinningMemberIdsDeletion);

    const waitingPayingMemberIds = (
      await db.collection(`groups/${groupId}/waitingPayingMemberIds`).get()
    ).docs.map((doc) => doc.data());
    const waitingPayingMemberIdsDeletion: Promise<
      any
    >[] = waitingPayingMemberIds.map((waitingPayingMemberId) => {
      return db
        .doc(
          `users/${waitingPayingMemberId.id}/waitingPayingGroupIds/${groupId}`
        )
        .delete();
    });
    await Promise.all(waitingPayingMemberIdsDeletion);

    // ユーザーのサブコレクションからイベントを削除
    const eventIds = (
      await db.collection(`groups/${groupId}/eventIds`).get()
    ).docs.map((doc) => doc.data());

    const a = eventIds.map(async (eventId) => {
      const attendingMemberIds = (
        await db.collection(`events/${eventId.id}/attendingMemberIds`).get()
      ).docs.map((doc) => doc.data());
      return attendingMemberIds.map(async (attendingMemberId) => {
        return await db
          .doc(`users/${attendingMemberId.id}/eventIds/${eventId.id}`)
          .delete();
      });
    });
    await Promise.all(a);

    const b = eventIds.map(async (eventId) => {
      const eventWaitingJoinningMemberIds = (
        await db
          .collection(`events/${eventId.id}/waitingJoinningMemberIds`)
          .get()
      ).docs.map((doc) => doc.data());
      return eventWaitingJoinningMemberIds.map(
        async (eventWaitingJoinningMemberId) => {
          return await db
            .doc(
              `users/${eventWaitingJoinningMemberId.id}/waitingJoinningEventIds/${eventId.id}`
            )
            .delete();
        }
      );
    });
    await Promise.all(b);

    const c = eventIds.map(async (eventId) => {
      const eventWaitingPayingMemberIds = (
        await db.collection(`events/${eventId.id}/waitingPayingMemberIds`).get()
      ).docs.map((doc) => doc.data());
      return eventWaitingPayingMemberIds.map(
        async (eventWaitingPayingMemberId) => {
          return await db
            .doc(
              `users/${eventWaitingPayingMemberId.id}/waitingPayingEventIds/${eventId.id}`
            )
            .delete();
        }
      );
    });
    await Promise.all(c);

    // イベントの削除
    const eventsDeletion: Promise<any>[] = eventIds.map((eventId) => {
      const pathToEvent = `events/${eventId.id}`;
      return firebase_tools.firestore.delete(pathToEvent, {
        project: process.env.GCLOUD_PROJECT,
        recursive: true,
        yes: true,
        token: functions.config().fb.token,
      });
    });
    await Promise.all(eventsDeletion);

    // チャットルームの削除
    const ChatRoomId = group?.chatRoomId;

    const pathToChatRoom = `chatRooms/${ChatRoomId}`;

    await firebase_tools.firestore.delete(pathToChatRoom, {
      project: process.env.GCLOUD_PROJECT,
      recursive: true,
      yes: true,
      token: functions.config().fb.token,
    });

    // グループの削除
    const pathToGroup = `groups/${groupId}`;

    await firebase_tools.firestore.delete(pathToGroup, {
      project: process.env.GCLOUD_PROJECT,
      recursive: true,
      yes: true,
      token: functions.config().fb.token,
    });

    return;
  });

export const deleteEvent = functions
  .runWith({
    timeoutSeconds: 540,
    memory: '2GB',
  })
  .region('asia-northeast1')
  .https.onCall(async (eventId, context) => {
    const event = (await db.doc(`events/${eventId}`).get()).data();

    const groupId = event?.groupid;

    // ユーザーのサブコレクションからイベントを消す
    const attendingMemberIds = (
      await db.collection(`events/${eventId}/attendingMemberIds`).get()
    ).docs.map((doc) => doc.data());
    const attendingMemberIdsDeletion: Promise<any>[] = attendingMemberIds.map(
      (attendingMemberId) => {
        return db
          .doc(`users/${attendingMemberId.id}/eventIds/${eventId}`)
          .delete();
      }
    );
    await Promise.all(attendingMemberIdsDeletion);

    const waitingJoinningMemberIds = (
      await db.collection(`events/${eventId}/waitingJoinningMemberIds`).get()
    ).docs.map((doc) => doc.data());
    const waitingJoinningMemberIdsDeletion: Promise<
      any
    >[] = waitingJoinningMemberIds.map((waitingJoinningMemberId) => {
      return db
        .doc(
          `users/${waitingJoinningMemberId.id}/waitingJoinningEventIds/${eventId}`
        )
        .delete();
    });
    await Promise.all(waitingJoinningMemberIdsDeletion);

    const waitingPayingMemberIds = (
      await db.collection(`events/${eventId}/waitingPayingMemberIds`).get()
    ).docs.map((doc) => doc.data());
    const waitingPayingMemberIdsDeletion: Promise<
      any
    >[] = waitingPayingMemberIds.map((waitingPayingMemberId) => {
      return db
        .doc(
          `users/${waitingPayingMemberId.id}/waitingPayingEventIds/${eventId}`
        )
        .delete();
    });
    await Promise.all(waitingPayingMemberIdsDeletion);

    // グループのサブコレクションから削除
    await db.doc(`groups/${groupId}/eventIds/${eventId}`).delete();

    // イベントを削除
    const pathToEvent = `events/${eventId}`;
    await firebase_tools.firestore.delete(pathToEvent, {
      project: process.env.GCLOUD_PROJECT,
      recursive: true,
      yes: true,
      token: functions.config().fb.token,
    });

    return;
  });

export const deleteNotifications = functions
  .region('asia-northeast1')
  .https.onCall(async (uid, context) => {
    await db.doc(`users/${uid}`).update({ notificationCount: 0 });

    const path = `users/${uid}/notifications`;

    await firebase_tools.firestore.delete(path, {
      project: process.env.GCLOUD_PROJECT,
      recursive: true,
      yes: true,
      token: functions.config().fb.token,
    });

    return;
  });
