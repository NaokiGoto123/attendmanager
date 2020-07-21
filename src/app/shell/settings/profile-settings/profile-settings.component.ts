import { Component, OnInit } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { User } from 'src/app/interfaces/user';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss'],
})
export class ProfileSettingsComponent implements OnInit {
  user: User;

  photoURL: string;

  imageChangedEvent: any = '';

  croppedImage: any = '';

  // for form
  searchId: string;
  displayName: string;
  description: string;
  covert: boolean;
  openedGroups: boolean;
  openedAttendingEvents: boolean;
  openedAttendedEvents: boolean;
  openedInvitedEvents: boolean;
  openedInvitedGroups: boolean;
  openedWaitingEvents: boolean;
  openedWaitingGroups: boolean;
  openedPayingEvents: boolean;
  openedPayingGroups: boolean;

  form = this.fb.group({
    searchId: [this.searchId],
    displayName: [this.displayName],
    description: [this.description],
    covert: [this.covert],
    openedGroups: [this.openedGroups],
    openedAttendingEvents: [this.openedAttendingEvents],
    openedAttendedEvents: [this.openedAttendedEvents],
    openedInvitedEvents: [this.openedInvitedEvents],
    openedInvitedGroups: [this.openedInvitedGroups],
    openedWaitingEvents: [this.openedWaitingEvents],
    openedWaitingGroups: [this.openedWaitingGroups],
    openedPayingEvents: [this.openedPayingEvents],
    openedPayingGroups: [this.openedPayingGroups],
  });

  constructor(
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private db: AngularFirestore,
    private uiServiec: UiService
  ) {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      const searchId = params.get('id');
      this.userService
        .getUserFromSearchId(searchId)
        .subscribe((target: User) => {
          const id = target?.uid;
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

  deleteAccount() {
    this.uiServiec.deletingAccount = true;
    this.userService
      .deleteAccount(this.user?.uid)
      .then(() => (this.uiServiec.deletingAccount = false));
  }

  createNewSearchId() {
    const newSearchId = this.db.createId();
    this.form.controls.searchId.setValue(newSearchId);
  }

  async updateUser() {
    let photoURL: any;
    if (this.croppedImage) {
      photoURL = await this.userService.upload(
        `users/${this.user.uid}`,
        this.croppedImage
      );
    } else {
      photoURL = this.photoURL;
    }
    this.userService.updateUser({
      uid: this.user.uid,
      searchId: this.form.value.searchId,
      displayName: this.form.value.displayName,
      email: this.user.email,
      photoURL,
      description: this.form.value.description,
      covert: this.form.value.covert,
      openedGroups: this.form.value.openedGroups,
      openedAttendingEvents: this.form.value.openedAttendingEvents,
      openedAttendedEvents: this.form.value.openedAttendedEvents,
      openedInvitedEvents: this.form.value.openedInvitedEvents,
      openedInvitedGroups: this.form.value.openedInvitedGroups,
      openedWaitingEvents: this.form.value.openedWaitingEvents,
      openedWaitingGroups: this.form.value.openedWaitingGroups,
      openedPayingEvents: this.form.value.openedPayingEvents,
      openedPayingGroups: this.form.value.openedPayingGroups,
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
