import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitedEventsComponent } from './invited-events.component';

describe('InvitedEventsComponent', () => {
  let component: InvitedEventsComponent;
  let fixture: ComponentFixture<InvitedEventsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InvitedEventsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitedEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
