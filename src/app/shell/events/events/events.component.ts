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

  searchOptions = {
    facetFilters: [],
    page: 0,
  };

  options = [];

  items = [];

  valueControl: FormControl = new FormControl();

  groups: Group[];

  events: Event[];

  listView = false;

  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private eventGetService: EventGetService,
    private groupGetService: GroupGetService,
    private searchService: SearchService
  ) {
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
        };

        this.search('', this.searchOptions);

        this.index.search('', this.searchOptions).then((result) => {
          this.options = result.hits;
        });
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
      this.searchOptions = { facetFilters: [filters], page: 0 };
      this.search('', this.searchOptions);

      this.index.search('', this.searchOptions).then((result) => {
        this.options = result.hits;
      });
    });

    this.valueControl.valueChanges.subscribe((query) => {
      this.index.search(query, this.searchOptions).then((result) => {
        this.options = result.hits;
      });
    });
  }

  search(query: string, searchOptions) {
    this.loading = true;
    const execution = new Promise(() => {
      setTimeout(() => {
        this.index.search(query, searchOptions).then((result) => {
          this.items.push(...result.hits);
        });
      }, 2000);
    });
    execution.then(() => {
      this.loading = false;
    });
  }

  additionalSearch() {
    console.log('called');
    this.searchOptions.page++;
    this.search('', this.searchOptions);
  }

  clearSearch() {
    this.valueControl.setValue('');
  }

  toggleView() {
    this.listView = !this.listView;
  }
}
