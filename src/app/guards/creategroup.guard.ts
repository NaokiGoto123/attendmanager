import { Injectable } from '@angular/core';
import {
  CanDeactivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { CreateGroupComponent } from '../shell/create-group/create-group/create-group.component';

@Injectable({
  providedIn: 'root',
})
export class CreateGroupGuard implements CanDeactivate<CreateGroupComponent> {
  canDeactivate(
    component: CreateGroupComponent
  ): Observable<boolean> | boolean {
    if (component.form.pristine && component.isComplete) {
      return true;
    }

    const confirmation = window.confirm('Your work will be lost. Is it okay?');

    return of(confirmation);
  }
}
