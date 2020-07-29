import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConnectedAccountService } from 'src/app/services/connected-account.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-payments-settings',
  templateUrl: './payments-settings.component.html',
  styleUrls: ['./payments-settings.component.scss'],
})
export class PaymentsSettingsComponent implements OnInit {
  uid: string;

  connectedAccountId$: Observable<string> = this.connectedAccountService
    .connectedAccountId$;

  connectedAccountPortal = this.connectedAccountService.accountPortalUrl;

  constructor(
    private activatedRoute: ActivatedRoute,
    private connectedAccountService: ConnectedAccountService
  ) {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      this.uid = params.get('id');
    });
  }

  ngOnInit(): void {}

  createStripeConnectedAccount() {
    this.connectedAccountService.createStripeConnectedAccount();
  }
}
