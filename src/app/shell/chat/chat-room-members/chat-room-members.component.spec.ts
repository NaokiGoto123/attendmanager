import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatRoomMembersComponent } from './chat-room-members.component';

describe('ChatRoomMembersComponent', () => {
  let component: ChatRoomMembersComponent;
  let fixture: ComponentFixture<ChatRoomMembersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChatRoomMembersComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatRoomMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
