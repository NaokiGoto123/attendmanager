import { TestBed } from '@angular/core/testing';

import { GroupGetService } from './group-get.service';

describe('GroupGetService', () => {
  let service: GroupGetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroupGetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
