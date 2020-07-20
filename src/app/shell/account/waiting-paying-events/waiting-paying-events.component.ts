import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Event } from 'src/app/interfaces/event';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';
import { EventGetService } from 'src/app/services/event-get.service';
import { FormBuilder, FormControl } from '@angular/forms';
import { SearchService } from 'src/app/services/search.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-waiting-paying-events',
  templateUrl: './waiting-paying-events.component.html',
  styleUrls: ['./waiting-paying-events.component.scss'],
})
export class WaitingPayingEventsComponent implements OnInit {
  index = this.searchService.index.events_date;

  form = this.fb.group({});

  searchOptions = {
    facetFilters: [],
    page: 0,
    hitsPerPage: 3,
  };

  options = [];

  items = [];

  valueControl: FormControl = new FormControl();

  loading = false;

  initialLoading = false;

  allowedToShow = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private searchService: SearchService,
    private userService: UserService,
    private eventGetService: EventGetService,
    private authService: AuthService
  ) {
    this.initialLoading = true;
    this.activatedRoute.queryParamMap.subscribe((params) => {
      const searchId = params.get('id');
      this.userService
        .getUserFromSearchId(searchId)
        .subscribe((target: User) => {
          const id = target.uid;
          if (target.uid === this.authService.uid) {
            this.allowedToShow = true;
          } else {
            if (target.showAttendedEvents) {
              this.allowedToShow = true;
            } else {
              this.allowedToShow = false;
            }
          }
          this.eventGetService
            .getWaitingPayingEventIds(id)
            .subscribe((waitingPayingEventIds: string[]) => {
              if (waitingPayingEventIds.length) {
                const facetFilters = waitingPayingEventIds.map(
                  (waitingPayingEventId: string) => {
                    return `id:${waitingPayingEventId}`;
                  }
                );
                console.log(facetFilters);

                this.searchOptions = {
                  facetFilters: [facetFilters],
                  page: 0,
                  hitsPerPage: 3,
                };

                this.index
                  .search('', { facetFilters: [facetFilters] })
                  .then((result) => {
                    console.log(result);
                    this.options = result.hits;
                  });

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
        });
    });
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
      this.items.push(...result.hits);
    });
  }

  querySearch(query: string, searchOptions) {
    this.index.search(query, searchOptions).then((result) => {
      this.items = result?.hits;
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

  clearSearch() {
    this.valueControl.setValue('');
  }
}
