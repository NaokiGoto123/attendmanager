import { Algolia } from './algolia';
import * as functions from 'firebase-functions';

const algolia = new Algolia();

export const createEvent = functions
  .region('asia-northeast1')
  .firestore.document('events/{id}')
  .onCreate((snap) => {
    const data = snap.data();
    return algolia.saveRecord({
      indexName: 'events',
      largeConcentKey: 'body',
      data,
    });
  });

export const deleteEventFromIndex = functions
  .region('asia-northeast1')
  .firestore.document('events/{id}')
  .onDelete((snap) => {
    const data = snap.data();

    if (data) {
      return algolia.removeRecord('events', data.id);
    } else {
      return;
    }
  });

export const updateEvent = functions
  .region('asia-northeast1')
  .firestore.document('events/{id}')
  .onUpdate((change) => {
    const data = change.after.data();
    return algolia.saveRecord({
      indexName: 'events',
      largeConcentKey: 'body',
      isUpdate: true,
      data,
    });
  });
