import { Component, OnInit } from '@angular/core';

import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
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

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar) {}

  ngOnInit(): void {}

  submit() {
    console.log(this.form.value);
  }

  openSnackBar() {
    this.snackBar.open('Successfully created!', '', {
      duration: 3000,
    });
  }
}
