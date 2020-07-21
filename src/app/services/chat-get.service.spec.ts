import { TestBed } from '@angular/core/testing';

import { ChatGetService } from './chat-get.service';

describe('ChatGetService', () => {
  let service: ChatGetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatGetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
