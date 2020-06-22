import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsAndDetailComponent } from './events-and-detail.component';

describe('EventsAndDetailComponent', () => {
  let component: EventsAndDetailComponent;
  let fixture: ComponentFixture<EventsAndDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EventsAndDetailComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsAndDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
