import * as functions from 'firebase-functions';
import * as cryptoRandomString from 'crypto-random-string';

// import { ConnectedAccount } from '../interfaces/connected-account';
import { db } from './db';
import { stripe } from './client';
// import Stripe from 'stripe';

export const getStripeConnectedAccountState = functions
  .region('asia-northeast1')
  .https.onCall(async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'permission-denied',
        '認証が必要です'
      );
    }
    const state = cryptoRandomString({ length: 10 });

    await db.doc(`connectedAccounts/${context.auth.uid}`).set(
      {
        userId: context.auth.uid,
        state,
      },
      { merge: true }
    );

    return state;
  });

export const createStripeConnectedAccount = functions
  .region('asia-northeast1')
  .https.onRequest(async (req, resp) => {
    const code = req.query.code as string;
    const state = req.query.state;
    const connectDoc = (
      await db.collection('connectedAccounts').where('state', '==', state).get()
    ).docs[0];

    if (!connectDoc.exists) {
      return resp
        .status(403)
        .json({ error: 'Incorrect state parameter: ' + state });
    }

    try {
      const response = await stripe.oauth.token({
        grant_type: 'authorization_code',
        code,
      });

      const connectedAccountId = response.stripe_user_id as string;

      await stripe.accounts.update(connectedAccountId, {
        settings: {
          payouts: {
            schedule: {
              interval: 'manual',
            },
          },
        },
      });

      await connectDoc.ref.set({
        connectedAccountId,
      });

      resp.redirect(`http://localhost:4200`);
      return;
    } catch (err) {
      if (err.type === 'StripeInvalidGrantError') {
        return resp
          .status(400)
          .json({ error: 'Invalid authorization code: ' + code });
      } else {
        return resp.status(500).json({ error: 'An unknown error occurred.' });
      }
    }
  });

export const getStripeAccountLoginLink = functions
  .region('asia-northeast1')
  .https.onCall(async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'permission-denied',
        '認証が必要です'
      );
    }
    const account: any = (
      await db.doc(`connectedAccounts/${context.auth.uid}`).get()
    ).data();

    if (!account) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        '販売アカウントがありません'
      );
    }

    return stripe.accounts.createLoginLink(account.connectedAccountId);
  });
