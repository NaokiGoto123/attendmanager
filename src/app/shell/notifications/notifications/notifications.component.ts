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

  initialLoading = false;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationsService,
    private searchService: SearchService,
    public uiService: UiService
  ) {
    this.initialLoading = true;
    this.notificationService
      .getNotificationIds(this.authService.uid)
      .subscribe((notificationIds: string[]) => {
        this.notificationIds = notificationIds;

        if (notificationIds.length) {
          this.facetFilters = notificationIds.map((notificationId: string) => {
            return `id:${notificationId}`;
          });
          this.searchOptions = {
            facetFilters: [this.facetFilters],
            page: 0,
          };

          this.search('', this.searchOptions);

          setTimeout(() => {
            this.initialLoading = false;
          }, 1000);
        } else {
          setTimeout(() => {
            this.initialLoading = false;
          }, 1000);
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
    this.initialLoading = true;
    this.notificationService
      .deleteNotifications(this.authService.uid)
      .then(() => {
        this.initialLoading = false;
      });
  }
}
