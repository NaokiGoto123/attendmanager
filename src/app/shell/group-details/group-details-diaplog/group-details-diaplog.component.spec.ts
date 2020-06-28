import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupDetailsDiaplogComponent } from './group-details-diaplog.component';

describe('GroupDetailsDiaplogComponent', () => {
  let component: GroupDetailsDiaplogComponent;
  let fixture: ComponentFixture<GroupDetailsDiaplogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GroupDetailsDiaplogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupDetailsDiaplogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
