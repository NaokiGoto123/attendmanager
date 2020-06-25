import { Component, OnInit } from '@angular/core';
import { NotificationsService } from 'src/app/services/notifications.service';
import { AuthService } from 'src/app/services/auth.service';
import { Notification } from 'src/app/interfaces/notification';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {
  uid: string;

  notifications: Notification[];

  constructor(
    private authService: AuthService,
    private notificationService: NotificationsService
  ) {
    this.uid = this.authService.uid;
    this.notificationService
      .getNotifications(this.uid)
      .subscribe((notifications: Notification[]) => {
        console.log(notifications);
        this.notifications = notifications;
      });
  }

  ngOnInit(): void {}
}
