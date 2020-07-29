import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp(functions.config().firebase);

export * from './notifications.function';
export * from './delete.function';

export * from './algolia/event.function';
export * from './algolia/group.function';
export * from './algolia/user.function';
export * from './algolia/notification.function';

export * from './stripe/customer.function';
export * from './stripe/payment-methods.function';
export * from './stripe/intent.function';
export * from './stripe/invoice.function';
export * from './stripe/customer-portal.function';
export * from './stripe/connect.function';
