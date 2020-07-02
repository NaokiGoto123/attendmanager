import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/interfaces/user';
import * as Jimp from 'jimp';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from 'src/app/services/user.service';

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
  searchId: string;
  displayName: string;
  description: string;
  showGroups: boolean;
  showAttendingEvents: boolean;
  showAttendedEvents: boolean;

  form = this.fb.group({
    searchId: [this.searchId],
    displayName: [this.displayName],
    description: [this.description],
    showGroups: [this.showGroups],
    showAttendingEvents: [this.showAttendingEvents],
    showAttendedEvents: [this.showAttendedEvents],
  });

  constructor(
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private db: AngularFirestore
  ) {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      const searchId = params.get('id');
      this.userService
        .getUserFromSearchId(searchId)
        .subscribe((target: User) => {
          const id = target.uid;
          this.userService.getUser(id).subscribe((user) => {
            this.user = user;
            this.photoURL = user.photoURL;
            this.form.patchValue(this.user);
          });
        });
    });
  }

  signOut() {
    this.authService.signOut();
  }

  createNewSearchId() {
    const newSearchId = this.db.createId();
    console.log(newSearchId);
    this.form.controls.searchId.setValue(newSearchId);
  }

  async updateUser() {
    let photoURL: any;
    if (this.croppedImage) {
      photoURL = await this.userService.upload(
        `usres/${this.user.uid}`,
        this.croppedImage
      );
    } else {
      photoURL = this.photoURL;
    }
    console.log(photoURL);
    this.userService.updateUser({
      uid: this.user.uid,
      searchId: this.form.value.searchId,
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
