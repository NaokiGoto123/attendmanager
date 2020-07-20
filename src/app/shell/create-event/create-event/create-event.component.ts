import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { EventGetService } from 'src/app/services/event-get.service';
import { AuthService } from 'src/app/services/auth.service';
import { Group } from 'src/app/interfaces/group';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Event } from 'src/app/interfaces/event';
import { EventService } from 'src/app/services/event.service';
import { GroupGetService } from 'src/app/services/group-get.service';
@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss'],
})
export class CreateEventComponent implements OnInit {
  isComplete = false;

  ifTarget = false;

  eventid: string;

  groupid: string;

  adminGroups: Group[];

  currencies = ['USD', 'SHP', 'JPY', 'CAD', 'CNY', 'EUR'];

  ifMemberLimit = false;

  form = this.fb.group({
    groupid: ['', [Validators.required]],
    title: ['', [Validators.required]],
    description: [''],
    memberlimit: [null],
    date: [null, [Validators.required]],
    time: ['', [Validators.required]],
    location: ['', [Validators.required]],
    price: [0],
    currency: ['', [Validators.required]],
    private: [false],
    searchable: [true],
  });

  initialLoading = false;

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
    private gorupGetService: GroupGetService,
    private eventService: EventService,
    private eventGetService: EventGetService
  ) {
    this.initialLoading = true;
    this.activatedRoute.queryParamMap.subscribe((params) => {
      const id = params.get('id');
      this.eventGetService.getEvent(id).subscribe((event: Event) => {
        if (event) {
          this.ifTarget = true;
          this.groupid = event.groupid;
          this.eventid = event.id;
          this.form.patchValue({
            ...event,
            date: event.date.toDate(),
          });
          this.initialLoading = false;
        } else {
          const uid: string = this.authService.uid;
          this.gorupGetService
            .getAdminGroup(uid)
            .subscribe((adminGroups: Group[]) => {
              this.adminGroups = adminGroups;
              this.initialLoading = false;
            });
        }
      });
    });
  }

  ngOnInit(): void {}

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.form.dirty) {
      $event.preventDefault();
      $event.returnValue = 'Your work will be lost. Is it okay?';
    }
  }

  submit() {
    let memberlimit: number;
    if (this.ifMemberLimit) {
      memberlimit = this.form.value.memberlimit;
    } else {
      memberlimit = null;
    }
    this.eventService
      .createEvent({
        id: this.db.createId(),
        title: this.form.value.title,
        description: this.form.value.description,
        createrId: this.authService.uid,
        memberlimit,
        date: this.form.value.date,
        time: this.form.value.time,
        location: this.form.value.location,
        groupid: this.form.value.groupid,
        price: this.form.value.price,
        currency: this.form.value.currency,
        private: this.form.value.private,
        searchable: this.form.value.searchable,
      })
      .then(() => (this.isComplete = true))
      .then(() => this.router.navigateByUrl('/'));
  }

  update() {
    let memberlimit: number;
    if (this.ifMemberLimit) {
      memberlimit = this.form.value.memberlimit;
    } else {
      memberlimit = null;
    }
    this.eventService
      .updateEvent(this.authService.uid, {
        id: this.eventid,
        title: this.form.value.title,
        description: this.form.value.description,
        memberlimit,
        date: this.form.value.date,
        time: this.form.value.time,
        location: this.form.value.location,
        groupid: this.form.value.groupid,
        price: this.form.value.price,
        currency: this.form.value.currency,
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
