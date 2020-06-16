import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { GroupService } from 'src/app/services/group.service';
import { EventService } from 'src/app/services/event.service';
import { AuthService } from 'src/app/services/auth.service';
import { Observable } from 'rxjs';
import { Group } from 'src/app/interfaces/group';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, map } from 'rxjs/operators';
import { Event } from 'src/app/interfaces/event';
@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss'],
})
export class CreateEventComponent implements OnInit {
  isComplete = false;

  ifTarget = false;

  noGroup = false;

  eventid: string;

  groupid: string;

  attendingmembers: string[];

  waitingMemberIds: string[];

  admingroups$: Observable<Group[]> = this.groupService.getAdminGroup(
    this.authService.uid
  );

  form = this.fb.group({
    groupid: ['', [Validators.required]],
    title: ['', [Validators.required]],
    description: [''],
    memberlimit: [null, [Validators.required]],
    date: [null, [Validators.required]],
    time: ['', [Validators.required]],
    location: ['', [Validators.required]],
    price: [0],
    private: [false],
    searchable: [false],
  });

  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }
    return value;
  }

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private db: AngularFirestore,
    private authService: AuthService,
    private groupService: GroupService,
    private eventService: EventService
  ) {
    this.activatedRoute.queryParamMap
      .pipe(
        switchMap((params) => {
          return this.eventService.getEvent(params.get('id'));
        })
      )
      .subscribe((event: Event) => {
        if (!event) {
          return null;
        } else {
          this.ifTarget = true;
          this.groupid = event.groupid;
          this.eventid = event.id;
          this.attendingmembers = event.attendingMemberIds;
          this.waitingMemberIds = event.waitingMemberIds;
          this.form.patchValue({
            ...event,
            date: event.date.toDate(),
          });
        }
      });
  }

  ngOnInit(): void {
    this.admingroups$.subscribe((admingroups: Group[]) => {
      console.log('map working');
      if (admingroups.length) {
        this.noGroup = false;
        console.log('noGroup is false');
      } else {
        this.noGroup = true;
        console.log('noGroup is true');
      }
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.form.dirty) {
      $event.preventDefault();
      $event.returnValue = 'Your work will be lost. Is it okay?';
    }
  }

  submit() {
    this.eventService
      .createEvent({
        id: this.db.createId(),
        title: this.form.value.title,
        description: this.form.value.description,
        createrId: this.authService.uid,
        memberlimit: this.form.value.memberlimit,
        attendingMemberIds: [],
        date: this.form.value.date,
        time: this.form.value.time,
        location: this.form.value.location,
        groupid: this.form.value.groupid,
        price: this.form.value.price,
        waitingMemberIds: [],
        private: this.form.value.private,
        searchable: this.form.value.searchable,
      })
      .then(() => (this.isComplete = true))
      .then(() => this.router.navigateByUrl('/'));
  }

  update() {
    this.eventService
      .updateEvent(this.authService.uid, {
        id: this.eventid,
        title: this.form.value.title,
        description: this.form.value.description,
        memberlimit: this.form.value.memberlimit,
        attendingMemberIds: this.attendingmembers,
        date: this.form.value.date,
        time: this.form.value.time,
        location: this.form.value.location,
        groupid: this.form.value.groupid,
        price: this.form.value.price,
        waitingMemberIds: this.waitingMemberIds,
        private: this.form.value.private,
        searchable: this.form.value.searchable,
      })
      .then(() => (this.isComplete = true))
      .then(() => this.router.navigateByUrl('/'));
  }

  delete() {
    this.eventService
      .deleteEvent(this.eventid, this.groupid)
      .then(() => this.router.navigateByUrl('/'));
  }
}
