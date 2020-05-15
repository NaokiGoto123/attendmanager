import { Component, OnInit } from '@angular/core';
import { Event } from 'src/app/interfaces/event';
import { GroupService } from 'src/app/services/group.service';
import { Group } from 'src/app/interfaces/group';
import { AuthService } from 'src/app/services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'],
})
export class GroupsComponent implements OnInit {
  event: Event = {
    eventid: '1',
    title: 'Picnic',
    desription: 'You wanna go for a walk this weekend? Join us asap!!',
    limit: 9,
    date: '12/03/2020',
    time: '12:00',
    location: 'Mountian',
    groupid: 'abc123',
    grouppicture: '/assets/background/16.jpg',
  };

  value = 'Look for what you want';

  groups: Observable<Group[]> = this.groupService.getGroup(
    this.authService.uid
  );

  constructor(
    private groupService: GroupService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {}
}
