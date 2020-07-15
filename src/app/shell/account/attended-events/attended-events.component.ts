import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { ActivatedRoute } from '@angular/router';
import { Event } from 'src/app/interfaces/event';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';
import { EventGetService } from 'src/app/services/event-get.service';
import { SearchService } from 'src/app/services/search.service';
import { FormControl, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-attended-events',
  templateUrl: './attended-events.component.html',
  styleUrls: ['./attended-events.component.scss'],
})
export class AttendedEventsComponent implements OnInit {
  index = this.searchService.index.events_date;

  form = this.fb.group({});

  searchOptions = {
    facetFilters: [],
    page: 0,
    hitsPerPage: 3,
  };

  options = [];

  result: {
    nbHits: number;
    hits: any[];
  };

  valueControl: FormControl = new FormControl();

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
            .getAttendedEventIds(id)
            .subscribe((attendingEventIds: string[]) => {
              if (attendingEventIds.length) {
                const facetFilters = attendingEventIds.map(
                  (attendingEventId: string) => {
                    return `id:${attendingEventId}`;
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
      this.result = result;
    });
  }

  clearSearch() {
    this.valueControl.setValue('');
  }
}
