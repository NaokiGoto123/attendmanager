import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Event } from 'src/app/interfaces/event';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';
import { EventGetService } from 'src/app/services/event-get.service';
import { FormControl, FormBuilder } from '@angular/forms';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-waiting-joinning-events',
  templateUrl: './waiting-joinning-events.component.html',
  styleUrls: ['./waiting-joinning-events.component.scss'],
})
export class WaitingJoinningEventsComponent implements OnInit {
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

  constructor(
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private searchService: SearchService,
    private userService: UserService,
    private eventGetService: EventGetService
  ) {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      const searchId = params.get('id');
      this.userService
        .getUserFromSearchId(searchId)
        .subscribe((target: User) => {
          const id = target.uid;
          this.eventGetService
            .getWaitingJoinningEventIds(id)
            .subscribe((waitingJoinningEventIds: string[]) => {
              if (waitingJoinningEventIds.length) {
                const facetFilters = waitingJoinningEventIds.map(
                  (waitingJoinningEventId: string) => {
                    return `id:${waitingJoinningEventId}`;
                  }
                );
                console.log(facetFilters);

                this.searchOptions = {
                  facetFilters: [facetFilters],
                  page: 0,
                  hitsPerPage: 3,
                };

                this.index.search('', this.searchOptions).then((result) => {
                  console.log(result);
                  this.options = result.hits;
                });

                this.search('', this.searchOptions);
              }
            });
        });
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

  clearSearch() {
    this.valueControl.setValue('');
  }
}
