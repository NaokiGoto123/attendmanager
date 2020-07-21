import { Algolia } from './algolia';
import * as functions from 'firebase-functions';

const algolia = new Algolia();

export const createUser = functions
  .region('asia-northeast1')
  .firestore.document('users/{id}')
  .onCreate((snap) => {
    const data = snap.data();
    return algolia.saveRecord({
      indexName: 'users',
      idKey: 'uid',
      largeConcentKey: 'body',
      data,
    });
  });

export const deleteUserFromIndex = functions
  .region('asia-northeast1')
  .firestore.document('users/{id}')
  .onDelete((snap) => {
    const data = snap.data();

    if (data) {
      return algolia.removeRecord('users', data.uid, 'uid');
    } else {
      return;
    }
  });

export const updateUser = functions
  .region('asia-northeast1')
  .firestore.document('users/{id}')
  .onUpdate((change) => {
    const data = change.after.data();
    return algolia.saveRecord({
      indexName: 'users',
      idKey: 'uid',
      largeConcentKey: 'body',
      isUpdate: true,
      data,
    });
  });
