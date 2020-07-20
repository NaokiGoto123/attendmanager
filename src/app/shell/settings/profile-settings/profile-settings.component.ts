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
  showGroups: boolean;
  showAttendingEvents: boolean;
  showAttendedEvents: boolean;
  showInvitedEvents: boolean;
  showInvitedGroups: boolean;
  showWaitingEvents: boolean;
  showWaitingGroups: boolean;
  showPayingEvents: boolean;
  showPayingGroups: boolean;

  form = this.fb.group({
    searchId: [this.searchId],
    displayName: [this.displayName],
    description: [this.description],
    covert: [this.covert],
    showGroups: [this.showGroups],
    showAttendingEvents: [this.showAttendingEvents],
    showAttendedEvents: [this.showAttendedEvents],
    showInvitedEvents: [this.showInvitedEvents],
    showInvitedGroups: [this.showInvitedGroups],
    showWaitingEvents: [this.showWaitingEvents],
    showWaitingGroups: [this.showWaitingGroups],
    showPayingEvents: [this.showPayingEvents],
    showPayingGroups: [this.showPayingGroups],
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
      showGroups: this.form.value.showGroups,
      showAttendingEvents: this.form.value.showAttendingEvents,
      showAttendedEvents: this.form.value.showAttendedEvents,
      showInvitedEvents: this.form.value.showInvitedEvents,
      showInvitedGroups: this.form.value.showInvitedGroups,
      showWaitingEvents: this.form.value.showWaitingEvents,
      showWaitingGroups: this.form.value.showWaitingGroups,
      showPayingEvents: this.form.value.showPayingEvents,
      showPayingGroups: this.form.value.showPayingGroups,
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
