import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { Event } from 'src/app/interfaces/event';
import { FormControl } from '@angular/forms';
import { SearchService } from 'src/app/services/search.service';
import { EventGetService } from 'src/app/services/event-get.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EventsComponent implements OnInit {
  index = this.searchService.index.events_date;

  searchOptions = {
    facetFilters: ['searchable:true'],
  };

  options = [];

  result: {
    nbHits: number;
    hits: any[];
  };

  valueControl: FormControl = new FormControl();

  searchableEvents: Event[];

  constructor(
    private eventService: EventService,
    private eventGetService: EventGetService,
    private searchService: SearchService
  ) {
    this.eventGetService
      .getSearchableEvents()
      .subscribe((searchableEvents: Event[]) => {
        this.searchableEvents = searchableEvents;
      });
    this.search('', this.searchOptions);

    this.index.search('', this.searchOptions).then((result) => {
      this.options = result.hits;
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
      this.result = result;
    });
  }

  clearSearch() {
    this.valueControl.setValue('');
  }
}
