import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  user: User;

  uid: string;

  searchId: string;

  photoURL: string;

  constructor(private authService: AuthService) {
    this.authService.getUser(this.authService.uid).subscribe((user: User) => {
      this.user = user;
      this.uid = user.uid;
      this.searchId = user.searchId;
      this.photoURL = user.photoURL;
    });
  }

  ngOnInit(): void {}
}
