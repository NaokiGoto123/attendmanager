import { Algolia } from './algolia';
import * as functions from 'firebase-functions';

const algolia = new Algolia();

export const createNotification = functions
  .region('asia-northeast1')
  .firestore.document('users/{uid}/notifications/{id}')
  .onCreate((snap) => {
    const data = snap.data();
    return algolia.saveRecord({
      indexName: 'notifications',
      largeConcentKey: 'body',
      data,
    });
  });

export const deleteNotificationFromIndex = functions
  .region('asia-northeast1')
  .firestore.document('users/{uid}/notifications/{id}')
  .onDelete((snap) => {
    const data = snap.data();

    if (data) {
      return algolia.removeRecord('notifications', data.id);
    } else {
      return;
    }
  });

export const updateNotification = functions
  .region('asia-northeast1')
  .firestore.document('users/{uid}/notifications/{id}')
  .onUpdate((change) => {
    const data = change.after.data();
    return algolia.saveRecord({
      indexName: 'notifications',
      largeConcentKey: 'body',
      isUpdate: true,
      data,
    });
  });
