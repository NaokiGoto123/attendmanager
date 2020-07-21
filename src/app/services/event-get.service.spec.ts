import { TestBed } from '@angular/core/testing';

import { EventGetService } from './event-get.service';

describe('EventGetService', () => {
  let service: EventGetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventGetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
