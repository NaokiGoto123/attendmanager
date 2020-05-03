import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss']
})
export class CreateEventComponent implements OnInit {

  form = this.fb.group({
    title: ['', [
      Validators.required // 必須入力にする
    ]],
    description: ['', [
      Validators.required
    ]],
    memberlimit: ['', [
      Validators.required
    ]],
    date: ['', [
      Validators.required
    ]],
    time: ['', [
      Validators.required
    ]],
    location:['', [
      Validators.required
    ]],
  });

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
  }

  submit(){
    console.log(this.form.value);
  }

}
