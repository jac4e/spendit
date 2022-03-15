import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AccountService } from '../_services';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  isLoggedIn!: boolean;
  constructor(
    private router: Router,
    private accountService: AccountService
  ) {
    this.accountService.isLoggedIn().subscribe((isLoggedIn: boolean) => {
      this.isLoggedIn = isLoggedIn;
    })
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const userRole = this.accountService.getRole();
    if (this.isLoggedIn) {
      console.log('loggedin');
      if (route.data['role'] && route.data['role'].indexOf(userRole) === -1) {
        return true;
      }
      if (route.data['role'].indexOf("all") === -1) {
        return true;
      }
    }
    this.router.navigateByUrl('');
    return false;
  }

}
