import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';
import { Event } from 'src/app/interfaces/event';
import { EventGetService } from 'src/app/services/event-get.service';
import { InviteService } from 'src/app/services/invite.service';

@Component({
  selector: 'app-invited-events',
  templateUrl: './invited-events.component.html',
  styleUrls: ['./invited-events.component.scss'],
})
export class InvitedEventsComponent implements OnInit {
  invitedEvents: Event[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private eventGetService: EventGetService,
    private invitedService: InviteService
  ) {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      const searchId = params.get('id');
      this.userService
        .getUserFromSearchId(searchId)
        .subscribe((target: User) => {
          const id = target.uid;
          this.invitedService
            .getInvitedEvents(id)
            .subscribe((invitedEvents: Event[]) => {
              this.invitedEvents = invitedEvents;
            });
        });
    });
  }

  ngOnInit(): void {}
}
