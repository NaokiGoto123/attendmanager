import { TestBed } from '@angular/core/testing';

import { FormGuard } from './creategroup.guard';

describe('FormGuard', () => {
  let guard: FormGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(FormGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
