import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';
import { IAccount } from 'typesit';
import { AccountService } from '../_services';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private account!: IAccount | null;
  constructor(private router: Router, private accountService: AccountService) {
    this.accountService.account.subscribe((account) => {
      this.account = account;
    });
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const userRole = this.account?.role;
    if (this.account) {
      if (
        route.data['roles'] &&
        route.data['roles'] &&
        route.data['roles'].filter((role: string) => userRole?.includes(role))
          .length > 0
      ) {
        return true;
      }

      if (route.data['roles'].includes('all')) {
        return true;
      }
    }
    this.router.navigateByUrl('');
    return false;
  }
}
