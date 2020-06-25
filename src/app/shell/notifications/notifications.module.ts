import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationsRoutingModule } from './notifications-routing.module';
import { NotificationsComponent } from './notifications/notifications.component';
import { MatListModule } from '@angular/material/list';
import { NotificationComponent } from './notification/notification.component';

@NgModule({
  declarations: [NotificationsComponent, NotificationComponent],
  imports: [CommonModule, NotificationsRoutingModule, MatListModule],
})
export class NotificationsModule {}
