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
import { AngularFirestore } from '@angular/fire/firestore/firestore';

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

  constructor(
    private fb: FormBuilder,
    private db: AngularFirestore,
    private authSerive: AuthService,
    private groupSerive: GroupService
  ) {}

  ngOnInit(): void {}

  submit() {
    console.log(this.form.value);
    this.groupSerive.createGroup({
      groupid: this.db.createId.toString(),
      name: this.form.value.name,
      description: this.form.value.description,
      grouppicture: '',
      creater: this.authSerive.uid$,
      admin: [this.authSerive.uid$],
      members: [],
      eventIDs: [],
    });
  }
}
