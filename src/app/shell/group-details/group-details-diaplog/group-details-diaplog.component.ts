import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

export interface DialogData {
  searchId: string;
}

@Component({
  selector: 'app-group-details-diaplog',
  templateUrl: './group-details-diaplog.component.html',
  styleUrls: ['./group-details-diaplog.component.scss'],
})
export class GroupDetailsDiaplogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<GroupDetailsDiaplogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {}
}
