import { Component, OnInit } from '@angular/core';
import { Event } from 'src/app/interfaces/event';
import { EventService } from 'src/app/services/event.service';
import { SearchService } from 'src/app/services/search.service';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Group } from 'src/app/interfaces/group';
import { GroupService } from 'src/app/services/group.service';
import { group } from '@angular/animations';
import { FormControl, FormBuilder } from '@angular/forms';
import { map } from 'rxjs/operators';
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
  };

  options = [];

  result: {
    nbHits: number;
    hits: any[];
  };

  valueControl: FormControl = new FormControl();

  groups: Group[];

  events: Event[];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private eventService: EventService,
    private groupService: GroupService,
    private searchService: SearchService
  ) {
    this.eventService
      .getMyEvents(this.authService.uid)
      .subscribe((events: Event[]) => {
        this.events = events;
      });
    this.groupService
      .getMyGroup(this.authService.uid)
      .subscribe((groups: Group[]) => {
        this.groups = groups;

        groups.map((group) => {
          this.form.addControl(`${group.id}`, this.fb.control(false));
        });
        console.log(this.form);

        const filters: string[] = groups.map((group: Group) => {
          return `groupid:${group.id}`;
        });
        this.searchOptions = { facetFilters: [filters] };
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
      console.log(filters);
      this.searchOptions = { facetFilters: [filters] };
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
    this.index.search(query, searchOptions).then((result) => {
      this.result = result;
    });
  }

  clearSearch() {
    this.valueControl.setValue('');
  }
}
