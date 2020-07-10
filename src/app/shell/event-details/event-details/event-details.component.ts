import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Event } from 'src/app/interfaces/event';
import { Group } from 'src/app/interfaces/group';
import { User } from 'src/app/interfaces/user';
import { MatDialog } from '@angular/material/dialog';
import { InviteService } from 'src/app/services/invite.service';
import { EventDialogComponent } from '../event-dialog/event-dialog.component';
import { GroupGetService } from 'src/app/services/group-get.service';
import { EventGetService } from 'src/app/services/event-get.service';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss'],
})
export class EventDetailsComponent implements OnInit {
  event: Event;

  group: Group;

  creater: User;

  searchId: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private eventGetService: EventGetService,
    private userService: UserService,
    private groupGetService: GroupGetService,
    private inviteService: InviteService,
    private dialog: MatDialog
  ) {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      const id = params.get('id');

      this.eventGetService.getEvent(id).subscribe((event: Event) => {
        this.event = event;
        console.log(event);

        this.userService.getUser(event.createrId).subscribe((creater: User) => {
          this.creater = creater;
        });

        this.groupGetService
          .getGroupinfo(event.groupid)
          .subscribe((group: Group) => {
            this.group = group;
          });
      });
    });
  }

  ngOnInit(): void {}

  async openDialog(): Promise<void> {
    const dialogRef = this.dialog.open(EventDialogComponent, {
      width: '350px',
      data: { searchId: this.searchId },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.userService.getUserFromSearchId(result).subscribe((user: User) => {
          if (user) {
            this.inviteService.inviteToEvent(user.uid, this.event.id);
          } else {
            return;
          }
        });
        this.searchId = null;
      } else {
        return;
      }
    });
  }
}
