import { Component, OnInit } from '@angular/core';
import { NotificationsService } from 'src/app/services/notifications.service';
import { AuthService } from 'src/app/services/auth.service';
import { Notification } from 'src/app/interfaces/notification';
import { SearchService } from 'src/app/services/search.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {
  uid: string;

  notifications: Notification[];

  index = this.searchService.index.notifications_date;

  searchOptions = {
    facetFilters: [`person.uid:${this.authService.uid}`],
  };

  options = [];

  result: {
    nbHits: number;
    hits: any[];
  };

  valueControl: FormControl = new FormControl();

  constructor(
    private authService: AuthService,
    private notificationService: NotificationsService,
    private searchService: SearchService
  ) {
    this.uid = this.authService.uid;

    this.notificationService
      .getNotifications(this.uid)
      .subscribe((notifications: Notification[]) => {
        this.notifications = notifications;
      });

    this.index.search('', this.searchOptions).then((result) => {
      this.options = result.hits;
    });

    this.search('', this.searchOptions);
  }

  ngOnInit(): void {
    this.valueControl.valueChanges.subscribe((query) => {
      this.index.search(query, this.searchOptions).then((result) => {
        this.options = result.hits;
      });
    });
  }

  search(query: string, searchOptions) {
    this.index.search(query, searchOptions).then((result) => {
      this.result = result;
      console.log(result);
    });
  }

  clearSearch() {
    this.valueControl.setValue('');
  }

  deleteNotification() {
    this.notificationService.deleteNotifications(this.authService.uid);
  }
}
