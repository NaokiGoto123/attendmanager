import { Component, OnInit, HostListener } from '@angular/core';

import { FormBuilder, Validators } from '@angular/forms';
import { GroupService } from 'src/app/services/group.service';
import { AuthService } from 'src/app/services/auth.service';
import { Group } from 'src/app/interfaces/group';
import { User } from 'src/app/interfaces/user';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router, ActivatedRoute } from '@angular/router';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { firestore } from 'firebase';
import { switchMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss'],
})
export class CreateGroupComponent implements OnInit {
  user: User;

  uid: string;

  ifTarget = false;

  isComplete = false;

  groupid: string;

  currencies = ['USD', 'SHP', 'JPY', 'CAD', 'CNY', 'EUR'];

  useMyOwnImage = false;

  imageIds = [...Array(22)].map((_, index) => index);

  config: SwiperConfigInterface = {
    loop: true,
    navigation: true,
    pagination: {
      el: '.pager',
      clickable: true,
    },
    centeredSlides: true,
    slidesPerView: 3,
  };

  selectedImageId = 1;

  imageChangedEvent: any = '';

  croppedImage: any = '';

  form = this.fb.group({
    name: ['', [Validators.required]],
    description: [''],
    price: [0],
    currency: ['', [Validators.required]],
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
    private fb: FormBuilder,
    private db: AngularFirestore,
    private authService: AuthService,
    private userService: UserService,
    private groupSerive: GroupService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private snackbar: MatSnackBar
  ) {
    this.activatedRoute.queryParamMap
      .pipe(
        switchMap((params) => {
          return this.groupSerive.getGroupinfo(params.get('id'));
        })
      )
      .subscribe((group: Group) => {
        if (group) {
          this.ifTarget = true;
          this.groupid = group.id;
          this.form.patchValue(group);
        }
      });
    this.userService.getUser(this.authService.uid).subscribe((user: User) => {
      this.user = user;
      this.uid = user.uid;
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

  async submit() {
    if (this.useMyOwnImage) {
      const groupId = this.db.createId();
      const photoURL = await this.userService.upload(
        `groups/${groupId}`,
        this.croppedImage
      );
      this.groupSerive
        .createGroup(this.uid, {
          id: groupId,
          name: this.form.value.name,
          description: this.form.value.description,
          grouppicture: photoURL,
          createddate: firestore.Timestamp.now(),
          createrId: this.authService.uid,
          chatRoomId: null,
          price: this.form.value.price,
          currency: this.form.value.currency,
          private: this.form.value.private,
          searchable: this.form.value.searchable,
        })
        .then(() => {
          this.isComplete = true;
          this.router.navigateByUrl('groups');
        });
    } else {
      const a = '/assets/background/';
      const selectedImageId: string = this.selectedImageId.toString();
      const b = a.concat(selectedImageId.toString());
      const c = '.jpg';
      const grouppicture: string = b.concat(c);
      console.log(grouppicture);
      this.groupSerive
        .createGroup(this.uid, {
          id: this.db.createId(),
          name: this.form.value.name,
          description: this.form.value.description,
          grouppicture,
          createddate: firestore.Timestamp.now(),
          createrId: this.authService.uid,
          chatRoomId: null,
          price: this.form.value.price,
          currency: this.form.value.currency,
          private: this.form.value.private,
          searchable: this.form.value.searchable,
        })
        .then(() => {
          this.isComplete = true;
          this.router.navigateByUrl('groups');
        });
    }
  }

  async update() {
    if (this.useMyOwnImage) {
      const groupId = this.db.createId();
      const photoURL = await this.userService.upload(
        `groups/${this.groupid}`,
        this.croppedImage
      );
      this.groupSerive
        .createGroup(this.uid, {
          id: this.groupid,
          name: this.form.value.name,
          description: this.form.value.description,
          grouppicture: photoURL,
          createddate: firestore.Timestamp.now(),
          createrId: this.authService.uid,
          chatRoomId: null,
          price: this.form.value.price,
          currency: this.form.value.currency,
          private: this.form.value.private,
          searchable: this.form.value.searchable,
        })
        .then(() => {
          this.isComplete = true;
          this.router.navigateByUrl('groups');
        });
    } else {
      const a = '/assets/background/';
      const selectedImageId: string = this.selectedImageId.toString();
      const b = a.concat(selectedImageId.toString());
      const c = '.jpg';
      const grouppicture = b.concat(c);
      console.log(grouppicture);
      this.groupSerive
        .updateGroup({
          id: this.groupid,
          name: this.form.value.name,
          description: this.form.value.description,
          grouppicture,
          price: this.form.value.price,
          currency: this.form.value.currency,
          private: this.form.value.private,
          searchable: this.form.value.searchable,
        })
        .then(() => (this.isComplete = true))
        .then(() => this.router.navigateByUrl('/groups'))
        .then(() =>
          this.snackbar.open('Successfully updated the group', null, {
            duration: 2000,
          })
        );
    }
  }

  delete() {
    this.groupSerive
      .deleteGroup(this.groupid)
      .then(() => (this.isComplete = true))
      .then(() => this.router.navigateByUrl('/groups'))
      .then(() =>
        this.snackbar.open('Successfully deleted the group', null, {
          duration: 2000,
        })
      );
  }

  switchUseMyOwnImage() {
    this.useMyOwnImage = !this.useMyOwnImage;
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
}
