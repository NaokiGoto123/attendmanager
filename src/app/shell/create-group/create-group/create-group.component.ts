import { Component, OnInit } from '@angular/core';

import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss'],
})
export class CreateGroupComponent implements OnInit {
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
