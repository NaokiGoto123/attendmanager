import { Component, OnInit, Input } from '@angular/core';
import { Event } from 'src/app/interfaces/event';
import { AuthService } from 'src/app/services/auth.service';
import { GroupService } from 'src/app/services/group.service';
import { Observable } from 'rxjs';
import { EventService } from 'src/app/services/event.service';
@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss'],
})
export class EventCardComponent implements OnInit {
  @Input() event: Event;

  ifadmin: Observable<boolean>; // イベントを保有しているグループの管理者であるかの確認。Trueかfalseを返す

  attended = false;

  createrName: Observable<string>;

  groupName: Observable<string>;

  eventid: string;

  grouppicture: Observable<number>;

  constructor(
    private authService: AuthService,
    private groupService: GroupService,
    public eventService: EventService
  ) {}

  ngOnInit(): void {
    this.createrName = this.authService.getName(this.event.creater);

    this.groupName = this.groupService.getGroupName(this.event.groupid);

    this.eventid = this.event.eventid;

    this.grouppicture = this.groupService.getGrouppicture(this.event.groupid);

    this.ifadmin = this.groupService.checkIfAdmin(
      this.authService.uid,
      this.event.groupid
    );

    if (this.event.attendingmembers.includes(this.authService.uid)) {
      this.attended = true;
    } else {
      this.attended = false;
    }
  }

  attendEvent() {
    this.switchStatus();
    this.eventService.attendEvent(this.authService.uid, this.eventid);
  }

  leaveEvent() {
    this.switchStatus();
    this.eventService.leaveEvent(this.authService.uid, this.eventid);
  }

  switchStatus() {
    this.attended = !this.attended;
  }
}
