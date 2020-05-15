import { Component, OnInit } from '@angular/core';

import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GroupService } from 'src/app/services/group.service';
import { AuthService } from 'src/app/services/auth.service';
import { Group } from 'src/app/interfaces/group';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { VirtualTimeScheduler } from 'rxjs';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss'],
})
export class CreateGroupComponent implements OnInit {
  imageIds = [...Array(17)];

  config: SwiperConfigInterface = {
    loop: true,
    navigation: true,
    pagination: true,
    centeredSlides: true,
    slidesPerView: 3,
  };

  selectedImageId = 0;

  form = this.fb.group({
    name: ['', [Validators.required]],
    description: [''],
  });

  constructor(
    private fb: FormBuilder,
    private db: AngularFirestore,
    private authSerive: AuthService,
    private groupSerive: GroupService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  submit() {
    this.groupSerive
      .createGroup({
        groupid: this.db.createId(),
        name: this.form.value.name,
        description: this.form.value.description,
        grouppicture: '',
        creater: this.authSerive.uid,
        admin: [this.authSerive.uid],
        members: [],
        eventIDs: [],
      })
      .then(() => (this.form = null))
      .then(() => this.router.navigateByUrl('groups'));
  }
}
