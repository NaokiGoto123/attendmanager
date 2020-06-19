import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  value = '';

  routerLinks = [
    {
      label: 'Events',
      link: 'events',
    },
    {
      label: 'Groups',
      link: 'groups',
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
