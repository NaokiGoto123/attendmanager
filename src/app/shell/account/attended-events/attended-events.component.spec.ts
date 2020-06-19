import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendedEventsComponent } from './attended-events.component';

describe('AttendedEventsComponent', () => {
  let component: AttendedEventsComponent;
  let fixture: ComponentFixture<AttendedEventsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AttendedEventsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendedEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
