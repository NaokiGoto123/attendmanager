import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-invited-groups',
  templateUrl: './invited-groups.component.html',
  styleUrls: ['./invited-groups.component.scss'],
})
export class InvitedGroupsComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService
  ) {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      const searchId = params.get('id');
      this.userService
        .getUserFromSearchId(searchId)
        .subscribe((target: User) => {
          const id = target.uid;
        });
    });
  }

  ngOnInit(): void {}
}
