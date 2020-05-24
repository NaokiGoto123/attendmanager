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
export class FormGuard implements CanDeactivate<CreateEventComponent> {
  canDeactivate(
    component: CreateEventComponent
  ): Observable<boolean> | boolean {
    if (component.form.pristine) {
      return true;
    }

    const confirmation = window.confirm(
      '作業中の内容が失われますがよろしいですか？'
    );

    return of(confirmation);
  }
}
