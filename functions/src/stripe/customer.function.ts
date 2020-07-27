import * as functions from 'firebase-functions';
import { auth } from 'firebase-admin';
import { db } from './db';
import Stripe from 'stripe';
import { stripe } from './client';

export const createCustomer = functions
  .region('asia-northeast1')
  .auth.user()
  .onCreate(async (user: auth.UserRecord) => {
    // Stripe上に顧客を作成
    const customer: Stripe.Customer = await stripe.customers.create({
      name: user.displayName,
      email: user.email,
    });

    // DBに顧客情報を保存
    return db.doc(`customers/${user.uid}`).set({
      userId: user.uid,
      customerId: customer.id,
    });
  });

export const deleteCustomer = functions
  .region('asia-northeast1')
  .firestore.document('users/{uid}')
  .onDelete(async (snap, context) => {
    const uid = context.params.uid;
    const user = (await db.doc(`customers/${uid}`).get()).data();
    await stripe.customers.del(`${user?.customerId}`);
  });

export const getCustomer = functions
  .region('asia-northeast1')
  .https.onCall(async (customerId, context) => {
    return stripe.customers.retrieve(customerId, {
      expand: ['subscriptions'],
    });
  });