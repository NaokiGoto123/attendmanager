import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings/settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { SharedModule } from '../shared/shared.module';
import { ImageCropperModule } from 'ngx-image-cropper';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { MatMenuModule } from '@angular/material/menu';
import { ProfileSettingsComponent } from './profile-settings/profile-settings.component';
import { PaymentsSettingsComponent } from './payments-settings/payments-settings.component';

@NgModule({
  declarations: [
    SettingsComponent,
    ProfileSettingsComponent,
    PaymentsSettingsComponent,
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatRadioModule,
    SharedModule,
    ImageCropperModule,
    MaterialFileInputModule,
    MatMenuModule,
  ],
})
export class SettingsModule {}
