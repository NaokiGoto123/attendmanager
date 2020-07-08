import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
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

  options = [];

  result: {
    nbHits: number;
    hits: any[];
  };

  constructor(private searchService: SearchService) {
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
      console.log(result);
    });
  }

  clearSearch() {
    this.valueControl.setValue('');
  }
}
