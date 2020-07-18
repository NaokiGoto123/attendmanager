import { Component, OnInit } from '@angular/core';
import { NotificationsService } from 'src/app/services/notifications.service';
import { AuthService } from 'src/app/services/auth.service';
import { SearchService } from 'src/app/services/search.service';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {
  index = this.searchService.index.notifications_date;

  searchOptions = {
    facetFilters: [],
    page: 0,
  };

  result: {
    nbHits: number;
    hits: any[];
  };

  items = [];

  notificationIds: string[];

  loading = false;

  facetFilters = [];

  constructor(
    private authService: AuthService,
    private notificationService: NotificationsService,
    private searchService: SearchService,
    public uiService: UiService
  ) {
    this.notificationService
      .getNotificationIds(this.authService.uid)
      .subscribe((notificationIds: string[]) => {
        this.notificationIds = notificationIds;

        if (notificationIds.length) {
          this.facetFilters = notificationIds.map((notificationId: string) => {
            return `id:${notificationId}`;
          });
          console.log(this.facetFilters);

          this.searchOptions = {
            facetFilters: [this.facetFilters],
            page: 0,
          };

          this.search('', this.searchOptions);
        }
      });
  }

  ngOnInit(): void {}

  search(query: string, searchOptions) {
    this.index.search(query, searchOptions).then((result) => {
      this.items.push(...result.hits);
    });
  }

  additionalSearch() {
    console.log('called');
    if (!this.loading) {
      this.loading = true;
      this.searchOptions.page++;
      setTimeout(() => {
        this.index.search('', this.searchOptions).then((result) => {
          this.items.push(...result.hits);
          this.loading = false;
        });
      }, 1000);
    }
  }

  deleteNotification() {
    this.notificationService.deleteNotifications(this.authService.uid);
  }
}
