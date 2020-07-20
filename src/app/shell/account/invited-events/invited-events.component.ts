import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';
import { InviteGetService } from 'src/app/services/invite-get.service';
import { SearchService } from 'src/app/services/search.service';
import { FormBuilder, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-invited-events',
  templateUrl: './invited-events.component.html',
  styleUrls: ['./invited-events.component.scss'],
})
export class InvitedEventsComponent implements OnInit {
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
    private invitedGetService: InviteGetService,
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
          this.invitedGetService
            .getInvitedEventIds(id)
            .subscribe((invitedEventIds: string[]) => {
              if (invitedEventIds.length) {
                const facetFilters = invitedEventIds.map(
                  (invitedEventId: string) => {
                    return `id:${invitedEventId}`;
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

                console.log('check');

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
