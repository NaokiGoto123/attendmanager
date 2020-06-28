import { Component, OnInit } from '@angular/core';
import { Group } from 'src/app/interfaces/group';
import { GroupService } from 'src/app/services/group.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'],
})
export class GroupsComponent implements OnInit {
  searchableGroups: Group[];

  constructor(private groupServiec: GroupService) {
    this.groupServiec.getSearchableGroups().subscribe((groups: Group[]) => {
      console.log(groups);
      this.searchableGroups = groups;
    });
  }

  ngOnInit(): void {}
}
