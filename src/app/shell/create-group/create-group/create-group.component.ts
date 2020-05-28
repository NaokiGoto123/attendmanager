import { Component, OnInit, HostListener } from '@angular/core';

import { FormBuilder, Validators } from '@angular/forms';
import { GroupService } from 'src/app/services/group.service';
import { AuthService } from 'src/app/services/auth.service';
import { Group } from 'src/app/interfaces/group';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss'],
})
export class CreateGroupComponent implements OnInit {
  isComplete = false;

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

  form = this.fb.group({
    name: ['', [Validators.required]],
    description: [''],
  });

  constructor(
    private fb: FormBuilder,
    private db: AngularFirestore,
    private authService: AuthService,
    private groupSerive: GroupService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.form.dirty) {
      $event.preventDefault();
      $event.returnValue = 'Your work will be lost. Is it okay?';
    }
  }

  submit() {
    this.groupSerive
      .createGroup({
        groupid: this.db.createId(),
        name: this.form.value.name,
        description: this.form.value.description,
        grouppicture: this.selectedImageId,
        createddate: new Date(),
        creater: this.authService.uid,
        admin: [this.authService.uid],
        members: [this.authService.uid],
        eventIDs: [],
      })
      .then(() => {
        this.isComplete = true;
        this.router.navigateByUrl('groups');
      });
  }
}
