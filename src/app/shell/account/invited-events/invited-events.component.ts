import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-invited-events',
  templateUrl: './invited-events.component.html',
  styleUrls: ['./invited-events.component.scss'],
})
export class InvitedEventsComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      const searchId = params.get('id');
      this.authService
        .getUserFromSearchId(searchId)
        .subscribe((target: User) => {
          const id = target.uid;
        });
    });
  }

  ngOnInit(): void {}
}
