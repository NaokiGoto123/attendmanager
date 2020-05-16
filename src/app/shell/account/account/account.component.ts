import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  constructor(public authService: AuthService) {}

  displayName = this.authService.displayName;
  photoURL = this.authService.photoURL;
  email = this.authService.email;

  ngOnInit(): void {}
}
