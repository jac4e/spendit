import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountService } from '../_services';
import { Router } from '@angular/router';
import { User, Link } from '../_models';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass']
})
export class NavbarComponent implements OnInit {
  brand = {
    name: 'cryptoPhrydge',
    image: ''
  };
  links: Link[] = [
    { title: 'Store', route: '', guards: ['none'] },
    { title: 'Dashboard', route: 'dashboard', guards: ['admin'] },
    { title: 'Account', route: 'account', guards: ['loggedIn'] },
    { title: 'Login', route: 'login', guards: ['loggedOut'] }
  ];

  public isMenuCollapsed = true;
  public isCartCollapsed = true;
  account!: User | null;
  balance: number | undefined;
  fragment!: string;
  constructor(private accountService: AccountService, private router: Router) {
    // get observable account
    this.accountService.account.subscribe((account) => {
      this.account = account;
    });

    // update account
    this.accountService.refreshAccount();

    this.balance = this.account?.balance;
  }

  ngOnInit(): void {}

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
          // console.log('loggedin', this.account !== null);
          break;
        case 'loggedOut':
          truthy = truthy && this.account === null;
          // console.log('loggedout', this.account === null);
          break;
        case 'admin':
          truthy = truthy && this.account?.role === 'admin';
          // console.log('admin', this.account?.role === 'admin');
          break;
        case 'notAdmin':
          truthy = truthy && this.account?.role !== undefined;
          // console.log('notadmin', this.account?.role !== undefined);
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
    this.router.navigate(['']);
  }
}
