import { Component, OnInit } from '@angular/core';
import { NotificationsService } from 'src/app/services/notifications.service';
import { AuthService } from 'src/app/services/auth.service';
import { SearchService } from 'src/app/services/search.service';

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
    hitsPerPage: 11,
  };

  result: {
    nbHits: number;
    hits: any[];
  };

  notificationIds: string[];

  maxPage: number;

  page: number;

  loading = false;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationsService,
    private searchService: SearchService
  ) {
    this.notificationService
      .getNotificationIds(this.authService.uid)
      .subscribe((notificationIds: string[]) => {
        this.notificationIds = notificationIds;

        if (notificationIds.length) {
          const facetFilters = notificationIds.map((notificationId: string) => {
            return `id:${notificationId}`;
          });
          console.log(facetFilters);

          this.searchOptions = {
            facetFilters: [facetFilters],
            page: 0,
            hitsPerPage: 11,
          };

          this.search('', this.searchOptions);
        }
      });
  }

  ngOnInit(): void {}

  search(query: string, searchOptions) {
    this.index.search(query, searchOptions).then((result) => {
      this.result = result;
    });
  }

  additionalSearch() {
    console.log('called');
    // 最大ページ未満かつローディング中でなければ発動
    if (!this.maxPage || (this.maxPage > this.page && !this.loading)) {
      this.page++;
      this.loading = true; // ローディング開始
      this.index
        .search('', {
          page: this.page,
        })
        .then((result) => {
          this.maxPage = result.nbPages; // 最大ページ数を保持
          this.result.hits.push(...result.hits); // 結果リストに追加取得分を追加
          this.loading = false; // ローディング終了
        });
    }
  }

  deleteNotification() {
    this.notificationService.deleteNotifications(this.authService.uid);
  }
}
