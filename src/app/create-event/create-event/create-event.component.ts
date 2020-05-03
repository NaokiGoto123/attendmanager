import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss']
})
export class CreateEventComponent implements OnInit {

  form = this.fb.group({
    title: ['', [
      Validators.required
    ]],
    description: [''],
    memberlimit: [''],
    date: ['', [
      Validators.required
    ]],
    time: ['', [
      Validators.required
    ]],
    location: ['', [
      Validators.required
    ]],
  });

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  submit(){
    console.log(this.form.value);
  }

  openSnackBar() {
    this.snackBar.open('Successfully created the event!', '', {
      duration: 3000,
    });
  }

}
