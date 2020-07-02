import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/interfaces/user';
import { NotificationsService } from 'src/app/services/notifications.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
})
export class ShellComponent implements OnInit {
  notificationCount: number;

  searchId: string;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private notificationService: NotificationsService
  ) {
    this.userService.getUser(this.authService.uid).subscribe((user: User) => {
      this.notificationCount = user.notificationCount;
      this.searchId = user.searchId;
    });
  }

  ngOnInit(): void {}

  clearNotificationCount() {
    this.notificationService.clearNotificationCount(this.authService.uid);
  }
}
