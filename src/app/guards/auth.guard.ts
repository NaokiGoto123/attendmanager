import { Injectable } from '@angular/core';
// tslint:disable-next-line: max-line-length
import {
  CanActivate,
  CanLoad,
  Route,
  UrlSegment,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { map, take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.auth.user$.pipe(
      map((user) => !!user),
      tap((isLoggedin) => {
        if (!isLoggedin) {
          this.router.navigateByUrl('/welcome');
        }
      })
    );
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.auth.user$.pipe(
      map((user) => !!user),
      tap((isLoggedin) => {
        if (!isLoggedin) {
          this.router.navigateByUrl('/welcome');
        }
      })
    );
  }
}
