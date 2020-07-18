import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/interfaces/user';
import { NotificationsService } from 'src/app/services/notifications.service';
import { UserService } from 'src/app/services/user.service';
import { ChatGetService } from 'src/app/services/chat-get.service';
import { UiService } from 'src/app/services/ui.service';
import { MatSidenavContent } from '@angular/material/sidenav';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
})
export class ShellComponent implements AfterViewInit {
  @ViewChild('wrap') private wrap: MatSidenavContent;

  notificationCount: number;

  messageCount: number;

  searchId: string;

  url: string;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private notificationService: NotificationsService,
    private chatGetService: ChatGetService,
    private uiService: UiService,
    private router: Router
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        console.log(this.router.url);
        this.url = this.router.url;
      }
    });

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

  ngAfterViewInit(): void {
    this.uiService.scrollWrapperElement = this.wrap.getElementRef().nativeElement;
    console.log(this.uiService.scrollWrapperElement);
  }

  clearNotificationCount() {
    this.notificationService.clearNotificationCount(this.authService.uid);
  }
}
