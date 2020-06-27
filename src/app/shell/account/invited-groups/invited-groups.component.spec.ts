import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitedGroupsComponent } from './invited-groups.component';

describe('InvitedGroupsComponent', () => {
  let component: InvitedGroupsComponent;
  let fixture: ComponentFixture<InvitedGroupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InvitedGroupsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitedGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
