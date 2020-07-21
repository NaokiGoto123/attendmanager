import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SearchService } from 'src/app/services/search.service';
import { UiService } from 'src/app/services/ui.service';

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
    page: 0,
    hitsPerPage: 3,
  };

  optionOptions = {
    facetFilters: ['covert:false'],
  };

  options = [];

  items = [];

  loading = false;

  initialLoading = false;

  constructor(
    private searchService: SearchService,
    public uiService: UiService
  ) {
    this.initialLoading = true;

    this.search('', this.searchOptions);

    this.index.search('', this.optionOptions).then((result) => {
      this.options = result.hits;
    });
  }

  ngOnInit(): void {
    this.valueControl.valueChanges.subscribe((query) => {
      this.index.search(query, this.optionOptions).then((result) => {
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
