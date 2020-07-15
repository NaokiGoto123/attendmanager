import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/interfaces/user';
import { NotificationsService } from 'src/app/services/notifications.service';
import { UserService } from 'src/app/services/user.service';
import { ChatGetService } from 'src/app/services/chat-get.service';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
})
export class ShellComponent implements OnInit {
  notificationCount: number;

  messageCount: number;

  searchId: string;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private notificationService: NotificationsService,
    private chatGetService: ChatGetService
  ) {
    this.userService.getUser(this.authService.uid).subscribe((user: User) => {
      this.notificationCount = user.notificationCount;
      this.searchId = user.searchId;
    });
    this.chatGetService
      .getAllMesssageCounts(this.authService.uid)
      .subscribe((messageCount: number) => {
        this.messageCount = messageCount;
      });
  }

  ngOnInit(): void {}

  clearNotificationCount() {
    this.notificationService.clearNotificationCount(this.authService.uid);
  }
}
