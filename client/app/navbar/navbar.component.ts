import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountService } from '../_services';
import { Router } from '@angular/router';
import { User } from '../_models';

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
  links = [
    { title: 'Store', route: '', guard: 'none' },
    { title: 'Cart', route: 'cart', guard: 'loggedIn' },
    { title: 'Dashboard', route: 'dashboard', guard: 'admin' },
    { title: 'Account', route: 'account', guard: 'loggedIn' },
    { title: 'Login', route: 'login', guard: 'loggedOut' }
  ];

  public isMenuCollapsed = true;
  account!: User | null;
  balance: number | undefined;
  fragment!: string;
  constructor(private accountService: AccountService, private router: Router) {
    this.accountService.account.subscribe((account) => {
      this.account = account;
    });
    this.balance = this.account?.balance;
  }

  ngOnInit(): void {}

  tabGuard(guard: string) {
    var test = false;
    switch (guard) {
      case 'loggedIn':
        if (this.account) {
          test = true;
        }
        break;
      case 'loggedOut':
        if (this.account === null) {
          test = true;
        }
        break;
      case 'admin':
        if (this.account?.roles?.includes('admin')) {
          test = true;
        }
        break;
      default:
        test = true;
        break;
    }
    // console.log(test)
    return test;
  }

  logout() {
    this.accountService.logout();
    this.router.navigate(['']);
  }
}
