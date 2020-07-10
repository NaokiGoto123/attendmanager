import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { SearchService } from 'src/app/services/search.service';

export interface DialogData {
  searchId: string;
}

@Component({
  selector: 'app-group-details-diaplog',
  templateUrl: './group-details-diaplog.component.html',
  styleUrls: ['./group-details-diaplog.component.scss'],
})
export class GroupDetailsDiaplogComponent implements OnInit {
  uid = this.authService.uid;

  index = this.searchService.index.users;

  optionOptions = {
    facetFilters: ['covert:false'],
  };

  options = [];

  constructor(
    private authService: AuthService,
    private searchService: SearchService,
    public dialogRef: MatDialogRef<GroupDetailsDiaplogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.index.search('', this.optionOptions).then((result) => {
      this.options = result.hits;
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {}
}
