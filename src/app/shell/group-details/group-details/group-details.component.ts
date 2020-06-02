import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GroupService } from 'src/app/services/group.service';
import { AuthService } from 'src/app/services/auth.service';
import { EventService } from 'src/app/services/event.service';
import { Observable, combineLatest } from 'rxjs';
import { Group } from 'src/app/interfaces/group';
import { map, switchMap } from 'rxjs/operators';
import { Event } from 'src/app/interfaces/event';
import { Location } from '@angular/common';
@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.scss'],
})
export class GroupDetailsComponent implements OnInit {
  id: string;

  ifadmin: Observable<boolean>; // イベントを保有しているグループの管理者であるかの確認。Trueかfalseを返す

  name: Observable<string>;
  description: Observable<string>;
  grouppicture: Observable<number>;
  createddate: Observable<Date>;
  creater: Observable<string>;
  admins: Observable<string[]>;
  members: Observable<string[]>;
  events: Observable<Event[]>;

  constructor(
    private location: Location,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private groupService: GroupService,
    private authService: AuthService,
    private eventService: EventService
  ) {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      this.id = params.get('id');
      this.ifadmin = this.groupService.checkIfAdmin(
        this.authService.uid,
        this.id
      );
      this.name = this.groupService
        .getGroupinfo(this.id)
        .pipe(map((group) => group.name));
      this.description = this.groupService
        .getGroupinfo(this.id)
        .pipe(map((group) => group.description));
      this.grouppicture = this.groupService
        .getGroupinfo(this.id)
        .pipe(map((group) => group.grouppicture));
      this.createddate = this.groupService
        .getGroupinfo(this.id)
        .pipe(map((group) => group.createddate.toDate()));
      this.creater = this.groupService.getGroupinfo(this.id).pipe(
        switchMap(
          (group: Group): Observable<string> => {
            return this.authService.getName(group.creater);
          }
        )
      );
      this.admins = this.groupService.getGroupinfo(this.id).pipe(
        map((group: Group) => {
          return group.admin;
        }),
        switchMap(
          (adminIds: string[]): Observable<string[]> => {
            const result: Observable<string>[] = [];
            adminIds.forEach((admin: string) => {
              result.push(this.authService.getName(admin));
            });
            return combineLatest(result);
          }
        )
      );
      this.members = this.groupService.getGroupinfo(this.id).pipe(
        map((group: Group) => {
          return group.members;
        }),
        switchMap(
          (memberIds: string[]): Observable<string[]> => {
            const result: Observable<string>[] = [];
            memberIds.forEach((member: string) => {
              result.push(this.authService.getName(member));
            });
            return combineLatest(result);
          }
        )
      );
      this.events = this.eventService.getOneGroupEvents(this.id);
    });
  }

  navigateBack() {
    this.location.back();
  }

  ngOnInit(): void {}
}
