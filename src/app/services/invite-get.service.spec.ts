import { TestBed } from '@angular/core/testing';

import { InviteGetService } from './invite-get.service';

describe('InviteGetService', () => {
  let service: InviteGetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InviteGetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
