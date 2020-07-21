import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsListViewComponent } from './events-list-view.component';

describe('EventsListViewComponent', () => {
  let component: EventsListViewComponent;
  let fixture: ComponentFixture<EventsListViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EventsListViewComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
