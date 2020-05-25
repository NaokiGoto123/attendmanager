import { TestBed } from '@angular/core/testing';

import { CreateeventGuard } from './createevent.guard';

describe('CreateeventGuard', () => {
  let guard: CreateeventGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CreateeventGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
