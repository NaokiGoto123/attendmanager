import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-payments-settings',
  templateUrl: './payments-settings.component.html',
  styleUrls: ['./payments-settings.component.scss'],
})
export class PaymentsSettingsComponent implements OnInit {
  uid: string;

  constructor(private activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      this.uid = params.get('id');
    });
  }

  ngOnInit(): void {}
}
