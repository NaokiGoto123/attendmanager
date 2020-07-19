import { Component, OnInit } from '@angular/core';
import { Event } from 'src/app/interfaces/event';
import { SearchService } from 'src/app/services/search.service';
import { AuthService } from 'src/app/services/auth.service';
import { Group } from 'src/app/interfaces/group';
import { FormControl, FormBuilder } from '@angular/forms';
import { GroupGetService } from 'src/app/services/group-get.service';
import { EventGetService } from 'src/app/services/event-get.service';
@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EventsComponent implements OnInit {
  index = this.searchService.index.events_date;

  form = this.fb.group({});

  valueControl: FormControl = new FormControl();

  searchOptions = {
    facetFilters: [],
    page: 0,
    hitsPerPage: 3,
  };

  options = [];

  items = [];

  groups: Group[];

  events: Event[];

  listView = false;

  loading = false;

  initialLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private eventGetService: EventGetService,
    private groupGetService: GroupGetService,
    private searchService: SearchService
  ) {
    this.initialLoading = true;
    this.eventGetService
      .getMyEvents(this.authService.uid)
      .subscribe((events: Event[]) => {
        this.events = events;
      });
    this.groupGetService
      .getMyGroup(this.authService.uid)
      .subscribe((groups: Group[]) => {
        this.groups = groups;

        groups.map((group) => {
          this.form.addControl(`${group.id}`, this.fb.control(false));
        });

        const filters: string[] = groups.map((group: Group) => {
          return `groupid:${group.id}`;
        });
        this.searchOptions = {
          facetFilters: [filters],
          page: 0,
          hitsPerPage: 3,
        };
      });
  }

  ngOnInit(): void {
    this.form.valueChanges.subscribe((results) => {
      const selecteds = Object.entries(results)
        .filter(([_, value]) => value)
        .map(([key, value]) => key);
      const filters = selecteds.map((selected) => {
        return `groupid:${selected}`;
      });
      console.log(filters);
      this.searchOptions = { facetFilters: [filters], page: 0, hitsPerPage: 3 };
      this.index.search('', this.searchOptions).then((result) => {
        this.items = result.hits;
      });

      this.index.search('', { facetFilters: [filters] }).then((result) => {
        this.options = result.hits;
      });
    });

    this.valueControl.valueChanges.subscribe((query) => {
      this.index
        .search(query, { facetFilters: this.searchOptions.facetFilters })
        .then((result) => {
          this.options = result.hits;
        });
    });

    setTimeout(() => {
      this.initialLoading = false;
    }, 1000);
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

  toggleView() {
    this.listView = !this.listView;
  }
}
