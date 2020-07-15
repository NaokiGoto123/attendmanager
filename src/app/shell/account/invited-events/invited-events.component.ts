import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';
import { Event } from 'src/app/interfaces/event';
import { InviteGetService } from 'src/app/services/invite-get.service';

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
    private invitedGetService: InviteGetService
  ) {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      const searchId = params.get('id');
      this.userService
        .getUserFromSearchId(searchId)
        .subscribe((target: User) => {
          const id = target.uid;
          this.invitedGetService
            .getInvitedEvents(id)
            .subscribe((invitedEvents: Event[]) => {
              this.invitedEvents = invitedEvents;
            });
        });
    });
  }

  ngOnInit(): void {}
}
