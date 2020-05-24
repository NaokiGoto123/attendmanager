import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { GroupService } from 'src/app/services/group.service';
import { EventService } from 'src/app/services/event.service';
import { AuthService } from 'src/app/services/auth.service';
import { Observable } from 'rxjs';
import { Group } from 'src/app/interfaces/group';
import { AngularFirestore } from '@angular/fire/firestore';
@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss'],
})
export class CreateEventComponent implements OnInit {
  form = this.fb.group({
    groupid: ['', [Validators.required]],
    title: ['', [Validators.required]],
    description: [''],
    memberlimit: [0],
    date: ['', [Validators.required]],
    time: ['00:00', [Validators.required]],
    location: ['', [Validators.required]],
  });
  // tslint:disable-next-line: max-line-length
  originalgroups$: Observable<Group[]> = this.groupService.getAdminGroup(
    this.authService.uid
  );

  // tslint:disable-next-line: max-line-length
  constructor(
    private fb: FormBuilder,
    private db: AngularFirestore,
    private authService: AuthService,
    private groupService: GroupService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {}

  submit() {
    this.eventService.createEvent({
      eventid: this.db.createId(),
      title: this.form.value.title,
      description: this.form.value.description,
      memberlimit: this.form.value.memberlimit,
      attendingmembers: [],
      date: this.form.value.date,
      time: this.form.value.time,
      location: this.form.value.location,
      groupid: this.form.value.groupid,
    });
  }
}
