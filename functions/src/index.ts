import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp(functions.config().firebase);

export * from './notifications.function';
export * from './delete.function';
export * from './algolia/event.function';
export * from './algolia/group.function';
export * from './algolia/user.function';
