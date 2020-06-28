import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitingJoinningEventsComponent } from './waiting-joinning-events.component';

describe('WaitingJoinningEventsComponent', () => {
  let component: WaitingJoinningEventsComponent;
  let fixture: ComponentFixture<WaitingJoinningEventsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WaitingJoinningEventsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaitingJoinningEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
