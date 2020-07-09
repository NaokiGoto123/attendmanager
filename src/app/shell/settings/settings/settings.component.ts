import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  uid: string;

  routerLinks = [
    {
      label: 'Profile',
      link: 'profile-settings',
    },
    {
      label: 'Payments',
      link: 'payments-settings',
    },
  ];

  constructor(private activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      this.uid = params.get('id');
    });
  }

  ngOnInit(): void {}
}
