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
export class FormGuard implements CanDeactivate<CreateGroupComponent> {
  canDeactivate(
    component: CreateGroupComponent
  ): Observable<boolean> | boolean {
    if (component.form.pristine && component.isComplete) {
      return true;
    }

    const confirmation = window.confirm(
      '作業中の内容が失われますがよろしいですか？'
    );

    return of(confirmation);
  }
}
