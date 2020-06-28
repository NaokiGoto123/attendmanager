import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/interfaces/user';
import * as Jimp from 'jimp';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  user: User;

  photoURL: string;

  imageChangedEvent: any = '';

  croppedImage: any = '';

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

  signOut() {
    this.authService.signOut();
  }

  async updateUser() {
    console.log(this.imageChangedEvent);
    const photoURL = await this.authService.upload(
      `usres/${this.user.uid}`,
      this.croppedImage
    );
    console.log(photoURL);
    this.authService.updateUser({
      uid: this.user.uid,
      displayName: this.form.value.displayName,
      email: this.user.email,
      photoURL,
      description: this.form.value.description,
      showGroups: this.form.value.showGroups,
      showAttendingEvents: this.form.value.showAttendingEvents,
      showAttendedEvents: this.form.value.showAttendedEvents,
    });
    this.imageChangedEvent = '';
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }
  imageLoaded() {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }

  ngOnInit(): void {}
}
