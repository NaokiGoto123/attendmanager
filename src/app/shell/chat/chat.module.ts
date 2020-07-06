import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoutingModule } from './chat-routing.module';
import { ChatComponent } from './chat/chat.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ChatDetailComponent } from './chat-detail/chat-detail.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { ChatRoomMembersComponent } from './chat-room-members/chat-room-members.component';
import { MatBadgeModule } from '@angular/material/badge';

@NgModule({
  declarations: [ChatComponent, ChatDetailComponent, ChatRoomMembersComponent],
  imports: [
    CommonModule,
    ChatRoutingModule,
    MatTabsModule,
    MatListModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSidenavModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatMenuModule,
    MatBadgeModule,
  ],
})
export class ChatModule {}
