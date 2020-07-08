import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { EventService } from 'src/app/services/event.service';
import { GroupService } from 'src/app/services/group.service';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss'],
})
export class AccountsComponent implements OnInit {
  valueControl: FormControl = new FormControl();

  index = this.searchService.index.users;

  searchOptions = {
    facetFilters: [],
  };

  result: {
    nbHits: number;
    hits: any[];
  };

  constructor(
    private authService: AuthService,
    private eventService: EventService,
    private groupService: GroupService,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {}

  search(query: string, searchOptions) {
    this.index.search(query, searchOptions).then((result) => {
      this.result = result;
      console.log(result);
    });
  }

  clearSearch() {
    this.valueControl.setValue('');
  }
}
