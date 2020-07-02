import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  user: User;

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {
    this.userService.getUser(this.authService.uid).subscribe((user: User) => {
      this.user = user;
    });
  }

  signOut() {
    this.authService.signOut();
  }

  ngOnInit(): void {}
}
