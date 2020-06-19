import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  user: User;

  photoURL: string;

  // for form
  displayName: string;
  description: string;
  showGroups: boolean;
  showAttendingEvents: boolean;
  showAttendedEvents: boolean;

  form = this.fb.group({
    displayName: [this.displayName],
    description: [this.description],
    showGroups: [this.showGroups],
    showAttendingEvents: [this.showAttendingEvents],
    showAttendedEvents: [this.showAttendedEvents],
  });

  constructor(
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      const id = params.get('id');
      this.authService.getUser(id).subscribe((user) => {
        this.user = user;
        this.photoURL = user.photoURL;
        this.form.patchValue(this.user);
      });
    });
  }

  ngOnInit(): void {}

  signOut() {
    this.authService.signOut();
  }

  updateUser() {
    this.authService.updateUser({
      uid: this.user.uid,
      displayName: this.form.value.displayName,
      email: this.user.email,
      photoURL: this.user.photoURL,
      description: this.form.value.description,
      showGroups: this.form.value.showGroups,
      showAttendingEvents: this.form.value.showAttendingEvents,
      showAttendedEvents: this.form.value.showAttendedEvents,
    });
  }
}
