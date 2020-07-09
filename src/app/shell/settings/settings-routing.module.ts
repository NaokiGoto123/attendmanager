import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingsComponent } from './settings/settings.component';
import { ProfileSettingsComponent } from './profile-settings/profile-settings.component';
import { PaymentsSettingsComponent } from './payments-settings/payments-settings.component';

const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'profile-settings',
      },
      {
        path: 'profile-settings',
        component: ProfileSettingsComponent,
      },
      {
        path: 'payments-settings',
        component: PaymentsSettingsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {}
