import { Component, DoCheck, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { AccountService, StoreService } from '../_services';
import { Router } from '@angular/router';
import { IAccount, IProduct, Roles } from 'typesit';
import { Link } from '../_models';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass']
})
export class NavbarComponent implements DoCheck {
  brand = {
    name: 'cryptoPhrydge',
    image: ''
  };
  links: Link[] = [
    { title: 'Store', route: '/', guards: ['none'] },
    { title: 'Dashboard', route: '/dashboard', guards: ['admin'] },
    { title: 'Account', route: '/account', guards: ['loggedIn'] },
    { title: 'Login', route: '/login', guards: ['loggedOut'] }
  ];
  url: string;

  public isMenuCollapsed = true;
  public isCartCollapsed = true;
  cartLength = 0n;
  account!: IAccount | null;
  fragment!: string;
  constructor(
    private accountService: AccountService,
    private storeService: StoreService,
    private router: Router,
    private location: Location
  ) {
    // get observable account
    this.accountService.account.subscribe((account) => {
      this.account = account;
    });
    this.storeService.getCart().subscribe((cart) => {
      let sum = 0n;
      for (let index = 0; index < cart.length; index++) {
        sum += BigInt(cart[index].amount) || 0n;
      }
      this.cartLength = sum;
    });
    this.url = this.location.path().replace(/(?!^)\/.*/g, '');
  }

  ngDoCheck(): void {
    this.url = this.location.path().replace(/(?!^)\/.*/g, '');
    if (this.url === '') {
      this.url = '/';
    }
    // console.log(this.url);
  }

  isZero(number: string | number | bigint | undefined) {
    return number === 0 || number === '0' || number === 0n;
  }

  tabGuard(guards: string[] | undefined) {
    if (!guards) {
      return true;
    }
    // console.log('guards', guards);
    let truthy = true;
    for (const guard of guards) {
      switch (guard) {
        case 'loggedIn':
          truthy = truthy && this.account !== null;
          break;
        case 'loggedOut':
          truthy = truthy && this.account === null;
          break;
        case 'admin':
          truthy = truthy && this.account?.role === Roles.Admin;
          break;
        case 'notAdmin':
          truthy = truthy && this.account?.role !== Roles.Admin;
          break;
        case 'none':
          truthy = truthy && true;
          break;
        default:
          truthy = truthy && false;
          break;
      }
      if (!truthy) break;
    }
    // console.log('truthy:', truthy);
    return truthy;
  }

  logout() {
    this.accountService.logout();
    this.router.navigate(['/']);
  }
}
