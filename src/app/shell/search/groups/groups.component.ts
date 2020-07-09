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
  };

  options = [];

  result: {
    nbHits: number;
    hits: any[];
  };

  valueControl: FormControl = new FormControl();

  searchableGroups: Group[];

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
      this.result = result;
      console.log(result);
    });
  }

  clearSearch() {
    this.valueControl.setValue('');
  }
}
