import { Algolia } from './algolia';
import * as functions from 'firebase-functions';

const algolia = new Algolia();

export const createGroup = functions
  .region('asia-northeast1')
  .firestore.document('groups/{id}')
  .onCreate((snap) => {
    const data = snap.data();
    return algolia.saveRecord({
      indexName: 'groups',
      largeConcentKey: 'body',
      data,
    });
  });

export const deleteGroupFromIndex = functions
  .region('asia-northeast1')
  .firestore.document('groups/{id}')
  .onDelete((snap) => {
    const data = snap.data();

    if (data) {
      return algolia.removeRecord('groups', data.id);
    } else {
      return;
    }
  });

export const updateGroup = functions
  .region('asia-northeast1')
  .firestore.document('groups/{id}')
  .onUpdate((change) => {
    const data = change.after.data();
    return algolia.saveRecord({
      indexName: 'groups',
      largeConcentKey: 'body',
      isUpdate: true,
      data,
    });
  });
