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
import { EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';
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

  form = this.fb.group({
    groupid: ['', [Validators.required]],
    title: ['', [Validators.required]],
    description: [''],
    memberlimit: [null, [Validators.required]],
    date: [null, [Validators.required]],
    time: ['', [Validators.required]],
    location: ['', [Validators.required]],
  });

  admingroups$: Observable<Group[]> = this.groupService.getAdminGroup(
    this.authService.uid
  );

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
          this.eventid = event.eventid;
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
        eventid: this.db.createId(),
        title: this.form.value.title,
        description: this.form.value.description,
        creater: this.authService.uid,
        memberlimit: this.form.value.memberlimit,
        attendingmembers: [],
        date: this.form.value.date,
        time: this.form.value.time,
        location: this.form.value.location,
        groupid: this.form.value.groupid,
      })
      .then(() => (this.isComplete = true))
      .then(() => this.router.navigateByUrl('/'));
  }

  update() {
    this.eventService
      .updateEvent(this.authService.uid, {
        eventid: this.eventid,
        title: this.form.value.title,
        description: this.form.value.description,
        memberlimit: this.form.value.memberlimit,
        attendingmembers: [],
        date: this.form.value.date,
        time: this.form.value.time,
        location: this.form.value.location,
        groupid: this.form.value.groupid,
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
