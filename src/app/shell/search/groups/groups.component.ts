import { Component, OnInit } from '@angular/core';
import { Group } from 'src/app/interfaces/group';
import { GroupService } from 'src/app/services/group.service';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'],
})
export class GroupsComponent implements OnInit {
  index = this.searchService.index.groups;

  searchOptions = {
    facetFilters: ['searchable:true'],
    page: 0,
    hitsPerPage: 6,
  };

  options = [];

  items = [];

  valueControl: FormControl = new FormControl();

  searchableGroups: Group[];

  loading = false;

  constructor(
    private groupServiec: GroupService,
    private searchService: SearchService
  ) {
    this.groupServiec.getSearchableGroups().subscribe((groups: Group[]) => {
      this.searchableGroups = groups;
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
      this.items.push(...result.hits);
    });
  }

  additionalSearch() {
    console.log('called');
    if (this.loading) {
      this.searchOptions.page++;
      this.loading = true;
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
