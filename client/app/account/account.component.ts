import { Component, DoCheck, OnInit } from '@angular/core';
import { AccountService } from '../_services';
import { IAccount, Roles } from 'typesit';
import { Router } from '@angular/router';
import { Link } from '../_models';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.sass']
})
export class AccountComponent implements DoCheck {
  account = {} as IAccount;
  links: Link[]  = [
    { title: 'Overview', route: '/account/overview' },
    { title: 'Refill', route: '/account/refill', guards: ['notAdmin'] },
    { title: 'Settings', route: '/account/settings' },
    { title: 'Transactions', route: '/account/transactions', guards: ['notAdmin'] }
  ];
  url: string;

  // page stuff
  constructor(private accountService: AccountService, private router: Router) {
    this.accountService.account.subscribe((account) => {
      if (account !== null) {
        this.account = account;
      }
    });
    this.url = this.router.url;
  }

  ngDoCheck(): void {
    this.url = this.router.url;
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
}
