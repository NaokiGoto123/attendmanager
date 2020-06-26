import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitingPayingGroupsComponent } from './waiting-paying-groups.component';

describe('WaitingPayingGroupsComponent', () => {
  let component: WaitingPayingGroupsComponent;
  let fixture: ComponentFixture<WaitingPayingGroupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WaitingPayingGroupsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaitingPayingGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
