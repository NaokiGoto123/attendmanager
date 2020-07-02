import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { ChatDetailComponent } from './chat-detail/chat-detail.component';
import { ChatRoomMembersComponent } from './chat-room-members/chat-room-members.component';

const routes: Routes = [
  {
    path: '',
    component: ChatComponent,
    children: [
      {
        path: 'chat-detail',
        component: ChatDetailComponent,
      },
      {
        path: 'chat-room-members',
        component: ChatRoomMembersComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatRoutingModule {}
