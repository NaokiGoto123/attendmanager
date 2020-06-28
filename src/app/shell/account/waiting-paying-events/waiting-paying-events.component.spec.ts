import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitingPayingEventsComponent } from './waiting-paying-events.component';

describe('WaitingPayingEventsComponent', () => {
  let component: WaitingPayingEventsComponent;
  let fixture: ComponentFixture<WaitingPayingEventsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WaitingPayingEventsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaitingPayingEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
