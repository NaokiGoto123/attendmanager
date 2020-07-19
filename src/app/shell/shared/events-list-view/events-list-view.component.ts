import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Event, EventWithGroupId } from 'src/app/interfaces/event';
import { GroupGetService } from 'src/app/services/group-get.service';
import { Group } from 'src/app/interfaces/group';

@Component({
  selector: 'app-events-list-view',
  templateUrl: './events-list-view.component.html',
  styleUrls: ['./events-list-view.component.scss'],
})
export class EventsListViewComponent implements OnInit {
  @Input() events: Event[];

  @Input() existence: boolean;

  @Output() more: EventEmitter<boolean> = new EventEmitter();

  eventsWithGroupNames: EventWithGroupId[] = [];

  displayedColumns = ['Title', 'Date', 'Location', 'Price', 'Group', 'Details'];

  constructor(private groupGetService: GroupGetService) {}

  ngOnInit(): void {
    this.events.map((event: Event) => {
      this.groupGetService
        .getGroupinfo(event.groupid)
        .subscribe((group: Group) => {
          const eventWithGroup: EventWithGroupId = {
            id: event.id,
            title: event.title,
            description: event.description,
            createrId: event.createrId,
            memberlimit: event.memberlimit,
            date: event.date,
            time: event.time,
            location: event.location,
            groupid: event.groupid,
            price: event.price,
            currency: event.currency,
            private: event.private,
            searchable: event.searchable,
            groupName: group.name,
          };
          this.eventsWithGroupNames.push(eventWithGroup);
          console.log(this.eventsWithGroupNames);
          console.log(this.events);
        });
    });
  }

  moreFunction() {
    this.more.emit(true);
  }
}
