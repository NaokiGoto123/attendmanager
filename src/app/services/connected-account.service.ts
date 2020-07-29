import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { environment } from 'src/environments/environment';
import { ConnectedAccount } from '@interfaces/connected-account';
import { Observable } from 'rxjs';
import { switchMap, tap, map, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ConnectedAccountService {
  accountPortalUrl: string;
  connectedAccount: ConnectedAccount;
  connectedAccountId$: Observable<string> = this.afAuth.user.pipe(
    switchMap((user) => {
      return this.db
        .doc<ConnectedAccount>(`connectedAccounts/${user.uid}`)
        .valueChanges();
    }),
    tap((account) => (this.connectedAccount = account)),
    map((account) => account?.connectedAccountId),
    tap((accountId) => {
      if (accountId) {
        this.setAccountLoginLink();
      } else {
        this.accountPortalUrl = null;
      }
    }),
    shareReplay(1)
  );

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFirestore,
    private fns: AngularFireFunctions
  ) {}

  async createStripeConnectedAccount() {
    const callable = this.fns.httpsCallable('getStripeConnectedAccountState');
    const state = await callable({}).toPromise();
    const url = 'https://connect.stripe.com/express/oauth/authorize';
    location.href = `${url}?client_id=${environment.stripe.clientId}&state=${state}&suggested_capabilities[]=transfers`;
  }

  async setAccountLoginLink() {
    const callable = this.fns.httpsCallable('getStripeAccountLoginLink');
    this.accountPortalUrl = await callable({})
      .toPromise()
      .then((res) => res.url);
  }
}
