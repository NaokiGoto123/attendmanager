import { Injectable } from '@angular/core';
import {
  CanDeactivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { CreateEventComponent } from '../shell/create-event/create-event/create-event.component';

@Injectable({
  providedIn: 'root',
})
export class CreateEventGuard implements CanDeactivate<CreateEventComponent> {
  canDeactivate(
    component: CreateEventComponent
  ): Observable<boolean> | boolean {
    if (component.form.pristine || component.isComplete) {
      return true;
    }

    const confirmation = window.confirm('Your work will be lost. Is it okay?');

    return of(confirmation);
  }
}
