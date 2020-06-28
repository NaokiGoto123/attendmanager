import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitingJoinningGroupsComponent } from './waiting-joinning-groups.component';

describe('WaitingJoinningGroupsComponent', () => {
  let component: WaitingJoinningGroupsComponent;
  let fixture: ComponentFixture<WaitingJoinningGroupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WaitingJoinningGroupsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaitingJoinningGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
